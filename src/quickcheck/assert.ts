import { option as O } from "fp-ts"
import { HKT, Kind, URIS } from "fp-ts/HKT"
import { constVoid, pipe } from "fp-ts/lib/function"
import { Arbitrary } from "../arbitrary"
import { MonadRecIO, MonadRecIO1 } from "../modules/monad-rec-io"
import { Testable, Testable1 } from "../testable"
import { InitialQuickCheckOptions, QuickCheckOptions } from "./index"
import { tests } from "./tests"

export interface AssertDeps<F, A> {
  readonly MonadRecIO: MonadRecIO<F>
  readonly Testable: Testable<F, A>
  readonly defaults: QuickCheckOptions
}

export interface MakeAssertDeps1<F extends URIS, A> {
  readonly MonadRecIO: MonadRecIO1<F>
  readonly Testable: Testable1<F, A>
  readonly defaults: QuickCheckOptions
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

export function makeAssert<F extends URIS, A>(
  depenencies: MakeAssertDeps1<F, A>,
): Assert1<F, A>

export function makeAssert<F, A>(dependencies: AssertDeps<F, A>): Assert<F, A>

export function makeAssert<F, A>({
  MonadRecIO: M,
  Testable,
  defaults,
}: AssertDeps<F, A>): Assert<F, A> {
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
                  throw failure
                }),
            ),
          ),
        ),
    )
}
