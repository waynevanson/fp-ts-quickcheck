import { AssertionError } from "assert"
import {
  either as E,
  identity as I,
  io as IO,
  ioEither as IOE,
  option as O,
} from "fp-ts"
import { HKT, Kind, URIS } from "fp-ts/HKT"
import { pipe } from "fp-ts/lib/function"

/**
 * @summary
 * A Testable is when a value a can be converted into a property.
 * When calling `quickcheck.assert`, a value will be good for use.
 */

/**
 *
 */
// todo - add the value in here somewhere.
export type Result = O.Option<E.Either<unknown, AssertionError>>

// eventually these functions will use the value from the arbitrary in the messages.
export interface Testable<F, G, A> {
  readonly test: <I>(
    value: I,
  ) => (property: (value: I) => HKT<F, A>) => HKT<G, Result>
}

export interface Testable11<F extends URIS, G extends URIS, A> {
  readonly test: <I>(
    value: I,
  ) => (property: (value: I) => Kind<F, A>) => Kind<G, Result>
}

export const boolean: Testable11<I.URI, I.URI, boolean> = {
  test: (value) => (property) =>
    property(value)
      ? O.none
      : O.some(
          E.right(
            new AssertionError({
              operator: "boolean",
              message: "Received false but expected true",
              actual: false,
              expected: true,
            }),
          ),
        ),
}

/**
 * @summary
 * A Testable instance that can catch when an assertion is made via jest.expect or assert.*
 */
export const assertion: Testable11<I.URI, IO.URI, void> = {
  test: (value) => (property) =>
    pipe(
      value,
      IOE.tryCatchK(property, (e) => e),
      IOE.match(
        (error) => O.some(E.left(error)),
        () => O.none,
      ),
    ),
}
