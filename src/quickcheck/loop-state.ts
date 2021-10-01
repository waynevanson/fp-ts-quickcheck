import { Seed } from "@no-day/fp-ts-lcg"
import { readonlyArray as A, state as S } from "fp-ts"
import {
  constVoid,
  flow,
  increment,
  pipe,
  unsafeCoerce,
} from "fp-ts/lib/function"
import * as lens from "monocle-ts/Lens"

export interface LoopFailure {
  seed: Seed
  index: number
  data: unknown
}

export interface LoopState {
  seed: Seed
  index: number
  successes: number
  failures: ReadonlyArray<LoopFailure>
}

export interface Loop<A> extends S.State<LoopState, A> {}

export const incrementIndex = pipe(
  lens.id<LoopState>(),
  lens.prop("index"),
  lens.modify(increment),
  S.modify,
)

export const withSeed = (seed: Seed): Loop<void> =>
  pipe(
    lens.id<LoopState>(),
    lens.prop("seed"),
    lens.modify(() => seed),
    S.modify,
  )

export const incrementSuccess: Loop<void> = pipe(
  lens.id<LoopState>(),
  lens.prop("successes"),
  lens.modify(increment),
  S.modify,
)

export function appendFailure(failure: LoopFailure): Loop<void> {
  return pipe(
    lens.id<LoopState>(),
    lens.prop("failures"),
    lens.modify(flow(A.append(failure), (a) => unsafeCoerce(a))),
    S.modify,
  )
}

export function makeFailure(data: unknown): Loop<LoopFailure> {
  return pipe(
    S.gets(pipe(lens.id<LoopState>(), lens.props("seed", "index")).get),
    S.map((most): LoopFailure => ({ ...most, data })),
  )
}

export const onFailure = (data: unknown): Loop<void> =>
  pipe(
    S.of<LoopState, void>(constVoid()),
    S.chain(() => makeFailure(data)),
    S.chain(appendFailure),
  )

export const onSuccess: Loop<void> = pipe(
  S.of<LoopState, void>(constVoid()),
  S.chainFirst(() => incrementSuccess),
)
