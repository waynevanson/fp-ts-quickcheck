import * as gen from "@no-day/fp-ts-generators"
import { option as O } from "fp-ts"
import { URIS } from "fp-ts/HKT"
import { pipe } from "fp-ts/lib/function"
import { Monad, Monad1 } from "fp-ts/lib/Monad"
import * as ls from "../loopstate"
import { state as S, stateT as ST } from "../modules/fp-ts"
import { test, TestOptions, TestOptions1 } from "./test"

export interface LoopOptions<F, I, A> extends TestOptions<F, I, A> {
  size: number
}

export interface LoopOptions1<F extends URIS, I, A>
  extends TestOptions1<F, I, A> {
  size: number
}

export function loop<F extends URIS>(
  Monad: Monad1<F>,
): <I, A>(options: LoopOptions1<F, I, A>) => ST.StateT1<F, ls.LoopState, void>

export function loop<F>(
  Monad: Monad<F>,
): <I, A>(options: LoopOptions<F, I, A>) => ST.StateT<F, ls.LoopState, void>

export function loop<F>(M: Monad<F>) {
  return <I, A>({
    size,
    ...testOptions
  }: LoopOptions<F, I, A>): ST.StateT<F, ls.LoopState, void> =>
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
