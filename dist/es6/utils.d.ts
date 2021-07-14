import { either as E } from "fp-ts";
import { Kind2 } from "fp-ts/lib/HKT";
import { Monad2 } from "fp-ts/lib/Monad";
/**
 * @summary
 * Tail recursion via Monad.
 *
 * **note:** not stack safe
 */
export declare const tailRecM: <M extends keyof import("fp-ts/HKT").URItoKind2<any, any>>(M: Monad2<M>) => <E, A, B>(f: (a: A) => Kind2<M, E, E.Either<A, B>>) => (fa: Kind2<M, E, A>) => Kind2<M, E, B>;
