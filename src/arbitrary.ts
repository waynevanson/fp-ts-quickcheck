/**
 * To shrink these bad boys, we need some TSRATEGIES!
 *
 *
 *
 */
import * as gen from "./gen";
import { constant, flow, pipe, unsafeCoerce } from "fp-ts/lib/function";
import { state as S, readonlyArray as A, readonlyRecord, functor } from "fp-ts";
import { Pointed1 } from "fp-ts/lib/Pointed";
import { Functor1 } from "fp-ts/lib/Functor";
import { Applicative1 } from "fp-ts/lib/Applicative";
import { Apply1, sequenceS, sequenceT } from "fp-ts/lib/Apply";

export const URI = "Arbitrary";
export type URI = typeof URI;

export interface Arbitrary<A> {
  arbitrary: gen.Gen<A>;
}

declare module "fp-ts/HKT" {
  export interface URItoKind<A> {
    readonly [URI]: Arbitrary<A>;
  }
}

export const of: <A>(a: A) => Arbitrary<A> = (a) => ({ arbitrary: S.of(a) });

export const map: <A, B>(f: (a: A) => B) => (fa: Arbitrary<A>) => Arbitrary<B> =
  (f) => (fa) => ({ arbitrary: pipe(fa.arbitrary, S.map(f)) });

export const ap: <A>(
  fa: Arbitrary<A>
) => <B>(fab: Arbitrary<(a: A) => B>) => Arbitrary<B> = (fa) => (fab) => ({
  arbitrary: pipe(fab.arbitrary, S.ap(fa.arbitrary)),
});

export const chain: <A, B>(
  f: (a: A) => Arbitrary<B>
) => (fa: Arbitrary<A>) => Arbitrary<B> = (f) => (fa) => ({
  arbitrary: pipe(fa.arbitrary, S.chain(flow(f, (b) => b.arbitrary))),
});

export const Pointed: Pointed1<URI> = { URI, of };

export const Functor: Functor1<URI> = { URI, map: (fa, f) => map(f)(fa) };

export const Apply: Apply1<URI> = { ...Functor, ap: (fab, fa) => ap(fa)(fab) };

export const Applicative: Applicative1<URI> = { ...Pointed, ...Apply };

/**
 * @category Primitives
 */
export const number: Arbitrary<number> = {
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
export const character: Arbitrary<string> = {
  arbitrary: pipe(
    gen.chooseInt(0, 65536),
    S.map((a) => String.fromCharCode(a))
  ),
};

/**
 * @summary
 * Generates an array with a random size, then each has the random contents.
 *
 * @category Combinators
 */
export function array<A>(arbitrary: Arbitrary<A>): Arbitrary<ReadonlyArray<A>> {
  return {
    arbitrary: pipe(
      gen.sized,
      S.chain((size) => gen.chooseInt(0, size)),
      S.chain((size) =>
        pipe(A.makeBy(size, constant(arbitrary.arbitrary)), S.sequenceArray)
      )
    ),
  };
}

export function readonly<A>(fa: Arbitrary<A>): Arbitrary<Readonly<A>> {
  return unsafeCoerce(fa);
}

export function mutable<A>(fa: Arbitrary<Readonly<A>>): Arbitrary<A> {
  return unsafeCoerce(fa);
}

export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R;

export function tuple<
  R extends readonly [Arbitrary<unknown>, ...Arbitrary<unknown>[]]
>(...arbitraries: R) {
  return pipe(sequenceT(Apply)(...arbitraries));
}

export function struct<R extends Record<string, Arbitrary<unknown>>>(
  struct: EnforceNonEmptyRecord<R>
) {
  return pipe(sequenceS(Apply)(struct));
}

/**
 * @category Primitives
 */
export const string: Arbitrary<string> = pipe(
  character,
  array,
  map((strings) => strings.join(""))
);

/**
 * @category Primitives
 */
export const boolean: Arbitrary<boolean> = {
  arbitrary: pipe(
    gen.uniform,
    S.map((seed) => seed < 0.5)
  ),
};
