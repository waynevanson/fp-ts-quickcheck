/**
 * @summary
 *
 */
import { task as T, readerTask as RT, eq as EQ } from "fp-ts";
import { pipe } from "fp-ts/lib/function";

/**
 * @summary
 * A `Property` is an asynchronous thunk.
 * By using this signature, these can be composed with test runners
 * and testing frameworks like jest.
 */
export type Property<R extends readonly unknown[], A> = RT.ReaderTask<R, A>;

// two args, and a compare?

/**
 * @summary
 * Takes a polymorphic  version of Magma's concat,
 * and an EQ for comparison.
 */
export function commutative<A, R extends readonly [x: A, y: A], B>(
  f: (...args: R) => T.Task<B>,
  eq: EQ.Eq<B>
) {
  return pipe();
}
