import * as lcg from "@no-day/fp-ts-lcg"
import { either as E } from "fp-ts"
import { HKT, Kind, URIS } from "fp-ts/HKT"
import { ChainRec, ChainRec1 } from "fp-ts/lib/ChainRec"
import { constVoid, identity, pipe } from "fp-ts/lib/function"
import { Pointed, Pointed1 } from "fp-ts/lib/Pointed"
import { QuickCheckOptions } from "."
import * as ls from "../loopstate"
import { stateT as ST } from "../modules/fp-ts"
import { loop, LoopOptions, LoopOptions11 } from "./loop"

export interface TestsOptions<F, G, I, A>
  extends LoopOptions<F, G, I, A>,
    QuickCheckOptions {}

export interface TestsOptions11<F extends URIS, G extends URIS, I, A>
  extends LoopOptions11<F, G, I, A>,
    QuickCheckOptions {}

export function tests<F extends URIS, G extends URIS>(
  MonadRec: ChainRec1<G> & Pointed1<G>,
): <I, A>(options: TestsOptions11<F, G, I, A>) => Kind<G, ls.LoopState>

export function tests<F, G>(
  MonadRec: ChainRec<G> & Pointed<G>,
): <I, A>(options: TestsOptions<F, G, I, A>) => HKT<G, ls.LoopState>

export function tests<F, G>(M: ChainRec<G> & Pointed<G>) {
  return <I, A>({
    count,
    initialSeed,
    ...loopOptions
  }: TestsOptions<F, G, I, A>): HKT<G, ls.LoopState> =>
    pipe(
      ST.chainRec(M)(constVoid(), () =>
        pipe(
          ST.gets(M)((loopState: ls.LoopState) => loopState.index),
          ST.map(M)(E.fromPredicate((index) => index > count, identity)),
          ST.chain(M)(
            E.match(
              () => pipe(loop<F, G>(M)(loopOptions), ST.map(M)(E.left)),
              () => ST.of(M)(E.right(constVoid())),
            ),
          ),
        ),
      ),
      ST.execute(M)({
        ...ls.Monoid.empty,
        seed: lcg.mkSeed(initialSeed),
      }),
    )
}
