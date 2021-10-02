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
  io as IO,
  reader as R,
  readonlyArray as A,
  readonlyTuple as TP,
} from "fp-ts"
import { constVoid, flow, identity, pipe } from "fp-ts/lib/function"
import { Arbitrary } from "./arbitrary"
import { failure, loopState } from "./loop-state"
import * as S from "./modules/fp-ts/state"
import * as gen from "./modules/generators"
import { Property } from "./property"

export interface Loop<A> extends S.State<loopState.LoopState, A> {}

// threw as new value,
// runs the arbitrary and figures out if we got an error or not
// check if the error was a thrown error or a normal error
export function runProperty<A>({
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
        // get errors if the property throws
        E.tryCatchK(property, identity),
        // if boolean, false is an error
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
    R.map(TP.fst),
  )
}

export interface OnRepeatParameters<A> {
  property: Property<A>
  arbitrary: Arbitrary<A>
  // non-negative number
  size: number
}

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
    S.map(runProperty({ arbitrary, property })),
    // use the new seed from the just ran generator
    S.chainFirst(({ newSeed }) => S.modify(loopState.seedPut(newSeed))),
    // next index please
    S.chainFirst(() => S.modify(loopState.incrementIndex)),
    S.chain(({ value }) =>
      pipe(
        value,
        // if successful, increment number of successful calls
        E.map(() => S.modify(loopState.incrementSuccess)),
        // add a failure to the list of failures
        E.getOrElse(flow(failure.make, S.chain(failure.append))),
      ),
    ),
  )

export interface QuickCheckOptions {
  initialSeed: number
  count: number
  size: number
}

export function run<A>(
  property: Property<A>,
  { count, initialSeed, size }: QuickCheckOptions,
) {
  return (arbitrary: Arbitrary<A>): loopState.LoopState =>
    pipe(
      constVoid(),
      S.chainRec(() =>
        pipe(
          // should we stop test? only when we've reached the specified amount
          S.gets((loopState: loopState.LoopState) => loopState.index >= count),
          S.chain(
            BL.matchW(
              // test can run, call the loop and return `left` to try again
              () => pipe(loop({ property, arbitrary, size }), S.map(E.left)),
              // test is done, so stop it.
              () => S.of(E.right<void, void>(constVoid())),
            ),
          ),
        ),
      ),
      S.execute<loopState.LoopState>({
        ...loopState.Monoid.empty,
        seed: mkSeed(initialSeed),
      }),
    )
}

/** @throws */
export function handle(fa: loopState.LoopState): IO.IO<void> {
  return pipe(
    fa.failures,
    E.fromPredicate(A.isNonEmpty, (a) => a as []),
    E.map(
      A.map(({ data, index, seed }) => JSON.stringify({ seed, index, data })),
    ),
    E.map((xs) => xs.join("\n")),
    E.map(
      (message) =>
        new Error(`Error occured, here is some information: \n${message}`),
    ),
    E.swap,
    E.map(() => IO.of(constVoid())),
    E.getOrElseW((error) => () => {
      throw error
    }),
  )
}

export function assert<A>(
  property: Property<A>,
  options?: Partial<QuickCheckOptions>,
) {
  return flow(
    run(
      property,
      Object.assign({ count: 10, initialSeed: 0, size: 10 }, options),
    ),
    handle,
  )
}
// on error, return some sort of error.
// on success, no dramas. log that lots of tests were ran.

// export function runIO<A>(
//   property: Property<IO.IO<A>>,
//   { count, initialSeed, size }: QuickCheckOptions,
// ): IO.IO<void> {

// }

// export function runTask<A>(
//   property: Property<T.Task<A>>,
//   { count, initialSeed, size }: QuickCheckOptions,
// ): T.Task<void> {}

// when an error happens we should advise what cooked up.

// show them the first. if they want more, require "verbose" flag in options
// that will show more than just the first test failed.
// if they want it looged in a file,
