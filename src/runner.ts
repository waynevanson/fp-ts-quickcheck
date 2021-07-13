/**
 * @summary
 * Runs a list of generators, with the option to configure size and the seed number if that's what your heart desires.
 *
 * @description
 *
 */

import { lcgNext, mkSeed, Seed } from "@no-day/fp-ts-lcg";
import { constVoid, flow, increment, pipe } from "fp-ts/lib/function";
import { Arbitrary } from "./arbitrary";
import {
  state as S,
  readonlyArray as A,
  task as T,
  taskEither as TE,
  either as E,
  identity,
} from "fp-ts";
import * as lens from "monocle-ts/Lens";
import { Loop } from "@babel/types";
import { tailRec } from "fp-ts/lib/ChainRec";
import { Monad, Monad2 } from "fp-ts/lib/Monad";
import { Kind2, URIS, URIS2 } from "fp-ts/lib/HKT";
import * as ST from "./StateTask";

export interface LoopFailure {
  seed: Seed;
  index: number;
  message: string;
}

// run a test,
// report test number and index that is cooked
//
export interface LoopState {
  seed: Seed;
  index: number;
  successes: number;
  failures: ReadonlyArray<LoopFailure>;
}

// 100 times,
// properties can throw, i think they should all be tasks
// StateTaskfffffffffffffff

export const incrementIndex = pipe(
  lens.id<LoopState>(),
  lens.prop("index"),
  lens.modify(increment),
  S.modify
);

export const nextSeed = pipe(
  lens.id<LoopState>(),
  lens.prop("seed"),
  lens.modify(lcgNext),
  S.modify
);

/**
 * @summary
 * Tail recursion but using a Monad.
 *
 * **note:** not stack safe
 */
export const tailRecM =
  <M extends URIS2>(M: Monad2<M>) =>
  <E, A, B>(f: (a: A) => Kind2<M, E, E.Either<A, B>>) =>
  (fa: Kind2<M, E, A>): Kind2<M, E, B> =>
    pipe(M.chain(fa, f), (fea) =>
      M.chain(
        fea,
        E.fold(
          (a) => tailRecM(M)(f)(M.of(a)),
          (b) => M.of(b)
        )
      )
    );

// how to know when a test has passed?
// simple, it throws!

// test :: (A -> Task<void>) -> Arbitrary<A> -> Task<void>

// require sStateTask
export function quickcheck<A extends readonly unknown[]>(
  property: (...args: A) => T.Task<void>
): (Arbitrary: Arbitrary<A>) => T.Task<LoopState> {
  return ({ arbitrary }) =>
    pipe(
      // taskState
      ST.of<void, LoopState>(constVoid()),
      tailRecM(ST.Monad)(() => pipe(S.get<LoopState>(), S.map())),
      ST.executeTask({
        failures: A.zero<LoopFailure>(),
        index: 0,
        successes: 0,
        seed: mkSeed(123874),
      })
    );
}
