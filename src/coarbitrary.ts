import { Endomorphism, pipe } from "fp-ts/lib/function";
import { Gen } from "./gen";
import { state as S } from "fp-ts";

export interface Coarbitrary<A> {
  coarbitrary: <R>(a: A) => Endomorphism<Gen<R>>;
}

export const contramap: <B, A>(
  f: (b: B) => A
) => (fa: Coarbitrary<A>) => Coarbitrary<B> = (f) => (fa) => ({
  coarbitrary: (b) => fa.coarbitrary(f(b)),
});
