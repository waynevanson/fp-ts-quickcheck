import { console, identity as I, option as O } from "fp-ts"
import { HKT, Kind, URIS } from "fp-ts/HKT"
import { ChainRec, ChainRec1 } from "fp-ts/lib/ChainRec"
import { FromIO, FromIO1 } from "fp-ts/lib/FromIO"
import { constVoid, pipe } from "fp-ts/lib/function"
import { map } from "fp-ts/lib/Functor"
import { Pointed, Pointed1 } from "fp-ts/lib/Pointed"
import { QuickCheckOptions } from "."
import { Arbitrary } from "../arbitrary"
import { Testable, Testable11 } from "../testable"
import { tests } from "./tests"

export interface MonadRecIO<F> extends ChainRec<F>, Pointed<F>, FromIO<F> {}
export interface MonadRecIO1<F extends URIS>
  extends ChainRec1<F>,
    Pointed1<F>,
    FromIO1<F> {}

export interface AssertDeps<F, G, A> {
  MonadRecIO: MonadRecIO<G>
  Testable: Testable<F, G, A>
  defaults: QuickCheckOptions
}

export interface MakeAssertDeps11<F extends URIS, G extends URIS, A> {
  MonadRecIO: MonadRecIO1<G>
  Testable: Testable11<F, G, A>
  defaults: QuickCheckOptions
}

export function makeAssert<F extends URIS, G extends URIS, A>(
  depenencies: MakeAssertDeps11<F, G, A>,
): <I>(
  property: (value: I) => Kind<F, A>,
  options?: Partial<QuickCheckOptions>,
) => (arbitrary: Arbitrary<I>) => Kind<G, void>

export function makeAssert<F, G, A>(
  dependencies: AssertDeps<F, G, A>,
): <I>(
  property: (value: I) => HKT<F, A>,
  options?: Partial<QuickCheckOptions>,
) => (arbitrary: Arbitrary<I>) => HKT<G, void>

export function makeAssert<F, G, A>({
  MonadRecIO: M,
  Testable,
  defaults,
}: AssertDeps<F, G, A>) {
  return <I>(
      property: (value: I) => HKT<F, A>,
      options: Partial<QuickCheckOptions> = {},
    ) =>
    (Arbitrary: Arbitrary<I>): HKT<G, void> =>
      pipe(
        tests<F, G>(M)({
          Arbitrary,
          Testable,
          property,
          ...defaults,
          ...options,
        }),
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
