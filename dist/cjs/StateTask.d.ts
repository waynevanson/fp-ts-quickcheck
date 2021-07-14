import { stateT as ST, task as T } from "fp-ts";
import { Apply2 } from "fp-ts/lib/Apply";
import { Chain2 } from "fp-ts/lib/Chain";
import { Endomorphism } from "fp-ts/lib/function";
import { Functor2 } from "fp-ts/lib/Functor";
import { Monad2 } from "fp-ts/lib/Monad";
import { Pointed2 } from "fp-ts/lib/Pointed";
export declare const URI = "StateTask";
export declare type URI = typeof URI;
export interface StateTask<S, A> extends ST.StateT1<T.URI, S, A> {
}
declare module "fp-ts/HKT" {
    interface URItoKind2<E, A> {
        readonly [URI]: StateTask<E, A>;
    }
}
export declare const of: <A, S>(a: A) => ST.StateT1<"Task", S, A>;
export declare const map: <A, B>(f: (a: A) => B) => <S>(fa: ST.StateT1<"Task", S, A>) => ST.StateT1<"Task", S, B>;
export declare const ap: <S, A>(fa: ST.StateT1<"Task", S, A>) => <B>(fab: ST.StateT1<"Task", S, (a: A) => B>) => ST.StateT1<"Task", S, B>;
export declare const chain: <S, A, B>(f: (a: A) => StateTask<S, B>) => (fa: StateTask<S, A>) => StateTask<S, B>;
export declare const Pointed: Pointed2<URI>;
export declare const Functor: Functor2<URI>;
export declare const Apply: Apply2<URI>;
export declare const Chain: Chain2<URI>;
export declare const Monad: Monad2<URI>;
export declare function executeTask<S>(s: S): <A>(fa: StateTask<S, A>) => T.Task<S>;
export declare function get<S>(): StateTask<S, S>;
export declare function gets<S, A>(f: (s: S) => A): StateTask<S, A>;
export declare const chainFirst: <S, A, B>(f: (a: A) => StateTask<S, B>) => (fa: StateTask<S, A>) => StateTask<S, A>;
export declare const chainFirstW: <R, A, B>(f: (a: A) => StateTask<R, B>) => <S>(fa: StateTask<S, A>) => StateTask<S & R, A>;
export declare const bind: <N extends string, A, E, B>(name: Exclude<N, keyof A>, f: (a: A) => StateTask<E, B>) => (ma: StateTask<E, A>) => StateTask<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B; }>;
export declare const Do: ST.StateT1<"Task", unknown, {}>;
export declare function modify<S>(f: Endomorphism<S>): StateTask<S, void>;
export declare const fromTask: <A, S>(ma: T.Task<A>) => ST.StateT1<"Task", S, A>;
export declare const fromState: <S, A>(sa: import("fp-ts/lib/State").State<S, A>) => ST.StateT1<"Task", S, A>;
export declare const chainTask: <A, B>(f: (a: A) => T.Task<B>) => <S>(fa: StateTask<S, A>) => StateTask<S, B>;
