/**
 * @summary
 * Runs a list of generators, with the option to configure size and the seed number if that's what your heart desires.
 *
 * @description
 *@todo this file should be in quickcheck folder,
 * and all the side effectual stuff for the terminal should be something else.
 */

import { mkSeed } from "@no-day/fp-ts-lcg"
import { boolean as BL, either as E, readonlyArray as A } from "fp-ts"
import { constVoid, flow, identity, pipe } from "fp-ts/lib/function"
import { Arbitrary } from "./arbitrary"
import * as gen from "./modules/generators"
import { Property } from "./property"
import { loopState, failure } from "./loop-state"
import * as S from "./modules/fp-ts/state"

export interface Loop<A> extends S.State<loopState.LoopState, A> {}

// threw as new value,
// runs the arbitrary and figures out if we got an error or not
// check if the error was a thrown error or a normal error
export function propertyResult<A>({
  arbitrary,
  property,
}: {
  arbitrary: Arbitrary<A>
  property: Property<A>
}) {
  return pipe(
    arbitrary.arbitrary,
    S.map(
      flow(
        E.tryCatchK(property, identity),
        E.chain(
          E.fromPredicate(
            (a) => a !== false,
            (e) => e as unknown,
          ),
        ),
        E.map(constVoid),
      ),
    ),
    S.bindTo("value"),
    S.bind("newSeed", () => S.gets((genState) => genState.newSeed)),
  )
}

export interface OnRepeatParameters<A> {
  property: Property<A>
  arbitrary: Arbitrary<A>
  // non-negative number
  size: number
}

// call when we need to loop again
export const loop = <A>({
  property,
  arbitrary,
}: OnRepeatParameters<A>): Loop<void> =>
  pipe(
    S.gets(
      (state: loopState.LoopState): gen.GenState => ({
        newSeed: state.seed,
        size: 10,
      }),
    ),
    S.map(propertyResult({ arbitrary, property })),
    S.map(([results]) => results),
    // use the new seed from the just ran generator
    S.chainFirst(({ newSeed }) => S.modify(loopState.seedPut(newSeed))),
    // next index please
    S.chainFirst(() => S.modify(loopState.incrementIndex)),
    S.chain(({ value }) =>
      pipe(
        value,
        E.map(() => S.modify(loopState.incrementSuccess)),
        E.getOrElse(flow(failure.make, S.chain(failure.append))),
      ),
    ),
  )

export interface QuickCheckOptions {
  initialSeed: number
  count: number
  size: number
}

// throw when things go bad or something
export function run<A>(
  property: Property<A>,
  { count, initialSeed, size }: QuickCheckOptions,
) {
  return (arbitrary: Arbitrary<A>): loopState.LoopState =>
    pipe(
      constVoid(),
      // this is where the work happens
      S.chainRec(() =>
        pipe(
          // if greater than count, stop
          S.gets((loopState: loopState.LoopState) => loopState.index >= count),
          S.chain(
            BL.matchW(
              () => pipe(loop({ property, arbitrary, size }), S.map(E.left)),
              () => S.of(E.right<void, void>(constVoid())),
            ),
          ),
        ),
      ),
      // initial state - seed should be random af on some other functions
      S.execute<loopState.LoopState>({
        ...loopState.Monoid.empty,
        seed: mkSeed(initialSeed),
      }),
    )
}

// when an error happens we should advise what cooked up.

// show them the first. if they want more, require "verbose" flag in options
// that will show more than just the first test failed.
// if they want it looged in a file,
