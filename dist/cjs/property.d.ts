/**
 * @summary
 *
 */
import { task as T, readerTask as RT, eq as EQ } from "fp-ts";
/**
 * @summary
 * A `Property` is an asynchronous thunk.
 * By using this signature, these can be composed with test runners
 * and testing frameworks like jest.
 */
export declare type Property<R extends readonly unknown[], A> = RT.ReaderTask<R, A>;
/**
 * @summary
 * Takes a polymorphic  version of Magma's concat,
 * and an EQ for comparison.
 */
export declare function commutative<A, R extends readonly [x: A, y: A], B>(f: (...args: R) => T.Task<B>, eq: EQ.Eq<B>): unknown;
