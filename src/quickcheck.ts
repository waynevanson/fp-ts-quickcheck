/**
 * @summary
 * Runs a list of generators, with the option to configure size and the seed number if that's what your heart desires.
 *
 * @description
 *
 */

import { lcgNext, mkSeed, Seed } from "@no-day/fp-ts-lcg";
import {
  boolean as BL,
  either as E,
  readonlyArray as A,
  task as T,
  taskEither as TE,
  console as Console,
} from "fp-ts";
import {
  constVoid,
  flow,
  identity,
  increment,
  pipe,
  tupled,
  unsafeCoerce,
} from "fp-ts/lib/function";
import * as lens from "monocle-ts/Lens";
import { Arbitrary } from "./arbitrary";
import * as ST from "./StateTask";
import { tailRecM } from "./utils";
import * as gen from "./gen";
import { Gen, GenState } from "./gen";

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

export const incrementIndex = pipe(
  lens.id<LoopState>(),
  lens.prop("index"),
  lens.modify(increment),
  ST.modify
);

export const withSeed = (seed: Seed) =>
  pipe(
    lens.id<LoopState>(),
    lens.prop("seed"),
    lens.modify(() => seed),
    ST.modify
  );

export const incrementSuccess = pipe(
  lens.id<LoopState>(),
  lens.prop("successes"),
  lens.modify(increment),
  ST.modify
);

export function appendFailure(failure: LoopFailure) {
  return pipe(
    lens.id<LoopState>(),
    lens.prop("failures"),
    lens.modify(flow(A.append(failure), (a) => unsafeCoerce(a))),
    ST.modify
  );
}

export function makeFailure(
  data: unknown
): ST.StateTask<LoopState, LoopFailure> {
  return pipe(
    ST.gets(pipe(lens.id<LoopState>(), lens.props("seed", "index")).get),
    ST.map((most): LoopFailure => ({ ...most, data }))
  );
}

export const onFailure = (data: unknown) =>
  pipe(
    ST.of<void, LoopState>(constVoid()),
    ST.chain(() => makeFailure(data)),
    ST.chain(appendFailure)
  );

export const onSuccess = pipe(
  ST.of<void, LoopState>(constVoid()),
  ST.chainFirst(() => incrementSuccess)
);

export function runProperty<A extends readonly unknown[]>(
  gen: Gen<A>,
  property: Property<A>
) {
  return pipe(
    gen,
    ST.fromState,
    ST.chainTask(
      flow(tupled(property), (property) => TE.tryCatch(property, identity))
    )
  );
}

// call when we need to loop again
export const onRepeat = <A extends readonly unknown[]>(
  { property }: QuickCheckOptions<A>,
  { arbitrary: gen }: Arbitrary<A>
) =>
  pipe(
    ST.gets((state: LoopState): GenState => ({ seed: state.seed, size: 10 })),
    ST.chainTask(runProperty(gen, property)),
    ST.map(([value, { seed }]) => ({ seed, value })),
    // use the new seed from the generator
    ST.chainFirst(({ seed }) => withSeed(seed)),
    ST.chainFirst(() => incrementIndex),
    ST.chain(({ value }) =>
      pipe(
        value,
        E.match(onFailure, () => onSuccess)
      )
    )
  );

export interface QuickCheckOptions<A extends readonly unknown[]> {
  initialSeed: number;
  count: number;
  property: Property<A>;
}

export function quickCheck<A extends readonly unknown[]>(
  options: QuickCheckOptions<A>
) {
  return (Arbitrary: Arbitrary<A>): T.Task<void> =>
    pipe(
      ST.of<void, LoopState>(constVoid()),
      // this is where the work happens
      tailRecM(ST.Monad)(() =>
        pipe(
          ST.gets((a: LoopState) => a.index >= options.count),

          ST.chain(
            BL.matchW(
              () => pipe(onRepeat(options, Arbitrary), ST.map(E.left)),
              () => ST.of(E.right<void, void>(constVoid()))
            )
          )
        )
      ),
      // initial state - seed should be random af on some other functions
      ST.executeTask<LoopState>({
        failures: A.zero<LoopFailure>(),
        index: 0,
        successes: 0,
        seed: mkSeed(options.initialSeed),
      }),
      T.chain(T.fromIOK(Console.log))
    );
}
