import * as gen from "@no-day/fp-ts-generators"
import * as lcg from "@no-day/fp-ts-lcg"
import { state as S, monoid as M, number as Number } from "fp-ts"
import { chainFirst as _chainFirst } from "fp-ts/lib/Chain"
import { pipe } from "fp-ts/lib/function"
import * as lens from "monocle-ts/Lens"

export * from "@no-day/fp-ts-generators"

export const chainFirst = _chainFirst(gen.Monad)

export function variant(seed: number): gen.Gen<void> {
  return S.modify(
    pipe(
      lens.id<gen.GenState>(),
      lens.prop("newSeed"),
      lens.modify(() => lcg.mkSeed(seed)),
    ),
  )
}

export const nextSeed: gen.Gen<void> = S.modify(({ newSeed, size }) => ({
  size,
  newSeed: lcg.lcgNext(newSeed),
}))
