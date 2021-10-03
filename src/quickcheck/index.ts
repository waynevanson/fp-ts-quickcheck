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
import { Arbitrary } from "../arbitrary"
import { failure, state } from "./loop-state"
import * as S from "../modules/fp-ts/state"
import * as gen from "../modules/generators"
import { Property } from "../property"

export interface Loop<A> extends S.State<state.LoopState, A> {}

/**
 * @summary
 * Applies a `Property` to an `Arbitrary`, handling the following `Property`'s
 * return cases:
 *
 * - Failures
 *   - `False`
 *   - Throw `*`
 *   - Throw `Error`
 * - Successes
 *   - Not Throwing
 *   - `True`
 *   - `void`
 */
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

export interface LoopParameters<A> {
  property: Property<A>
  arbitrary: Arbitrary<A>
  // non-negative number
  size: number
}

export const loop = <A>({
  property,
  arbitrary,
}: LoopParameters<A>): Loop<void> =>
  pipe(
    S.gets(
      (state: state.LoopState): gen.GenState => ({
        newSeed: state.seed,
        size: 10,
      }),
    ),
    S.map(runProperty({ arbitrary, property })),
    // use the new seed from the just ran generator
    S.chainFirst(({ newSeed }) => S.modify(state.seedPut(newSeed))),
    // next index please
    S.chainFirst(() => S.modify(state.incrementIndex)),
    S.chain(({ value }) =>
      pipe(
        value,
        // if successful, increment number of successful calls
        E.map(() => S.modify(state.incrementSuccess)),
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

export function run<A>(property: Property<A>, options: QuickCheckOptions) {
  return (arbitrary: Arbitrary<A>): state.LoopState =>
    pipe(
      constVoid(),
      S.chainRec(() =>
        pipe(
          // should we stop test? only when we've reached the specified amount
          S.gets(
            (loopState: state.LoopState) => loopState.index >= options.count,
          ),
          S.chain(
            BL.match(
              // test can run, call the loop and return `left` to try again
              () =>
                pipe(
                  loop({ property, arbitrary, size: options.size }),
                  S.map(E.left),
                ),
              // test is done, so stop it.
              () => S.of(E.right<void, void>(constVoid())),
            ),
          ),
        ),
      ),
      S.execute<state.LoopState>({
        ...state.Monoid.empty,
        seed: mkSeed(options.initialSeed),
      }),
    )
}

/** @throws */
export function handle(fa: state.LoopState): IO.IO<void> {
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
