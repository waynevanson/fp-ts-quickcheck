/**
 * @summary
 * Runs a list of generators, with the option to configure size and the seed number if that's what your heart desires.
 *
 * @description
 *@todo this file should be in quickcheck folder,
 * and all the side effectual stuff for the terminal should be something else.
 */

import { mkSeed } from "@no-day/fp-ts-lcg"
import {
  boolean as BL,
  either as E,
  readonlyArray as A,
  state as S,
} from "fp-ts"
import { constVoid, flow, identity, pipe } from "fp-ts/lib/function"
import { Arbitrary } from "./arbitrary"
import * as gen from "./generators"
import { Property } from "./property"
import * as loop from "./quickcheck/loop-state"
import { tailRecM } from "./utils"

// threw as new value,
// runs the arbitrary and figures out if we got an error or not
// check if the error was a thrown error or a normal error
export function runProperty<A>(
  arbitrary: Arbitrary<A>,
  property: Property<A>,
): gen.Gen<E.Either<unknown, void>> {
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

// call when we need to loop again
export const onRepeat = <A>(property: Property<A>, arbitrary: Arbitrary<A>) =>
  pipe(
    S.gets(
      (state: loop.LoopState): gen.GenState => ({
        newSeed: state.seed,
        size: 10,
      }),
    ),
    S.map(runProperty(arbitrary, property)),
    S.map(([value, { newSeed }]) => ({ newSeed, value })),
    // use the new seed from the just ran generator
    S.chainFirst(({ newSeed }) => loop.withSeed(newSeed)),
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
}

// throw when things go bad or something
export function assert<A>(property: Property<A>, options: QuickCheckOptions) {
  return (Arbitrary: Arbitrary<A>) =>
    pipe(
      S.of<loop.LoopState, void>(constVoid()),
      // this is where the work happens
      tailRecM(S.Monad)(() =>
        pipe(
          S.gets((a: loop.LoopState) => a.index >= options.count),

          S.chain(
            BL.matchW(
              () => pipe(onRepeat(property, Arbitrary), S.map(E.left)),
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
        seed: mkSeed(options.initialSeed),
      }),
    )
}

// when an error happens we should advise what cooked up.

// show them the first. if they want more, require "verbose" flag in options
// that will show more than just the first test failed.
// if they want it looged in a file,
