/**
 * To shrink these bad boys, we need some TSRATEGIES!
 *
 *
 *
 */
import * as gen from "./gen";
import { constant, flow, pipe, unsafeCoerce } from "fp-ts/lib/function";
import { state as S, readonlyArray as A } from "fp-ts";
import { sequenceS, sequenceT } from "fp-ts/lib/Apply";
export const URI = "Arbitrary";
export const of = (a) => ({ arbitrary: S.of(a) });
export const map = (f) => (fa) => ({ arbitrary: pipe(fa.arbitrary, S.map(f)) });
export const ap = (fa) => (fab) => ({
    arbitrary: pipe(fab.arbitrary, S.ap(fa.arbitrary)),
});
export const chain = (f) => (fa) => ({
    arbitrary: pipe(fa.arbitrary, S.chain(flow(f, (b) => b.arbitrary))),
});
export const Pointed = { URI, of };
export const Functor = { URI, map: (fa, f) => map(f)(fa) };
export const Apply = Object.assign(Object.assign({}, Functor), { ap: (fab, fa) => ap(fa)(fab) });
export const Applicative = Object.assign(Object.assign({}, Pointed), Apply);
/**
 * @category Primitives
 */
export const number = {
    arbitrary: gen.chooseInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
};
/**
 * @summary
 * Generate a single character string.
 *
 * `65536` seems to be the maximum charcode supported by javascript.
 *
 * @category Primitives
 */
export const character = {
    arbitrary: pipe(gen.chooseInt(0, 65536), S.map((a) => String.fromCharCode(a))),
};
/**
 * @summary
 * Generates an array with a random size, then each has the random contents.
 *
 * @category Combinators
 */
export function array(arbitrary) {
    return {
        arbitrary: pipe(gen.sized, S.chain((size) => gen.chooseInt(0, size)), S.chain((size) => pipe(A.makeBy(size, constant(arbitrary.arbitrary)), S.sequenceArray))),
    };
}
export function readonly(fa) {
    return unsafeCoerce(fa);
}
export function mutable(fa) {
    return unsafeCoerce(fa);
}
export function tuple(...arbitraries) {
    return pipe(sequenceT(Apply)(...arbitraries));
}
export function struct(struct) {
    return pipe(sequenceS(Apply)(struct));
}
/**
 * @category Primitives
 */
export const string = pipe(character, array, map((strings) => strings.join("")));
/**
 * @category Primitives
 */
export const boolean = {
    arbitrary: pipe(gen.uniform, S.map((seed) => seed < 0.5)),
};
