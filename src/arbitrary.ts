/**
 * @summary
 * The `Arbitrary` typeclass represents a value that can be generated.
 */
import { readonlyArray as A, state as S } from "fp-ts";
import { Applicative1 } from "fp-ts/lib/Applicative";
import { Apply1, sequenceS, sequenceT } from "fp-ts/lib/Apply";
import { constant, flow, pipe, unsafeCoerce } from "fp-ts/lib/function";
import { Functor1 } from "fp-ts/lib/Functor";
import { Pointed1 } from "fp-ts/lib/Pointed";
import * as gen from "./gen";
import { EnforceNonEmptyRecord } from "./utils";

/**
 * @category Model
 */
export const URI = "Arbitrary";

/**
 * @category Model
 */
export type URI = typeof URI;

/**
 * @category Model
 */
export interface Arbitrary<A> {
  arbitrary: gen.Gen<A>;
}

declare module "fp-ts/HKT" {
  export interface URItoKind<A> {
    readonly [URI]: Arbitrary<A>;
  }
}

// PIPEABLES

/**
 * @category Pointed
 */
export const of: <A>(a: A) => Arbitrary<A> = (a) => ({ arbitrary: S.of(a) });

/**
 * @category Functor
 */
export const map: <A, B>(f: (a: A) => B) => (fa: Arbitrary<A>) => Arbitrary<B> =
  (f) => (fa) => ({ arbitrary: pipe(fa.arbitrary, S.map(f)) });

/**
 * @category Apply
 */
export const ap: <A>(
  fa: Arbitrary<A>
) => <B>(fab: Arbitrary<(a: A) => B>) => Arbitrary<B> = (fa) => (fab) => ({
  arbitrary: pipe(fab.arbitrary, S.ap(fa.arbitrary)),
});

/**
 * @category Chain
 */
export const chain: <A, B>(
  f: (a: A) => Arbitrary<B>
) => (fa: Arbitrary<A>) => Arbitrary<B> = (f) => (fa) => ({
  arbitrary: pipe(fa.arbitrary, S.chain(flow(f, (b) => b.arbitrary))),
});

// INSTANCES

/**
 * @category Typeclasses
 */
export const Pointed: Pointed1<URI> = { URI, of };

/**
 * @category Typeclasses
 */
export const Functor: Functor1<URI> = { URI, map: (fa, f) => map(f)(fa) };

/**
 * @category Typeclasses
 */
export const Apply: Apply1<URI> = { ...Functor, ap: (fab, fa) => ap(fa)(fab) };

/**
 * @category Typeclasses
 */
export const Applicative: Applicative1<URI> = { ...Pointed, ...Apply };

// CONSTRUCTORS

/**
 * @summary
 * Lift a generator into the `Arbitrary` typeclass.
 *
 * @category Constructors
 */
export function fromGen<A>(gen: gen.Gen<A>): Arbitrary<A> {
  return { arbitrary: gen };
}

// COMBINATORS

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

/**
 * @category Combinators
 */
export const readonly: <A>(fa: Arbitrary<A>) => Arbitrary<Readonly<A>> =
  unsafeCoerce;

/**
 * @summary
 * Removes the `Readonly` constraint from the value within an `Arbitrary` instance.
 *
 * @category Combinators
 */
export const mutable: <A>(fa: Arbitrary<Readonly<A>>) => Arbitrary<A> =
  unsafeCoerce;

/**
 * @category Combinators
 */
export function tuple<
  R extends readonly [Arbitrary<unknown>, ...Arbitrary<unknown>[]]
>(...arbitraries: R) {
  return pipe(sequenceT(Apply)(...arbitraries));
}

/**
 * @category Combinators
 */
export function struct<R extends Record<string, Arbitrary<unknown>>>(
  struct: EnforceNonEmptyRecord<R>
) {
  return sequenceS(Apply)(struct);
}

//PRIMITIVES

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
 * @category Primitives
 * @todo Would you prefer stricter typing with the `Char` type?
 */
export const character: Arbitrary<string> = {
  arbitrary: pipe(
    gen.chooseInt(0, 65536),
    S.map((a) => String.fromCharCode(a))
  ),
};
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
