import * as lcg from "@no-day/fp-ts-lcg";
import { pipe } from "fp-ts/lib/function";
import * as l from "monocle-ts/Lens";

/**
 * @summary
 * The state used in `Gen`.
 * `seed`, and
 * `size` is the current size of the `Gen`.
 */
export interface GenState {
  seed: lcg.Seed;
  // 0 <= size
  size: number;
}

export const lensId = l.id<GenState>();
export const lensSeed = pipe(lensId, l.prop("seed"));
export const lensSize = pipe(lensId, l.prop("size"));

/**
 * @summary
 * LCG `next` applied to `seed` property in `GenState`.
 */
export const next = pipe(lensSeed, l.modify(lcg.lcgNext));

export const perturb = (n: number) =>
  pipe(lensSeed, l.modify(lcg.lcgPertub(n)));
