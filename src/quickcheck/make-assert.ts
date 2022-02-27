import { option as O } from "fp-ts"
import { HKT, Kind, URIS } from "fp-ts/HKT"
import { ChainRec, ChainRec1 } from "fp-ts/lib/ChainRec"
import { FromIO, FromIO1 } from "fp-ts/lib/FromIO"
import { constVoid, pipe } from "fp-ts/lib/function"
import { Pointed, Pointed1 } from "fp-ts/lib/Pointed"
import { QuickCheckOptions } from "."
import { Arbitrary } from "../arbitrary"
import { Testable, Testable1 } from "../testable"
import { tests } from "./tests"

export interface MonadRecIO<F> extends ChainRec<F>, Pointed<F>, FromIO<F> {}
export interface MonadRecIO1<F extends URIS>
  extends ChainRec1<F>,
    Pointed1<F>,
    FromIO1<F> {}

export interface AssertDeps<F, A> {
  MonadRecIO: MonadRecIO<F>
  Testable: Testable<F, A>
  defaults: QuickCheckOptions
}

export interface MakeAssertDeps1<F extends URIS, A> {
  MonadRecIO: MonadRecIO1<F>
  Testable: Testable1<F, A>
  defaults: QuickCheckOptions
}

export function makeAssert<F extends URIS, A>(
  depenencies: MakeAssertDeps1<F, A>,
): <I>(
  property: (value: I) => A,
  options?: Partial<QuickCheckOptions>,
) => (arbitrary: Arbitrary<I>) => Kind<F, void>

export function makeAssert<F, A>(
  dependencies: AssertDeps<F, A>,
): <I>(
  property: (value: I) => A,
  options?: Partial<QuickCheckOptions>,
) => (arbitrary: Arbitrary<I>) => HKT<F, void>

export function makeAssert<F, A>({
  MonadRecIO: M,
  Testable,
  defaults,
}: AssertDeps<F, A>) {
  return <I>(
      property: (value: I) => A,
      options: Partial<QuickCheckOptions> = {},
    ) =>
    (Arbitrary: Arbitrary<I>): HKT<F, void> =>
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
