import { Applicative1 } from "fp-ts/lib/Applicative";
import { Apply1 } from "fp-ts/lib/Apply";
import { Functor1 } from "fp-ts/lib/Functor";
import { Pointed1 } from "fp-ts/lib/Pointed";
import * as gen from "./gen";
import { EnforceNonEmptyRecord } from "./utils";
/**
 * @category Model
 */
export declare const URI = "Arbitrary";
/**
 * @category Model
 */
export declare type URI = typeof URI;
/**
 * @category Model
 */
export interface Arbitrary<A> {
    arbitrary: gen.Gen<A>;
}
declare module "fp-ts/HKT" {
    interface URItoKind<A> {
        readonly [URI]: Arbitrary<A>;
    }
}
/**
 * @category Pointed
 */
export declare const of: <A>(a: A) => Arbitrary<A>;
/**
 * @category Functor
 */
export declare const map: <A, B>(f: (a: A) => B) => (fa: Arbitrary<A>) => Arbitrary<B>;
/**
 * @category Apply
 */
export declare const ap: <A>(fa: Arbitrary<A>) => <B>(fab: Arbitrary<(a: A) => B>) => Arbitrary<B>;
/**
 * @category Chain
 */
export declare const chain: <A, B>(f: (a: A) => Arbitrary<B>) => (fa: Arbitrary<A>) => Arbitrary<B>;
/**
 * @category Typeclasses
 */
export declare const Pointed: Pointed1<URI>;
/**
 * @category Typeclasses
 */
export declare const Functor: Functor1<URI>;
/**
 * @category Typeclasses
 */
export declare const Apply: Apply1<URI>;
/**
 * @category Typeclasses
 */
export declare const Applicative: Applicative1<URI>;
/**
 * @summary
 * Lift a generator into the `Arbitrary` typeclass.
 *
 * @category Constructors
 */
export declare function fromGen<A>(gen: gen.Gen<A>): Arbitrary<A>;
/**
 * @summary
 * Generates an array with a random size, then each has the random contents.
 *
 * @category Combinators
 */
export declare function array<A>(arbitrary: Arbitrary<A>): Arbitrary<ReadonlyArray<A>>;
/**
 * @category Combinators
 */
export declare const readonly: <A>(fa: Arbitrary<A>) => Arbitrary<Readonly<A>>;
/**
 * @summary
 * Removes the `Readonly` constraint from the value within an `Arbitrary` instance.
 *
 * @category Combinators
 */
export declare const mutable: <A>(fa: Arbitrary<Readonly<A>>) => Arbitrary<A>;
/**
 * @category Combinators
 */
export declare function tuple<R extends readonly [Arbitrary<unknown>, ...Arbitrary<unknown>[]]>(...arbitraries: R): Arbitrary<[...{ [K in keyof R]: [R[K]] extends [Arbitrary<infer A>] ? A : never; }]>;
/**
 * @category Combinators
 */
export declare function struct<R extends Record<string, Arbitrary<unknown>>>(struct: EnforceNonEmptyRecord<R>): Arbitrary<{ [K in keyof R]: [R[K]] extends [Arbitrary<infer A>] ? A : never; }>;
/**
 * @category Primitives
 */
export declare const number: Arbitrary<number>;
/**
 * @summary
 * Generate a single character string.
 *
 * @category Primitives
 * @todo Would you prefer stricter typing with the `Char` type?
 */
export declare const character: Arbitrary<string>;
/**
 * @category Primitives
 */
export declare const string: Arbitrary<string>;
/**
 * @category Primitives
 */
export declare const boolean: Arbitrary<boolean>;
