import * as gen from "@no-day/fp-ts-generators"
import { option as O } from "fp-ts"
import { URIS } from "fp-ts/HKT"
import { pipe } from "fp-ts/lib/function"
import { Monad, Monad1 } from "fp-ts/lib/Monad"
import * as ls from "../loopstate"
import { state as S, stateT as ST } from "../modules/fp-ts"
import { test, TestOptions, TestOptions11 } from "./test"

export interface LoopOptions<F, G, I, A> extends TestOptions<F, G, I, A> {
  size: number
}

export interface LoopOptions11<F extends URIS, G extends URIS, I, A>
  extends TestOptions11<F, G, I, A> {
  size: number
}

export function loop<F extends URIS, G extends URIS>(
  Monad: Monad1<G>,
): <I, A>(
  options: LoopOptions11<F, G, I, A>,
) => ST.StateT1<G, ls.LoopState, void>

export function loop<F, G>(
  Monad: Monad<G>,
): <I, A>(options: LoopOptions<F, G, I, A>) => ST.StateT<G, ls.LoopState, void>

export function loop<F, G>(M: Monad<G>) {
  return <I, A>({
    size,
    ...testOptions
  }: LoopOptions<F, G, I, A>): ST.StateT<G, ls.LoopState, void> =>
    pipe(
      S.gets(
        ({ seed: newSeed }: ls.LoopState): gen.GenState => ({ newSeed, size }),
      ),
      S.map((genState) => S.evaluate(genState)(test(testOptions))),
      S.chainFirst(({ newSeed }) => S.modify(ls.seedPut(newSeed))),
      S.apFirst(S.modify(ls.incrementIndex)),
      ST.fromState(M),
      ST.chain(M)(({ resultM }) => ST.fromF(M)(resultM)),
      ST.chain(M)(
        O.match(
          () => ST.modify(M)(ls.incrementSuccess),
          (data) =>
            ST.fromState(M)(
              pipe(
                S.gets(ls.makeFailureFromLoopState(data)),
                S.chain(ls.putFailure),
              ),
            ),
        ),
      ),
    )
}
