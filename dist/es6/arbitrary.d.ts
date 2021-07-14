/**
 * To shrink these bad boys, we need some TSRATEGIES!
 *
 *
 *
 */
import * as gen from "./gen";
import { Pointed1 } from "fp-ts/lib/Pointed";
import { Functor1 } from "fp-ts/lib/Functor";
import { Applicative1 } from "fp-ts/lib/Applicative";
import { Apply1 } from "fp-ts/lib/Apply";
export declare const URI = "Arbitrary";
export declare type URI = typeof URI;
export interface Arbitrary<A> {
    arbitrary: gen.Gen<A>;
}
declare module "fp-ts/HKT" {
    interface URItoKind<A> {
        readonly [URI]: Arbitrary<A>;
    }
}
export declare const of: <A>(a: A) => Arbitrary<A>;
export declare const map: <A, B>(f: (a: A) => B) => (fa: Arbitrary<A>) => Arbitrary<B>;
export declare const ap: <A>(fa: Arbitrary<A>) => <B>(fab: Arbitrary<(a: A) => B>) => Arbitrary<B>;
export declare const chain: <A, B>(f: (a: A) => Arbitrary<B>) => (fa: Arbitrary<A>) => Arbitrary<B>;
export declare const Pointed: Pointed1<URI>;
export declare const Functor: Functor1<URI>;
export declare const Apply: Apply1<URI>;
export declare const Applicative: Applicative1<URI>;
/**
 * @category Primitives
 */
export declare const number: Arbitrary<number>;
/**
 * @summary
 * Generate a single character string.
 *
 * `65536` seems to be the maximum charcode supported by javascript.
 *
 * @category Primitives
 */
export declare const character: Arbitrary<string>;
/**
 * @summary
 * Generates an array with a random size, then each has the random contents.
 *
 * @category Combinators
 */
export declare function array<A>(arbitrary: Arbitrary<A>): Arbitrary<ReadonlyArray<A>>;
export declare function readonly<A>(fa: Arbitrary<A>): Arbitrary<Readonly<A>>;
export declare function mutable<A>(fa: Arbitrary<Readonly<A>>): Arbitrary<A>;
export declare type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R;
export declare function tuple<R extends readonly [Arbitrary<unknown>, ...Arbitrary<unknown>[]]>(...arbitraries: R): Arbitrary<[...{ [K in keyof R]: [R[K]] extends [Arbitrary<infer A>] ? A : never; }]>;
export declare function struct<R extends Record<string, Arbitrary<unknown>>>(struct: EnforceNonEmptyRecord<R>): Arbitrary<{ [K in keyof R]: [R[K]] extends [Arbitrary<infer A>] ? A : never; }>;
/**
 * @category Primitives
 */
export declare const string: Arbitrary<string>;
/**
 * @category Primitives
 */
export declare const boolean: Arbitrary<boolean>;
