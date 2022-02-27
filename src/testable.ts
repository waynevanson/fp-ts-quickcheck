import { AssertionError } from "assert"
import {
  either as E,
  identity as I,
  io as IO,
  ioEither as IOE,
  option as O,
  task as T,
  taskEither as TE,
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

export const assertionSync: Testable1<IO.URI, void> = {
  test: (value) => (property) =>
    pipe(
      value,
      IOE.tryCatchK(property, (e) => e),
      IOE.match(O.some, O.zero),
    ),
}

export const assertionAsync: Testable1<T.URI, Promise<void>> = {
  test: (value) => (property) =>
    pipe(
      value,
      TE.tryCatchK(property, (e) => e),
      TE.match(O.some, O.zero),
    ),
}
export type Thunk<A> = () => A
export type Promisable<A> = A | Promise<A>
export type Thunkable<A> = A | Thunk<A>

type Main = Thunkable<Promisable<boolean | void>>

const fromMain =
  <I>(property: (i: I) => Main) =>
  (i: I): TE.TaskEither<unknown, boolean | void> =>
  () => {
    const main = property(i)
    try {
      let promisable: Promisable<boolean | void>

      typeof main === "function" ? (promisable = main()) : (promisable = main)

      return promisable instanceof Promise
        ? promisable.then(E.right).catch(E.left)
        : Promise.resolve(E.right(promisable))
    } catch (e) {
      return Promise.resolve(E.left(e))
    }
  }

export const assertion: Testable1<T.URI, Main> = {
  test: (value) => (property) =>
    pipe(
      fromMain(property)(value),
      TE.chainEitherKW(
        E.fromPredicate(
          (a) => typeof a !== "boolean" || a,
          () =>
            new AssertionError({
              operator: "boolean",
              message: "Received false but expected true",
              actual: false,
              expected: true,
            }),
        ),
      ),
      TE.match(O.some, O.zero),
    ),
}
