// binds the property and the input value
import {
  identity as I,
  io,
  ioEither,
  option as O,
  option,
  reader,
  task,
  taskEither,
} from "fp-ts"
import { HKT, Kind, Kind2, URIS, URIS2 } from "fp-ts/HKT"
import { constant, pipe } from "fp-ts/lib/function"

/**
 * @summary The result of a single test (from a property)
 */
export type Result = option.Option<{
  readonly operator: string
  readonly value: unknown
  readonly message: string
  readonly actual: option.Option<unknown>
  readonly expected: option.Option<unknown>
  readonly exception: option.Option<unknown>
}>

export interface TestableOptions<I, A> {
  readonly property: reader.Reader<I, A>
  readonly value: I
}

// todo - add the  in here somewhere.

// eventually these functions will use the value from the arbitrary in the messages.
export interface Testable<F, A> {
  <I>(options: TestableOptions<I, A>): HKT<F, Result>
}
export interface Testable1<F extends URIS, A> {
  <I>(options: TestableOptions<I, A>): Kind<F, Result>
}
export interface Testable2<F extends URIS2, E, A> {
  <I>(options: TestableOptions<I, A>): Kind2<F, E, Result>
}

export const boolean: Testable1<I.URI, boolean> = ({ property, value }) =>
  pipe(
    value,
    option.fromPredicate(property),
    O.map(() => ({
      operator: "boolean",
      message: "Received false but expected true",
      actual: option.some(false),
      expected: option.some(true),
      exception: option.none,
      value: option.some(true),
    })),
  )

export const sync: Testable1<io.URI, void> = ({ property, value }) =>
  pipe(
    value,
    ioEither.tryCatchK(property, (e) => e),
    ioEither.swap,
    ioEither.map(
      (exception): Result =>
        O.some({
          operator: "sync",
          exception: option.some(exception),
          expected: option.none,
          message: "The property threw, which means the test has failed",
          actual: option.none,
          value,
        }),
    ),
    ioEither.getOrElse(constant(io.of(option.zero()))),
  )

export const async: Testable1<task.URI, Promise<void>> = ({
  property,
  value,
}) =>
  pipe(
    value,
    taskEither.tryCatchK(property, (e) => e),
    taskEither.swap,
    taskEither.map(
      (exception): Result =>
        O.some({
          operator: "sync",
          exception: option.some(exception),
          expected: option.none,
          message: "The property threw, which means the test has failed",
          actual: option.none,
          value,
        }),
    ),
    taskEither.getOrElse(constant(task.of(option.zero()))),
  )
