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
import { AssertionError } from "assert/strict"

export interface Property<A> {
  (value: A): boolean | void
}

export interface Loop<A> extends S.State<state.LoopState, A> {}

// /**
//  * @todo `AssertionError` for `false` should have custom name
//  */
// export const onPropertyFailure = (fa: PropertyFailure) =>
//   pipe(
//     fa,
//     match.match({
//       ThrownError: ({ error }) => error,
//       false: () =>
//       _: () => new Error(),
//     }),
//   )

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
 *
 * @todo lift async arbs to top, using perhaps the FromIO or MonadThrow
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
        E.tryCatchK(
          property,
          (thrown): Error =>
            thrown instanceof Error
              ? thrown
              : new Error(JSON.stringify(thrown)),
        ),
        // if boolean, false is an error
        E.chainW(
          E.fromPredicate(
            (a): a is true | void => a !== false,
            () =>
              new AssertionError({
                actual: false,
                expected: true,
                operator: "assert",
                message: `Received false from property instead of true`,
              }),
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
    // get genState from loopState
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

export interface QuickcheckParameters {}

/**
 * @summary
 * The brains of the beast. Calls the property `options.count` amount of
 * times, and stopping whenever the property fails.
 *
 * @todo Provide option to get all failures, instead of stopping at the first.
 */
export function quickcheck<A>(
  property: Property<A>,
  options: QuickCheckOptions,
) {
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

/**
 * @summary
 *
 */
export function assertErrors(fa: state.LoopState): IO.IO<void> {
  return pipe(
    fa.failures,
    E.fromPredicate(A.isNonEmpty, (a) => a as []),
    E.map(
      A.map(({ data, index, seed }) =>
        JSON.stringify({ seed, index, data }, null, 2),
      ),
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

/**
 * @summary
 * Asserts that a property passes when generating pseudorandom values,
 * otherwise it **throws**.
 *
 * Use this in a test runner which can handle exceptions.
 *
 * @throws
 */
export function assert<A>(
  property: Property<A>,
  options?: Partial<QuickCheckOptions>,
) {
  return flow(
    quickcheck(
      property,
      Object.assign({ count: 10, initialSeed: 0, size: 10 }, options),
    ),
    assertErrors,
  )
}
