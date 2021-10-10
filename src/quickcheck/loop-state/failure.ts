import * as lcg from "@no-day/fp-ts-lcg"
import {
  monoid as M,
  number as Number,
  option as O,
  state as S,
  void as Void,
} from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import * as lens from "monocle-ts/Lens"
import { MonoidSeed } from "../../modules/lcg"
import { LoopState } from "./state"

export interface LoopFailure {
  seed: lcg.Seed
  index: number
  data: unknown
}

export function failurePut(failure: LoopFailure) {
  return pipe(
    lens.id<LoopState>(),
    lens.prop("failure"),
    lens.modify(() => O.some(failure)),
    S.modify,
  )
}

export function make(data: unknown) {
  return pipe(
    S.gets(pipe(lens.id<LoopState>(), lens.props("seed", "index")).get),
    S.map((most): LoopFailure => ({ ...most, data })),
  )
}

export const Monoid: M.Monoid<LoopFailure> = M.struct({
  index: Number.MonoidSum,
  seed: MonoidSeed,
  data: Void.Monoid as M.Monoid<unknown>,
})
