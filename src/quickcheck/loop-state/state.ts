import {
  monoid as M,
  number as Number,
  option as O,
  readonlyArray as A,
} from "fp-ts"
import { increment, pipe } from "fp-ts/lib/function"
import * as lens from "monocle-ts/Lens"
import * as lcg from "../../modules/lcg"
import * as failure from "./failure"

export interface LoopState {
  seed: lcg.Seed
  index: number
  successes: number
  failure: O.Option<failure.LoopFailure>
}

export const Monoid: M.Monoid<LoopState> = M.struct({
  successes: Number.MonoidSum,
  index: Number.MonoidSum,
  seed: lcg.MonoidSeed,
  failure: O.getMonoid(failure.Monoid),
})

export const incrementIndex = pipe(
  lens.id<LoopState>(),
  lens.prop("index"),
  lens.modify(increment),
)

export function seedPut(seed: lcg.Seed) {
  return pipe(
    lens.id<LoopState>(),
    lens.prop("seed"),
    lens.modify(() => seed),
  )
}

export const incrementSuccess = pipe(
  lens.id<LoopState>(),
  lens.prop("successes"),
  lens.modify(increment),
)
