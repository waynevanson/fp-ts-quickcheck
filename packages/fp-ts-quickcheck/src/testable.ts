import { AssertionError } from "assert"
import {
  either as E,
  identity as I,
  io as IO,
  ioEither as IOE,
  option as O,
  reader,
  task as T,
  taskEither as TE,
} from "fp-ts"
import { HKT, Kind, Kind2, URIS, URIS2 } from "fp-ts/HKT"
import { constant, flow, identity, pipe } from "fp-ts/lib/function"
import * as gen from "./gen"

export interface TestableOptions<I, A> {
  readonly property: reader.Reader<I, A>
  readonly value: I
  readonly seedState: gen.GenState
}

// todo - add the value in here somewhere.
export type Result = O.Option<unknown>

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
  property(value)
    ? O.none
    : O.some(
        new AssertionError({
          operator: "boolean",
          message: "Received false but expected true",
          actual: false,
          expected: true,
        }),
      )

export const assertionSync: Testable1<IO.URI, void> = ({ property, value }) =>
  pipe(
    value,
    IOE.tryCatchK(property, (e) => e),
    IOE.match(O.some, O.zero),
  )

export const assertionAsync: Testable1<T.URI, Promise<void>> = ({
  property,
  value,
}) =>
  pipe(
    value,
    TE.tryCatchK(property, (e) => e),
    TE.match(O.some, O.zero),
  )

export type Thunk<A> = () => A
export type Promisable<A> = A | Promise<A>
export type Thunkable<A> = A | Thunk<A>
export type PropertyValue = boolean | void
export type Assertion = Thunkable<Promisable<PropertyValue>>

const fromMain =
  <I>(property: (i: I) => Assertion) =>
  (i: I) =>
    pipe(
      IOE.tryCatchK(property, identity)(i),
      IOE.chainIOK(
        (assertion): Thunk<Promisable<PropertyValue>> =>
          typeof assertion === "function" ? assertion : () => assertion,
      ),
      IOE.chainW(
        flow(
          E.fromPredicate(
            (promisable): promisable is Promise<PropertyValue> =>
              promisable instanceof Promise,
            (e) => e as PropertyValue,
          ),
          E.map((promisable) => IOE.tryCatch(() => promisable, identity)),
          E.getOrElseW((propertyValue) =>
            IOE.rightIO(() => Promise.resolve(propertyValue)),
          ),
        ),
      ),
      TE.fromIOEither,
      TE.chainTaskK(constant),
    )

export const assertion: Testable1<T.URI, Assertion> = ({ property, value }) =>
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
  )
