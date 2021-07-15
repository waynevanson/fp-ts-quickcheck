/**
 * Basically the module creates a deterministic seed given by type `<A>`,
 * which can then be used to create
 */
import { either as E, option as O } from "fp-ts";
import { Ordering } from "fp-ts/lib/Ordering";
import { Arbitrary } from "./arbitrary";
import { Gen } from "./gen";
/**
 * @category Model
 */
export declare const URI = "Coarbitrary";
/**
 * @category Model
 */
export declare type URI = typeof URI;
/**
 * @category Model
 */
export interface Coarbitrary<A> {
    coarbitrary: (a: A) => <R>(fa: Gen<R>) => Gen<R>;
}
declare module "fp-ts/HKT" {
    interface URItoKind<A> {
        readonly [URI]: Coarbitrary<A>;
    }
}
/**
 * @category Contravariant
 */
export declare const contramap: <B, A>(f: (b: B) => A) => (fa: Coarbitrary<A>) => Coarbitrary<B>;
export declare const ordering: Coarbitrary<Ordering>;
export declare const boolean: Coarbitrary<boolean>;
export declare function option<A>(fa: Coarbitrary<A>): Coarbitrary<O.Option<A>>;
export declare function either<E, A>(fe: Coarbitrary<E>, fa: Coarbitrary<A>): Coarbitrary<E.Either<E, A>>;
export declare function func<E, A>(ge: Arbitrary<E>, fa: Coarbitrary<A>): Coarbitrary<(e: E) => A>;
