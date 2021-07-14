import { either as E } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { Kind2, URIS2 } from "fp-ts/lib/HKT";
import { Monad2 } from "fp-ts/lib/Monad";

/**
 * @summary
 * Tail recursion via Monad.
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
