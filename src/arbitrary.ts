/**
 * The `Arbitrary` typeclass represents a value that can be generated and shrunk.
 *
 * Please note that shrinking has not been implemented yet.
 */
import { either as E, nonEmptyArray as NEA, reader as R } from "fp-ts"
import { Applicative1 } from "fp-ts/lib/Applicative"
import { Apply1, sequenceS, sequenceT } from "fp-ts/lib/Apply"
import { Chain1 } from "fp-ts/lib/Chain"
import { flow, identity, pipe, unsafeCoerce, Lazy } from "fp-ts/lib/function"
import { Functor1 } from "fp-ts/lib/Functor"
import { Pointed1 } from "fp-ts/lib/Pointed"
import { Predicate } from "fp-ts/lib/Predicate"
import { Refinement } from "fp-ts/lib/Refinement"
import { generator as gen } from "./modules"
import { state as S } from "./modules/fp-ts"
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
  readonly arbitrary: gen.Gen<A>
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

/**
 * @category Typeclasses
 */
export const Chain: Chain1<URI> = {
  ...Applicative,
  chain: (fa, f) => chain(f)(fa),
}

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

/**
 * @category Constructors
 */
export function int(
  options?: Partial<Record<"min" | "max", number>>,
): Arbitrary<number> {
  return { arbitrary: gen.int(options) }
}

/**
 * @category Constructors
 */
export function float(
  options?: Partial<Record<"min" | "max", number>>,
): Arbitrary<number> {
  return { arbitrary: gen.float(options) }
}

/**
 * @summary
 * Generate a single character string.
 *
 * @category Constructors
 */
export const character: (
  options?: Partial<Record<"from" | "to", string>>,
) => Arbitrary<string> = flow(gen.char, fromGen)

/**
 * @category Constructors
 */
export const string: (
  options?: Partial<Record<"from" | "to", string>>,
) => Arbitrary<string> = flow(gen.string, fromGen)

// COMBINATORS

/**
 * Allow generating arbitraries of `T` or `null`.
 *
 * @category Combinators
 */
export const nullable: <T>(arbitrary: Arbitrary<T>) => Arbitrary<T | null> = (
  arbitrary,
) => union(arbitrary, of(null))

/**
 * @category Combinators
 */
export function lazy<A>(lazy: Lazy<Arbitrary<A>>): Arbitrary<A> {
  return { arbitrary: (s) => lazy().arbitrary(s) }
}

/**
 * Arbitrary cannot have a Compactable typeclass instance, as the state needs
 * to be supplied and called before being able to seperate the output
 * conditionally.
 *
 * @category Combinators
 */
export function filter<A, B extends A>(
  refinement: Refinement<A, B>,
): (fa: Arbitrary<A>) => Arbitrary<B>
export function filter<A>(
  predicate: Predicate<A>,
): (fa: Arbitrary<A>) => Arbitrary<A>
export function filter<A>(predicate: Predicate<A>) {
  return (fa: Arbitrary<A>): Arbitrary<A> => ({
    arbitrary: pipe(
      fa.arbitrary,
      S.chain(
        S.chainRec(
          flow(
            E.fromPredicate(predicate, identity),
            E.map((a): gen.Gen<E.Either<A, A>> => gen.of(E.right(a))),
            E.getOrElse(() =>
              pipe(
                fa.arbitrary,
                S.apFirst(gen.nextSeed),
                gen.map((e) => E.left(e)),
              ),
            ),
          ),
        ),
      ),
    ),
  })
}

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

/**
 * Generates an array with a fixed size, then each has the random contents.s
 * @category Combinators
 */
export function vector(size: number) {
  return <A>(fa: Arbitrary<A>): Arbitrary<ReadonlyArray<A>> => ({
    arbitrary: gen.vectorOf(size)(fa.arbitrary),
  })
}

/**
 * Adds the `Readonly` type constraint from the value within an `Arbitrary` instance.
 * @category Combinators
 */
export const readonly: <A>(fa: Arbitrary<A>) => Arbitrary<Readonly<A>> =
  unsafeCoerce

/**
 * @summary
 * Removes the `Readonly` type constraint from the value within an `Arbitrary` instance.
 *
 * @category Combinators
 */
export const mutable: <A>(fa: Arbitrary<Readonly<A>>) => Arbitrary<A> =
  unsafeCoerce

/**
 * @category Combinators
 */
export function tuple<
  R extends readonly [Arbitrary<unknown>, ...(readonly Arbitrary<unknown>[])],
>(...arbitraries: R) {
  return sequenceT(Apply)(...arbitraries)
}

/**
 * @category Combinators
 */
export function struct<R extends Record<string, unknown>>(
  struct: EnforceNonEmptyRecord<{ readonly [P in keyof R]: Arbitrary<R[P]> }>,
) {
  return sequenceS(Apply)(struct) as Arbitrary<R>
}

/**
 * @category Combinators
 */
export function union<T extends readonly [unknown, ...(readonly unknown[])]>(
  ...arbitraries: { readonly [P in keyof T]: Arbitrary<T[P]> }
): Arbitrary<T[number]> {
  return {
    arbitrary: gen.oneOf(
      pipe(
        arbitraries as unknown as NEA.NonEmptyArray<Arbitrary<T[number]>>,
        NEA.map((arbitrary) => arbitrary.arbitrary),
      ),
    ),
  }
}

// DESTRUCTORS

/**
 * @category Destructors
 */
export function toGen<A>(fa: Arbitrary<A>) {
  return fa.arbitrary
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
export const boolean: Arbitrary<boolean> = {
  arbitrary: gen.boolean,
}
