import { stateT as ST, task as T, chain as CH } from "fp-ts";
import { constVoid, pipe } from "fp-ts/lib/function";
export const URI = "StateTask";
export const of = ST.of(T.Pointed);
export const map = ST.map(T.Functor);
export const ap = ST.ap(T.Chain);
export const chain = ST.chain(T.Chain);
export const Pointed = { URI, of };
export const Functor = { URI, map: (fa, f) => map(f)(fa) };
export const Apply = Object.assign(Object.assign({}, Functor), { ap: (fab, fa) => ap(fa)(fab) });
export const Chain = Object.assign(Object.assign({}, Apply), { chain: (fa, f) => chain(f)(fa) });
export const Monad = Object.assign(Object.assign({}, Pointed), Chain);
export function executeTask(s) {
    return (fa) => pipe(fa(s), T.map((as) => as[1]));
}
export function get() {
    return (s) => T.of([s, s]);
}
export function gets(f) {
    return (s) => T.of([f(s), s]);
}
export const chainFirst = CH.chainFirst(Chain);
export const chainFirstW = CH.chainFirst(Chain);
export const bind = CH.bind(Chain);
export const Do = of({});
export function modify(f) {
    return (s) => T.of([constVoid(), f(s)]);
}
export const fromTask = ST.fromF(T.Functor);
export const fromState = ST.fromState(T.Pointed);
export const chainTask = (f) => (fa) => pipe(fa, chain((a) => fromTask(f(a))));
