import * as lcg from "@no-day/fp-ts-lcg"
import { either as E } from "fp-ts"
import { HKT, Kind, URIS } from "fp-ts/HKT"
import { ChainRec, ChainRec1 } from "fp-ts/lib/ChainRec"
import { constVoid, identity, pipe } from "fp-ts/lib/function"
import { Pointed, Pointed1 } from "fp-ts/lib/Pointed"
import { QuickCheckOptions } from "."
import * as ls from "../loopstate"
import { stateT as ST } from "../modules/fp-ts"
import { loop, LoopOptions, LoopOptions1 } from "./loop"

export interface TestsOptions<F, I, A>
  extends LoopOptions<F, I, A>,
    QuickCheckOptions {}

export interface TestsOptions11<F extends URIS, I, A>
  extends LoopOptions1<F, I, A>,
    QuickCheckOptions {}

export function tests<F extends URIS>(
  MonadRec: ChainRec1<F> & Pointed1<F>,
): <I, A>(options: TestsOptions11<F, I, A>) => Kind<F, ls.LoopState>

export function tests<F>(
  MonadRec: ChainRec<F> & Pointed<F>,
): <I, A>(options: TestsOptions<F, I, A>) => HKT<F, ls.LoopState>

export function tests<F>(M: ChainRec<F> & Pointed<F>) {
  return <I, A>({
    count,
    initialSeed,
    ...loopOptions
  }: TestsOptions<F, I, A>): HKT<F, ls.LoopState> =>
    pipe(
      ST.chainRec(M)(constVoid(), () =>
        pipe(
          ST.gets(M)((loopState: ls.LoopState) => loopState.index),
          ST.map(M)(E.fromPredicate((index) => index > count, identity)),
          ST.chain(M)(
            E.match(
              () => pipe(loop(M)(loopOptions), ST.map(M)(E.left)),
              () => ST.of(M)(E.right(constVoid())),
            ),
          ),
        ),
      ),
      ST.execute(M)({ ...ls.Monoid.empty, seed: lcg.mkSeed(initialSeed) }),
    )
}
