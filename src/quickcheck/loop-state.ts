import * as lcg from "@no-day/fp-ts-lcg"
import {
  monoid as M,
  readonlyArray as A,
  state as S,
  number as Number,
  void as Void,
} from "fp-ts"
import {
  constVoid,
  flow,
  increment,
  pipe,
  unsafeCoerce,
} from "fp-ts/lib/function"
import * as lens from "monocle-ts/Lens"

export interface LoopFailure {
  seed: lcg.Seed
  index: number
  data: unknown
}

export interface LoopState {
  seed: lcg.Seed
  index: number
  successes: number
  failures: ReadonlyArray<LoopFailure>
}

export interface Loop<A> extends S.State<LoopState, A> {}

export const MonoidSeed: M.Monoid<lcg.Seed> = {
  concat: (x: lcg.Seed, y: lcg.Seed) =>
    lcg.mkSeed(Number.MonoidSum.concat(lcg.unSeed(x), lcg.unSeed(y))),
  empty: lcg.mkSeed(0),
}

export const MonoidLoopFailure: M.Monoid<LoopFailure> = M.struct({
  index: Number.MonoidSum,
  seed: MonoidSeed,
  data: Void.Monoid as M.Monoid<unknown>,
})

export const MonoidLoopState: M.Monoid<LoopState> = M.struct({
  successes: Number.MonoidSum,
  index: Number.MonoidSum,
  seed: MonoidSeed,
  failures: A.getMonoid(),
})

export const incrementIndex = pipe(
  lens.id<LoopState>(),
  lens.prop("index"),
  lens.modify(increment),
  S.modify,
)

export const seedPut = (seed: lcg.Seed): Loop<void> =>
  pipe(
    lens.id<LoopState>(),
    lens.prop("seed"),
    lens.modify(() => seed),
    S.modify,
  )

export const successIncrement: Loop<void> = pipe(
  lens.id<LoopState>(),
  lens.prop("successes"),
  lens.modify(increment),
  S.modify,
)

export function failureAppend(failure: LoopFailure): Loop<void> {
  return pipe(
    lens.id<LoopState>(),
    lens.prop("failures"),
    lens.modify(flow(A.append(failure), (a) => unsafeCoerce(a))),
    S.modify,
  )
}

export function failureMake(data: unknown): Loop<LoopFailure> {
  return pipe(
    S.gets(pipe(lens.id<LoopState>(), lens.props("seed", "index")).get),
    S.map((most): LoopFailure => ({ ...most, data })),
  )
}

export function onFailure(data: unknown): Loop<void> {
  return pipe(
    S.of<LoopState, void>(constVoid()),
    S.chain(() => failureMake(data)),
    S.chain(failureAppend),
  )
}

export const onSuccess: Loop<void> = pipe(
  S.of<LoopState, void>(constVoid()),
  S.chainFirst(() => successIncrement),
)
