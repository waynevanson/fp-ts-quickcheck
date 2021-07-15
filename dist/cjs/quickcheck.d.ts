/**
 * @summary
 * Runs a list of generators, with the option to configure size and the seed number if that's what your heart desires.
 *
 * @description
 *
 */
import { Seed } from "@no-day/fp-ts-lcg";
import { either as E, task as T } from "fp-ts";
import { Arbitrary } from "./arbitrary";
import { Gen, GenState } from "./gen";
import * as ST from "./StateTask";
export interface LoopFailure {
    seed: Seed;
    index: number;
    data: unknown;
}
export interface LoopState {
    seed: Seed;
    index: number;
    successes: number;
    failures: ReadonlyArray<LoopFailure>;
}
/**
 * @summary
 * A property is a function that tests whether something worked or not.
 *
 * Properties should have an assertion that **THROWS**,
 * as the thrown assertion indicates that the test will fail.
 */
export interface Property<R extends readonly unknown[]> {
    (...args: R): T.Task<void>;
}
export declare const incrementIndex: ST.StateTask<LoopState, void>;
export declare const withSeed: (seed: Seed) => ST.StateTask<LoopState, void>;
export declare const incrementSuccess: ST.StateTask<LoopState, void>;
export declare function appendFailure(failure: LoopFailure): ST.StateTask<LoopState, void>;
export declare function makeFailure(data: unknown): ST.StateTask<LoopState, LoopFailure>;
export declare const onFailure: (data: unknown) => ST.StateTask<LoopState, void>;
export declare const onSuccess: ST.StateTask<LoopState, void>;
export declare function runProperty<A extends readonly unknown[]>(gen: Gen<A>, property: Property<A>): ST.StateTask<GenState, E.Either<unknown, void>>;
export declare const onRepeat: <A extends readonly unknown[]>({ property }: QuickCheckOptions<A>, { arbitrary: gen }: Arbitrary<A>) => ST.StateTask<LoopState, void>;
export interface QuickCheckOptions<A extends readonly unknown[]> {
    initialSeed: number;
    count: number;
    property: Property<A>;
}
export declare function quickCheck<A extends readonly unknown[]>(options: QuickCheckOptions<A>): (Arbitrary: Arbitrary<A>) => T.Task<void>;
