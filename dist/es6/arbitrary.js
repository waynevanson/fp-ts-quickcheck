/**
 * @summary
 * The `Arbitrary` typeclass represents a value that can be generated.
 */
import { readonlyArray as A, state as S } from "fp-ts";
import { sequenceS, sequenceT } from "fp-ts/lib/Apply";
import { constant, flow, pipe, unsafeCoerce } from "fp-ts/lib/function";
import * as gen from "./gen";
/**
 * @category Model
 */
export const URI = "Arbitrary";
// PIPEABLES
/**
 * @category Pointed
 */
export const of = (a) => ({ arbitrary: S.of(a) });
/**
 * @category Functor
 */
export const map = (f) => (fa) => ({ arbitrary: pipe(fa.arbitrary, S.map(f)) });
/**
 * @category Apply
 */
export const ap = (fa) => (fab) => ({
    arbitrary: pipe(fab.arbitrary, S.ap(fa.arbitrary)),
});
/**
 * @category Chain
 */
export const chain = (f) => (fa) => ({
    arbitrary: pipe(fa.arbitrary, S.chain(flow(f, (b) => b.arbitrary))),
});
// INSTANCES
/**
 * @category Typeclasses
 */
export const Pointed = { URI, of };
/**
 * @category Typeclasses
 */
export const Functor = { URI, map: (fa, f) => map(f)(fa) };
/**
 * @category Typeclasses
 */
export const Apply = Object.assign(Object.assign({}, Functor), { ap: (fab, fa) => ap(fa)(fab) });
/**
 * @category Typeclasses
 */
export const Applicative = Object.assign(Object.assign({}, Pointed), Apply);
// CONSTRUCTORS
/**
 * @summary
 * Lift a generator into the `Arbitrary` typeclass.
 *
 * @category Constructors
 */
export function fromGen(gen) {
    return { arbitrary: gen };
}
// COMBINATORS
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
/**
 * @category Combinators
 */
export const readonly = unsafeCoerce;
/**
 * @summary
 * Removes the `Readonly` constraint from the value within an `Arbitrary` instance.
 *
 * @category Combinators
 */
export const mutable = unsafeCoerce;
/**
 * @category Combinators
 */
export function tuple(...arbitraries) {
    return pipe(sequenceT(Apply)(...arbitraries));
}
/**
 * @category Combinators
 */
export function struct(struct) {
    return sequenceS(Apply)(struct);
}
//PRIMITIVES
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
 * @category Primitives
 * @todo Would you prefer stricter typing with the `Char` type?
 */
export const character = {
    arbitrary: pipe(gen.chooseInt(0, 65536), S.map((a) => String.fromCharCode(a))),
};
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
