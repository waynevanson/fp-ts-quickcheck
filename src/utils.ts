import { either as E } from "fp-ts"
import { URIS2, Kind2, Kind, URIS, HKT } from "fp-ts/HKT"
import { pipe } from "fp-ts/lib/function"
import { Monad, Monad1, Monad2 } from "fp-ts/lib/Monad"
import { iterable } from "./modules"

export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R

export function tailRecM<M extends URIS2>(
  M: Monad2<M>,
): <E, A, B>(
  f: (a: A) => Kind2<M, E, E.Either<A, B>>,
) => (fa: Kind2<M, E, A>) => Kind2<M, E, B>

export function tailRecM<M extends URIS>(
  M: Monad1<M>,
): <A, B>(
  f: (a: A) => Kind<M, E.Either<A, B>>,
) => (fa: Kind<M, A>) => Kind<M, B>

export function tailRecM<M>(
  M: Monad<M>,
): <A, B>(f: (a: A) => HKT<M, E.Either<A, B>>) => (fa: HKT<M, A>) => HKT<M, B>
/**
 * @summary
 * Tail recursion via Monad.
 *
 * **note:** not stack safe
 */
export function tailRecM<M extends URIS2>(M: Monad2<M>) {
  return <E, A, B>(f: (a: A) => Kind2<M, E, E.Either<A, B>>) =>
    (fa: Kind2<M, E, A>): Kind2<M, E, B> =>
      pipe(M.chain(fa, f), (fea) =>
        M.chain(
          fea,
          E.fold(
            (a) => tailRecM(M)(f)(M.of(a)),
            (b) => M.of(b),
          ),
        ),
      )
}

export const quot = (x: number, y: number) => Math.floor(x / y)

export const rightDichotomy = (n: number): Iterable<number> =>
  pipe(
    n,
    iterable.iterate((n) => quot(n, 2)),
    iterable.skip(1),
    iterable.map((i) => n - i),
    iterable.takeWhile((m: number) => Math.abs(m) < Math.abs(n)),
  )
