/**
 * @description
 * When researching how to create this library, there's definitely a lack of documentation on how the internals work.
 *
 * So a generator `Gen<A>` can functionally generate a value of `A`, given a `seed` and a `size`.
 * Some generators don't need these values, but `seed` is the most commonly used one.
 *
 * We use the `State` monad because it gives us a level of determinism that allows troubleshooting and shrinking of values.
 *
 * All values must be possibly generated by numbers, so we can use the seed or size parameters from the state.
 */
import * as lcg from "@no-day/fp-ts-lcg";
import { readonlyNonEmptyArray as NEA, state as S } from "fp-ts";
import { Apply1 } from "fp-ts/lib/Apply";
import { Chain1 } from "fp-ts/lib/Chain";
import { Functor1 } from "fp-ts/lib/Functor";
import { Pointed1 } from "fp-ts/lib/Pointed";
/**
 * @category Model
 */
export declare const URI = "Gen";
/**
 * @category Model
 */
export declare type URI = typeof URI;
/**
 * @category Model
 */
export interface GenState {
    seed: lcg.Seed;
    size: number;
}
/**
 * @category Model
 */
export interface Gen<A> extends S.State<GenState, A> {
}
declare module "fp-ts/HKT" {
    interface URItoKind<A> {
        readonly [URI]: Gen<A>;
    }
}
export declare const of: <A>(a: A) => Gen<A>;
export declare const map: <A, B>(f: (a: A) => B) => (fa: Gen<A>) => Gen<B>;
export declare const ap: <A>(fa: Gen<A>) => <B>(fa: Gen<(a: A) => B>) => Gen<B>;
export declare const chain: <A, B>(f: (a: A) => Gen<B>) => (fa: Gen<A>) => Gen<B>;
export declare const Pointed: Pointed1<URI>;
export declare const Functor: Functor1<URI>;
export declare const Apply: Apply1<URI>;
export declare const Chain: Chain1<URI>;
export declare const chainFirst: <A, B>(f: (a: A) => Gen<B>) => (first: Gen<A>) => Gen<A>;
export declare const bind: <N extends string, A, B>(name: Exclude<N, keyof A>, f: (a: A) => Gen<B>) => (ma: Gen<A>) => Gen<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B; }>;
export declare const Do: Gen<{}>;
/**
 * @category Constructors
 */
export declare const next: Gen<void>;
/**
 * @category Constructors
 */
export declare const uniform: Gen<number>;
/**
 * @summary
 * Modifies the seed using an LCG perturber.
 *
 * @category Constructors
 */
export declare function perturb(perturber: number): Gen<void>;
/**
 * @summary
 *
 * @category Constructors
 */
export declare function repeatable<A, B>(kleisli: (a: A) => Gen<B>): Gen<(a: A) => B>;
/**
 * @summary
 * Change the seed to a specific value, useful for shrinking and other
 * deterministic operations.
 *
 * @category Constructors
 */
export declare function variant(seed: number): Gen<void>;
/**
 * @summary
 * Get the size of the current generator.
 *
 * @category Constructors
 */
export declare const sized: Gen<number>;
/**
 * @summary
 * Retrieves the current `Seed` from the state, coerced to a number.
 * Useful when using the seed to generate values
 *
 * @category Constructors
 */
export declare const seeded: Gen<number>;
/**
 * @summary
 * Select a randomly uniform integer betwee `min` and `max`. Also takes a bounded instance.
 *
 * @category Constructors
 * @todo **note**: Normalize the value to a 32 bit integer.
 */
export declare function chooseInt(min: number, max: number): Gen<number>;
/**
 * @summary
 * From a `ReadonlyNonEmptyArray` of `Gen<A>`'s, randomly pick a generator.
 *
 * @category Combinators
 */
export declare function oneOf<A>(gens: NEA.ReadonlyNonEmptyArray<Gen<A>>): Gen<A>;
