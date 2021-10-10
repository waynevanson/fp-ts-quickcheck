import { AssertionError } from "assert"
import { either as E, io as IO, option as O, reader as R } from "fp-ts"
import { constVoid, flow, identity, pipe } from "fp-ts/function"
import { HKT, Kind, URIS } from "fp-ts/HKT"
import { ChainRec, ChainRec1 } from "fp-ts/lib/ChainRec"
import { FromIO, FromIO1 } from "fp-ts/lib/FromIO"
import { Functor } from "fp-ts/lib/Functor"
import { Pointed, Pointed1 } from "fp-ts/lib/Pointed"
import { Arbitrary } from "./arbitrary"
import * as S from "./modules/fp-ts/state"
import * as ST from "./modules/fp-ts/stateT"
import * as gen from "./modules/generators"
import { failure, state } from "./quickcheck/loop-state"

export interface Property1<F extends URIS, A> {
  (prop: A): Kind<F, boolean | void>
}
export interface Property<F, A> {
  (prop: A): HKT<F, boolean | void>
}

export function caught<F extends URIS>(
  M: ChainRec1<F> & Pointed1<F>,
): <A>(
  property: Property1<F, A>,
) => (prop: A) => Kind<F, O.Option<AssertionError | Error>>

export function caught<F>(
  M: ChainRec<F> & Pointed<F>,
): <A>(
  property: Property<F, A>,
) => (prop: A) => HKT<F, O.Option<AssertionError | Error>>

export function caught<F>(M: ChainRec<F> & Pointed<F>) {
  return <A>(property: Property<F, A>) =>
    (prop: A) =>
      pipe(
        E.tryCatch(
          () => property(prop),
          (thrown): Error =>
            thrown instanceof Error
              ? thrown
              : new Error(JSON.stringify(thrown, null, 2)),
        ),
        E.traverse(M)((hkt) =>
          M.map(
            hkt,
            E.fromPredicate(
              (boolean): boolean is true | void => boolean !== false,
              () =>
                new AssertionError({
                  actual: false,
                  expected: true,
                  operator: "assert",
                  message: `Received false from property instead of true`,
                }),
            ),
          ),
        ),
        (a) =>
          M.map(
            a,
            E.fold(O.some, () => O.none),
          ),
      )
}

export interface Testable1<F extends URIS, A> extends Arbitrary<Kind<F, A>> {
  readonly property: Property1<F, A>
}

export interface Testable<F, A> extends Arbitrary<HKT<F, A>> {
  readonly property: Property<F, A>
}

export interface Loop<A> extends S.State<state.LoopState, A> {}

export function loop<F>(M: ChainRec<F> & Pointed<F>) {
  return <A>(testable: Testable<F, A>, size: QuickCheckOptions["size"]) =>
    pipe(
      ST.gets(M)(({ seed: newSeed }: state.LoopState) => ({ newSeed, size })),
      ST.map(M)(test(M)(testable)),
      ST.map(M)(([values]) => values),
      ST.chainFirst(M)(({ newSeed }) => ST.modify(M)(state.seedPut(newSeed))),
      ST.chainFirst(M)(() => ST.modify(M)(state.incrementIndex)),
      ST.chain(M)(({ error }) => ST.fromF(M)(error)),
      ST.chain(M)((error) =>
        pipe(
          error,
          O.fold(
            () => ST.modify(M)(state.incrementSuccess),
            flow(failure.make, S.chain(failure.failurePut), ST.fromState(M)),
          ),
        ),
      ),
    )
}

export function test<F>(M: ChainRec<F> & Pointed<F>) {
  return <A>(testable: Testable<F, A>) =>
    pipe(
      testable.arbitrary,
      S.map((a) => M.chain(a, (a) => caught(M)(testable.property)(a))),
      S.bindTo("error"),
      S.apS(
        "newSeed",
        S.gets((genState) => genState.newSeed),
      ),
    )
}

export interface QuickCheckOptions {
  initialSeed: number
  count: number
  size: number
}

export function tests<F extends URIS>(
  M: ChainRec1<F> & Pointed1<F>,
): <A>(
  testable: Testable1<F, A>,
  options: QuickCheckOptions,
) => Kind<F, state.LoopState>

export function tests<F>(
  M: ChainRec<F> & Pointed<F>,
): <A>(
  testable: Testable<F, A>,
  options: QuickCheckOptions,
) => HKT<F, state.LoopState>

export function tests<F extends URIS>(M: ChainRec<F> & Pointed<F>) {
  return <A>(testable: Testable<F, A>, options: QuickCheckOptions) =>
    pipe(
      ST.chainRec(M)(constVoid(), () =>
        pipe(
          ST.gets(M)((loopState: state.LoopState) => loopState.index),
          //@todo – traversable
          ST.chain(M)((n) =>
            pipe(
              n,
              E.fromPredicate((index) => index < options.count, identity),
              E.fold(
                () => pipe(loop(M)(testable, options.size), ST.map(M)(E.left)),
                () => ST.of(M)(E.right(constVoid())),
              ),
            ),
          ),
        ),
      ),
      R.map((fa) => M.map(fa, ([_, loopState]) => loopState)),
    )({
      ...state.Monoid.empty,
      seed: gen.mkSeed(options.size),
    })
}

export function assert<F extends URIS>(
  M: Pointed1<F> & FromIO1<F> & ChainRec1<F>,
): <A>(testable: Testable1<F, A>, options: QuickCheckOptions) => Kind<F, void>

export function assert<F>(
  M: Pointed<F> & FromIO<F> & ChainRec<F>,
): <A>(testable: Testable<F, A>, options: QuickCheckOptions) => HKT<F, void>

/**
 * @throws
 *
 * @todo throw meaningful error
 */
export function assert<F>(
  M: Pointed<F> & FromIO<F> & ChainRec<F>,
): <A>(testable: Testable<F, A>, options: QuickCheckOptions) => HKT<F, void> {
  return flow(tests(M), (hktLoopState) =>
    M.chain(hktLoopState, (loopState) =>
      pipe(
        loopState.failure,
        O.fold(
          () => IO.of(constVoid()),
          (failure) => () => {
            throw failure
          },
        ),
        M.fromIO,
      ),
    ),
  )
}
