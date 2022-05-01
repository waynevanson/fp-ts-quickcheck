export * from "fp-ts/StateT"

import { either as E, stateT as ST, chain as CH } from "fp-ts"
import { URIS } from "fp-ts/HKT"
import { ChainRec, ChainRec1 } from "fp-ts/lib/ChainRec"
import { Endomorphism } from "fp-ts/lib/Endomorphism"
import { constVoid, identity, pipe } from "fp-ts/lib/function"
import { Pointed, Pointed1 } from "fp-ts/lib/Pointed"

export function gets<F extends URIS>(
  P: Pointed1<F>,
): <S, A>(f: (s: S) => A) => ST.StateT1<F, S, A>
export function gets<F>(
  P: Pointed<F>,
): <S, A>(f: (s: S) => A) => ST.StateT<F, S, A>
export function gets<F>(
  P: Pointed<F>,
): <S, A>(f: (s: S) => A) => ST.StateT<F, S, A> {
  return (f) => (s) => P.of([f(s), s])
}

export const get =
  <F extends URIS>(P: Pointed1<F>) =>
  <S>(): ST.StateT1<F, S, S> =>
    gets(P)(identity)

export function chainFirst<F extends URIS>(
  F: CH.Chain1<F>,
): <A, S, B>(
  f: (a: A) => ST.StateT1<F, S, B>,
) => (fa: ST.StateT1<F, S, A>) => ST.StateT1<F, S, A>
export function chainFirst<F>(
  F: CH.Chain<F>,
): <A, S, B>(
  f: (a: A) => ST.StateT<F, S, B>,
) => (fa: ST.StateT<F, S, A>) => ST.StateT<F, S, A>
export function chainFirst<F>(
  F: CH.Chain<F>,
): <A, S, B>(
  f: (a: A) => ST.StateT<F, S, B>,
) => (fa: ST.StateT<F, S, A>) => ST.StateT<F, S, A> {
  return (f) => (fa) =>
    pipe(
      fa,
      ST.chain(F)((a) =>
        pipe(
          f(a),
          ST.map(F)(() => a),
        ),
      ),
    )
}

export function chainRec<F extends URIS>(
  M: ChainRec1<F>,
): <S, A, B>(
  a: A,
  f: (a: A) => ST.StateT1<F, S, E.Either<A, B>>,
) => ST.StateT1<F, S, B>
export function chainRec<F>(
  M: ChainRec<F>,
): <S, A, B>(
  a: A,
  f: (a: A) => ST.StateT<F, S, E.Either<A, B>>,
) => ST.StateT<F, S, B>
export function chainRec<F>(
  M: ChainRec<F>,
): <S, A, B>(
  a: A,
  f: (a: A) => ST.StateT<F, S, E.Either<A, B>>,
) => ST.StateT<F, S, B> {
  return (a, f) => (s) =>
    M.chainRec([a, s] as const, ([a, s]) =>
      M.map(f(a)(s), ([ea, s]) =>
        pipe(
          ea,
          E.bimap(
            (e) => [e, s] as const,
            (a) => [a, s],
          ),
        ),
      ),
    )
}

export function modify<F extends URIS>(
  F: Pointed1<F>,
): <S>(f: Endomorphism<S>) => ST.StateT1<F, S, void>
export function modify<F>(
  F: Pointed<F>,
): <S>(f: Endomorphism<S>) => ST.StateT<F, S, void>
export function modify<F>(
  F: Pointed<F>,
): <S>(f: Endomorphism<S>) => ST.StateT<F, S, void> {
  return (f) => (s) => F.of([constVoid(), f(s)])
}

// export function apS<F extends URIS>(F: Apply1<F>) {
//   return <N extends string, A, E, B>(
//       name: Exclude<N, keyof A>,
//       fb: ST.StateT1<F, E, B>,
//     ) =>
//     (
//       fa: ST.StateT1<F, E, A>,
//     ): ST.StateT1<
//       F,
//       E,
//       { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
//     > => {
//       return
//     }
// }
