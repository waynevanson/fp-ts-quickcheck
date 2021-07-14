import { Endomorphism } from "fp-ts/lib/function";
import { Gen } from "./gen";
export interface Coarbitrary<A> {
    coarbitrary: <R>(a: A) => Endomorphism<Gen<R>>;
}
export declare const contramap: <B, A>(f: (b: B) => A) => (fa: Coarbitrary<A>) => Coarbitrary<B>;
