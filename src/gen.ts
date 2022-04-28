import * as gen from "@no-day/fp-ts-generators"
import * as lcg from "@no-day/fp-ts-lcg"
import { either, nonEmptyArray } from "fp-ts"
import { chainFirst as _chainFirst } from "fp-ts/lib/Chain"
import { Lazy, pipe } from "fp-ts/lib/function"
import { Predicate } from "fp-ts/lib/Predicate"
import { Refinement } from "fp-ts/lib/Refinement"
import * as lens from "monocle-ts/Lens"
import { state } from "./modules/fp-ts"

export * from "@no-day/fp-ts-generators"

export const chainFirst = _chainFirst(gen.Monad)

export function variant(seed: number): gen.Gen<void> {
  return state.modify(
    pipe(
      lens.id<gen.GenState>(),
      lens.prop("newSeed"),
      lens.modify(() => lcg.mkSeed(seed)),
    ),
  )
}

export const nextSeed: gen.Gen<void> = state.modify(({ newSeed, size }) => ({
  size,
  newSeed: lcg.lcgNext(newSeed),
}))

/* istanbul ignore next */
export function union<T extends readonly [unknown, ...(readonly unknown[])]>(
  ...gens: { readonly [P in keyof T]: gen.Gen<T[P]> }
): gen.Gen<T[number]> {
  return gen.oneOf(
    gens as unknown as nonEmptyArray.NonEmptyArray<gen.Gen<T[number]>>,
  )
}

export const of: <A>(a: A) => gen.Gen<A> = gen.of

export const map: <A, B>(f: (a: A) => B) => (fa: gen.Gen<A>) => gen.Gen<B> =
  gen.map

export const ap: <A>(
  fa: gen.Gen<A>,
) => <B>(fab: gen.Gen<(a: A) => B>) => gen.Gen<B> = gen.ap

export function lazy<A>(lazy: Lazy<gen.Gen<A>>): gen.Gen<A> {
  return (s) => lazy()(s)
}

export const nullable: <T>(arbitrary: gen.Gen<T>) => gen.Gen<T | null> = (
  arbitrary,
) => union(arbitrary, gen.of(null))

export function filter<A, B extends A>(
  f: Predicate<A> | Refinement<A, B>,
): (fa: gen.Gen<A>) => gen.Gen<B> {
  return (fa) =>
    pipe(
      fa,
      gen.chain(
        state.chainRec((a) =>
          f(a)
            ? state.of(either.right(a))
            : pipe(fa, state.apFirst(nextSeed), state.map(either.left)),
        ),
      ),
    )
}
