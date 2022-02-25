/**
 * @summary
 * The `Arbitrary` typeclass represents a value that can be generated.
 */
import * as gen from "@no-day/fp-ts-generators"
import { state as S } from "fp-ts"
import { Applicative1 } from "fp-ts/lib/Applicative"
import { Apply1, sequenceS, sequenceT } from "fp-ts/lib/Apply"
import { flow, pipe, unsafeCoerce } from "fp-ts/lib/function"
import { Functor1 } from "fp-ts/lib/Functor"
import { Pointed1 } from "fp-ts/lib/Pointed"
import { EnforceNonEmptyRecord } from "./utils"

/**
 * @category Model
 */
export const URI = "Arbitrary"

/**
 * @category Model
 */
export type URI = typeof URI

/**
 * @category Model
 */
export interface Arbitrary<A> {
  arbitrary: gen.Gen<A>
}

declare module "fp-ts/HKT" {
  export interface URItoKind<A> {
    readonly [URI]: Arbitrary<A>
  }
}

// PIPEABLES

/**
 * @category Pointed
 */
export const of: <A>(a: A) => Arbitrary<A> = (a) => ({ arbitrary: S.of(a) })

/**
 * @category Functor
 */
export const map: <A, B>(
  f: (a: A) => B,
) => (fa: Arbitrary<A>) => Arbitrary<B> = (f) => (fa) => ({
  arbitrary: pipe(fa.arbitrary, S.map(f)),
})

/**
 * @category Apply
 */
export const ap: <A>(
  fa: Arbitrary<A>,
) => <B>(fab: Arbitrary<(a: A) => B>) => Arbitrary<B> = (fa) => (fab) => ({
  arbitrary: pipe(fab.arbitrary, S.ap(fa.arbitrary)),
})

/**
 * @category Chain
 */
export const chain: <A, B>(
  f: (a: A) => Arbitrary<B>,
) => (fa: Arbitrary<A>) => Arbitrary<B> = (f) => (fa) => ({
  arbitrary: pipe(fa.arbitrary, S.chain(flow(f, (b) => b.arbitrary))),
})

// INSTANCES

/**
 * @category Typeclasses
 */
export const Pointed: Pointed1<URI> = { URI, of }

/**
 * @category Typeclasses
 */
export const Functor: Functor1<URI> = { URI, map: (fa, f) => map(f)(fa) }

/**
 * @category Typeclasses
 */
export const Apply: Apply1<URI> = { ...Functor, ap: (fab, fa) => ap(fa)(fab) }

/**
 * @category Typeclasses
 */
export const Applicative: Applicative1<URI> = { ...Pointed, ...Apply }

// CONSTRUCTORS

/**
 * @summary
 * Lift a generator into the `Arbitrary` typeclass.
 *
 * @category Constructors
 */
export function fromGen<A>(gen: gen.Gen<A>): Arbitrary<A> {
  return { arbitrary: gen }
}

// COMBINATORS

/**
 * @summary
 * Generates an array with a random size, then each has the random contents.
 *
 * @category Combinators
 */
export function array<A>(arbitrary: Arbitrary<A>): Arbitrary<ReadonlyArray<A>> {
  return {
    arbitrary: gen.arrayOf(arbitrary.arbitrary),
  }
}

export function vector(size: number) {
  return <A>(fa: Arbitrary<A>): Arbitrary<ReadonlyArray<A>> => ({
    arbitrary: gen.vectorOf(size)(fa.arbitrary),
  })
}

/**
 * @category Combinators
 */
export const readonly: <A>(fa: Arbitrary<A>) => Arbitrary<Readonly<A>> =
  unsafeCoerce

/**
 * @summary
 * Removes the `Readonly` constraint from the value within an `Arbitrary` instance.
 *
 * @category Combinators
 */
export const mutable: <A>(fa: Arbitrary<Readonly<A>>) => Arbitrary<A> =
  unsafeCoerce

/**
 * @category Combinators
 */
export function tuple<
  R extends readonly [Arbitrary<unknown>, ...Arbitrary<unknown>[]],
>(...arbitraries: R) {
  return sequenceT(Apply)(...arbitraries)
}

/**
 * @category Combinators
 */
export function struct<R extends Record<string, unknown>>(
  struct: EnforceNonEmptyRecord<{ [P in keyof R]: Arbitrary<R[P]> }>,
) {
  return sequenceS(Apply)(struct) as Arbitrary<R>
}

//PRIMITIVES

/**
 * @category Primitives
 */
export const number: Arbitrary<number> = {
  arbitrary: gen.int({
    min: Number.MAX_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
  }),
}

/**
 * @category Primitives
 */
export function int(
  options: Partial<Record<"min" | "max", number>>,
): Arbitrary<number> {
  return { arbitrary: gen.int(options) }
}

/**
 * @summary
 * Generate a single character string.
 *
 * @category Primitives
 * @todo Would you prefer stricter typing with the `Char` type?
 */
export const character: Arbitrary<string> = {
  arbitrary: gen.char(),
}

/**
 * @category Primitives
 */
export const string: Arbitrary<string> = {
  arbitrary: gen.string(),
}

/**
 * @category Primitives
 */
export const boolean: Arbitrary<boolean> = {
  arbitrary: gen.boolean,
}
