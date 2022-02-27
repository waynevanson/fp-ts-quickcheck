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

// todo - add the value in here somewhere.
export type Result = O.Option<unknown>

// eventually these functions will use the value from the arbitrary in the messages.
export interface Testable<F, A> {
  readonly test: <I>(value: I) => (property: (value: I) => A) => HKT<F, Result>
}

export interface Testable1<F extends URIS, A> {
  readonly test: <I>(value: I) => (property: (value: I) => A) => Kind<F, Result>
}

export const boolean: Testable1<I.URI, boolean> = {
  test: (value) => (property) =>
    property(value)
      ? O.none
      : O.some(
          new AssertionError({
            operator: "boolean",
            message: "Received false but expected true",
            actual: false,
            expected: true,
          }),
        ),
}

/**
 * @summary
 * A Testable instance that can catch when an assertion is made via jest.expect or assert.*
 */
export const assertion: Testable1<IO.URI, void> = {
  test: (value) => (property) =>
    pipe(
      value,
      IOE.tryCatchK(property, (e) => e),
      IOE.match(
        (error) => O.some(error),
        () => O.none,
      ),
    ),
}
