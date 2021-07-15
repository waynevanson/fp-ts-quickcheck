import { readerTask as RT } from "fp-ts";
/**
 * @summary
 * A `Property` is an asynchronous thunk.
 * By using this signature, these can be composed with test runners
 * and testing frameworks like jest.
 */
export declare type Property<R extends readonly unknown[], A> = RT.ReaderTask<R, A>;
