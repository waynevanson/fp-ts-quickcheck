import * as lcg from "@no-day/fp-ts-lcg"
import { monoid as M, number as Number } from "fp-ts"

export * from "@no-day/fp-ts-lcg"

export const MonoidSeed: M.Monoid<lcg.Seed> = {
  concat: (x: lcg.Seed, y: lcg.Seed) =>
    lcg.mkSeed(Number.MonoidSum.concat(lcg.unSeed(x), lcg.unSeed(y))),
  empty: lcg.mkSeed(0),
}
