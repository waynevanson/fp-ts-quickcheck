import {
  monoid as M,
  number as Number,
  option as O,
  state as S,
  void as Void,
} from "fp-ts"
import { increment, pipe } from "fp-ts/lib/function"
import * as lens from "monocle-ts/Lens"
import * as lcg from "./modules/lcg"
import { MonoidSeed } from "./modules/lcg"

export interface LoopState {
  seed: lcg.Seed
  index: number
  successes: number
  failure: O.Option<LoopFailure>
}

export interface LoopFailure {
  seed: lcg.Seed
  index: number
  data: unknown
}

export const MonoidFailure: M.Monoid<LoopFailure> = M.struct({
  index: Number.MonoidSum,
  seed: MonoidSeed,
  data: Void.Monoid as M.Monoid<unknown>,
})

export const Monoid: M.Monoid<LoopState> = M.struct({
  successes: Number.MonoidSum,
  index: Number.MonoidSum,
  seed: lcg.MonoidSeed,
  failure: O.getMonoid(MonoidFailure),
})

export function putFailure(failure: LoopFailure) {
  return pipe(
    lens.id<LoopState>(),
    lens.prop("failure"),
    lens.modify(() => O.some(failure)),
    S.modify,
  )
}

export function makeFailureFromLoopState(data: unknown) {
  return ({ index, seed }: LoopState): LoopFailure => ({ index, seed, data })
}

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
