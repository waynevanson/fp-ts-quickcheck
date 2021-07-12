import { Gen } from "./arbitrary";

export interface Coarbitrary<A, B> {
  coarbitrary: (a: A) => (fb: Gen<B>) => Gen<B>;
}
