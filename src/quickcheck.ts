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
import * as gen from "./generators"
import { Property } from "./property"
import * as loop from "./quickcheck/loop-state"
import * as S from "./state"

// threw as new value,
// runs the arbitrary and figures out if we got an error or not
// check if the error was a thrown error or a normal error
export function propertyResult<A>({
  arbitrary,
  property,
}: {
  arbitrary: Arbitrary<A>
  property: Property<A>
}): gen.Gen<E.Either<unknown, void>> {
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
  )
}

export interface OnRepeatParameters<A> {
  property: Property<A>
  arbitrary: Arbitrary<A>
  // non-negative number
  size: number
}

// call when we need to loop again
export const onRepeat = <A>({
  property,
  arbitrary,
}: OnRepeatParameters<A>): loop.Loop<void> =>
  pipe(
    S.gets(
      (state: loop.LoopState): gen.GenState => ({
        newSeed: state.seed,
        size: 10,
      }),
    ),
    S.map(propertyResult({ arbitrary, property })),
    S.map(([value, { newSeed }]) => ({ newSeed, value })),
    // use the new seed from the just ran generator
    S.chainFirst(({ newSeed }) => loop.seedPut(newSeed)),
    S.chainFirst(() => loop.incrementIndex),
    S.chain(({ value }) =>
      pipe(
        value,
        E.match(loop.onFailure, () => loop.onSuccess),
      ),
    ),
  )

export interface QuickCheckOptions {
  initialSeed: number
  count: number
  size: number
}

// throw when things go bad or something
export function assert<A>(
  property: Property<A>,
  { count, initialSeed, size }: QuickCheckOptions,
) {
  return (arbitrary: Arbitrary<A>): loop.LoopState =>
    pipe(
      constVoid(),
      // this is where the work happens
      S.chainRec(() =>
        pipe(
          // if greater than count, stop
          S.gets((loopState: loop.LoopState) => loopState.index >= count),
          S.chain(
            BL.matchW(
              () =>
                pipe(onRepeat({ property, arbitrary, size }), S.map(E.left)),
              () => S.of(E.right<void, void>(constVoid())),
            ),
          ),
        ),
      ),
      // initial state - seed should be random af on some other functions
      S.execute<loop.LoopState>({
        failures: A.zero<loop.LoopFailure>(),
        index: 0,
        successes: 0,
        seed: mkSeed(initialSeed),
      }),
    )
}

// when an error happens we should advise what cooked up.

// show them the first. if they want more, require "verbose" flag in options
// that will show more than just the first test failed.
// if they want it looged in a file,
