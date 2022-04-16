import { option as O } from "fp-ts"
import { HKT, Kind, URIS } from "fp-ts/HKT"
import { constVoid, flow, pipe } from "fp-ts/lib/function"
import { Arbitrary } from "../arbitrary"
import { task as T, io as IO } from "../modules/fp-ts"
import { MonadRecIO, MonadRecIO1 } from "../modules/monad-rec-io"
import { assertion, assertionSync, Testable, Testable1 } from "../testable"
import { tests } from "./tests"

export interface QuickCheckOptions {
  readonly initialSeed: number
  readonly count: number
  readonly size: number
}

export type InitialQuickCheckOptions = Partial<QuickCheckOptions>

export const quickcheckOptionsDefault: QuickCheckOptions = {
  count: 100,
  initialSeed: 100,
  size: 10,
}

export interface AssertOptions<F, A> {
  readonly MonadRecIO: MonadRecIO<F>
  readonly Testable: Testable<F, A>
  readonly defaults?: QuickCheckOptions
}

export interface AssertOptions1<F extends URIS, A> {
  readonly MonadRecIO: MonadRecIO1<F>
  readonly Testable: Testable1<F, A>
  readonly defaults?: QuickCheckOptions
}

export interface Assert<F, A> {
  <I>(
    arbitrary: Arbitrary<I>,
    property: (value: I) => A,
    options?: InitialQuickCheckOptions,
  ): HKT<F, void>
}

export interface Assert1<F extends URIS, A> {
  <I>(
    arbitrary: Arbitrary<I>,
    property: (value: I) => A,
    options?: InitialQuickCheckOptions,
  ): Kind<F, void>
}

export function mk<F extends URIS, A>(
  options: AssertOptions1<F, A>,
): Assert1<F, A>

export function mk<F, A>(dependencies: AssertOptions<F, A>): Assert<F, A>

export function mk<F, A>({
  MonadRecIO: M,
  Testable,
  defaults = quickcheckOptionsDefault,
}: AssertOptions<F, A>): Assert<F, A> {
  return <I>(
    Arbitrary: Arbitrary<I>,
    property: (value: I) => A,
    options?: InitialQuickCheckOptions,
  ): HKT<F, void> =>
    pipe(
      tests(M)({ Arbitrary, Testable, property, ...defaults, ...options }),
      (fa) =>
        M.chain(fa, (a) =>
          pipe(
            a.failure,
            O.match(
              () => M.of(constVoid()),
              (failure) =>
                M.fromIO(() => {
                  // eslint-disable-next-line functional/no-throw-statement
                  throw failure
                }),
            ),
          ),
        ),
    )
}

export const io = mk({
  Testable: assertionSync,
  MonadRecIO: IO.MonadRecIO,
})

export const task = mk({
  MonadRecIO: T.MonadRecIO,
  Testable: assertion,
})

// eslint-disable-next-line functional/no-return-void
export const sync = flow(io, (io) => io())
export const async = flow(task, (a) => a())
