import { stateT as ST, task as T, chain as CH } from "fp-ts";
import { Apply2 } from "fp-ts/lib/Apply";
import { Chain2 } from "fp-ts/lib/Chain";
import { constVoid, Endomorphism, pipe } from "fp-ts/lib/function";
import { Functor2 } from "fp-ts/lib/Functor";
import { Monad2 } from "fp-ts/lib/Monad";
import { Pointed2 } from "fp-ts/lib/Pointed";

export const URI = "StateTask";
export type URI = typeof URI;

export interface StateTask<S, A> extends ST.StateT1<T.URI, S, A> {}

declare module "fp-ts/HKT" {
  export interface URItoKind2<E, A> {
    readonly [URI]: StateTask<E, A>;
  }
}

export const of = ST.of(T.Pointed);
export const map = ST.map(T.Functor);
export const ap = ST.ap(T.Chain);
export const chain: <S, A, B>(
  f: (a: A) => StateTask<S, B>
) => (fa: StateTask<S, A>) => StateTask<S, B> = ST.chain(T.Chain);

export const Pointed: Pointed2<URI> = { URI, of };
export const Functor: Functor2<URI> = { URI, map: (fa, f) => map(f)(fa) };
export const Apply: Apply2<URI> = { ...Functor, ap: (fab, fa) => ap(fa)(fab) };
export const Chain: Chain2<URI> = { ...Apply, chain: (fa, f) => chain(f)(fa) };
export const Monad: Monad2<URI> = { ...Pointed, ...Chain };

export function executeTask<S>(s: S): <A>(fa: StateTask<S, A>) => T.Task<S> {
  return (fa) =>
    pipe(
      fa(s),
      T.map((as) => as[1])
    );
}
export function get<S>(): StateTask<S, S> {
  return (s) => T.of([s, s]);
}
export function gets<S, A>(f: (s: S) => A): StateTask<S, A> {
  return (s) => T.of([f(s), s]);
}

export const chainFirst: <S, A, B>(
  f: (a: A) => StateTask<S, B>
) => (fa: StateTask<S, A>) => StateTask<S, A> = CH.chainFirst(Chain);

export const chainFirstW: <R, A, B>(
  f: (a: A) => StateTask<R, B>
) => <S>(fa: StateTask<S, A>) => StateTask<S & R, A> = CH.chainFirst(
  Chain
) as any;

export const bind = CH.bind(Chain);
export const Do = of({});

export function modify<S>(f: Endomorphism<S>): StateTask<S, void> {
  return (s) => T.of([constVoid(), f(s)]);
}

export const fromTask = ST.fromF(T.Functor);
export const fromState = ST.fromState(T.Pointed);
export const chainTask =
  <A, B>(f: (a: A) => T.Task<B>) =>
  <S>(fa: StateTask<S, A>): StateTask<S, B> =>
    pipe(
      fa,
      chain((a) => fromTask(f(a)))
    );
