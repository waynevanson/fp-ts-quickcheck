/**
 * @summary
 * Runs a list of generators, with the option to configure size and the seed number if that's what your heart desires.
 *
 * @description
 *
 */

import { Seed } from "@no-day/fp-ts-lcg";

export interface LoopFailure {
  seed: Seed;
  index: number;
  message: string;
}

// run a test,
// report test number and index that is cooked
//
export interface LoopState {
  seed: Seed;
  index: number;
  successes: number;
  // the first is considered always the smallest
  failures: ReadonlyArray<LoopFailure>;
}

// 100 times,
// properties can throw, i think they should all be tasks
// StateTaskfffffffffffffff
