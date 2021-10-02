import * as lcg from "@no-day/fp-ts-lcg"
import {
  monoid as M,
  number as Number,
  readonlyArray as A,
  state as S,
  void as Void,
} from "fp-ts"
import { flow, pipe, unsafeCoerce } from "fp-ts/lib/function"
import * as lens from "monocle-ts/Lens"
import { MonoidSeed } from "../modules/lcg"
import { LoopState } from "./common"

export interface LoopFailure {
  seed: lcg.Seed
  index: number
  data: unknown
}

export function append(failure: LoopFailure) {
  return pipe(
    lens.id<LoopState>(),
    lens.prop("failures"),
    lens.modify(flow(A.append(failure), (a) => unsafeCoerce(a))),
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
