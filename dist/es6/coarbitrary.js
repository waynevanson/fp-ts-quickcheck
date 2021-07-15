/**
 * Basically the module creates a deterministic seed given by type `<A>`,
 * which can then be used to create
 */
import { either as E, option as O } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import * as gen from "./gen";
/**
 * @category Model
 */
export const URI = "Coarbitrary";
// PIPEABLES
/**
 * @category Contravariant
 */
export const contramap = (f) => (fa) => ({
    coarbitrary: (b) => fa.coarbitrary(f(b)),
});
export const ordering = {
    coarbitrary: (ordering) => gen.chainFirst(() => gen.variant(ordering === 1 ? 0 : ordering === 0 ? 1 : 2)),
};
export const boolean = {
    coarbitrary: (bool) => gen.chainFirst(() => gen.variant(bool ? 1 : 0)),
};
export function option(fa) {
    return {
        coarbitrary: O.fold(() => gen.chainFirst(() => gen.variant(0)), (a) => flow(fa.coarbitrary(a), gen.chainFirst(() => gen.variant(1)))),
    };
}
export function either(fe, fa) {
    return {
        coarbitrary: E.fold((e) => flow(fe.coarbitrary(e), gen.chainFirst(() => gen.variant(0))), (a) => flow(fa.coarbitrary(a), gen.chainFirst(() => gen.variant(1)))),
    };
}
export function func(ge, fa) {
    return {
        coarbitrary: (fea) => (fr) => pipe(ge.arbitrary, gen.map(fea), gen.chain((a) => pipe(fr, fa.coarbitrary(a)))),
    };
}
