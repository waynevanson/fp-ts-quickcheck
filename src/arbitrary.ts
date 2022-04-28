/**
 * The `Arbitrary` typeclass represents a value that can be generated and shrunk.
 *
 * Please note that shrinking has not been implemented yet.
 */
import { nonEmptyArray, readonlyArray } from "fp-ts"
import { Applicative1 } from "fp-ts/lib/Applicative"
import { Apply1, sequenceS, sequenceT } from "fp-ts/lib/Apply"
import { Chain1 } from "fp-ts/lib/Chain"
import { flow, Lazy, pipe, unsafeCoerce } from "fp-ts/lib/function"
import { Functor1 } from "fp-ts/lib/Functor"
import { Pointed1 } from "fp-ts/lib/Pointed"
import { Predicate } from "fp-ts/lib/Predicate"
import { Refinement } from "fp-ts/lib/Refinement"
import * as gen from "./gen"
import { iterable, rose } from "./modules"
import * as shrink from "./shrink"

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
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Arbitrary<A> extends gen.Gen<rose.Rose<A>> {}

declare module "fp-ts/HKT" {
  export interface URItoKind<A> {
    readonly [URI]: Arbitrary<A>
  }
}

// PIPEABLES

/**
 * @category Pointed
 */
export const of: <A>(a: A) => Arbitrary<A> = (a) => gen.of(rose.of(a))

/**
 * @category Functor
 */
export const map: <A, B>(
  f: (a: A) => B,
) => (fa: Arbitrary<A>) => Arbitrary<B> = (f) => gen.map(rose.map(f))

/**
 * @category Apply
 */
export const ap: <A>(
  fa: Arbitrary<A>,
) => <B>(fab: Arbitrary<(a: A) => B>) => Arbitrary<B> = (fa) =>
  gen.chain((rab) =>
    pipe(
      fa,
      gen.map((ra) => pipe(rab, rose.ap(ra))),
    ),
  )

/**
 * @category Chain
 */
export const chain: <A, B>(
  f: (a: A) => Arbitrary<B>,
) => (fa: Arbitrary<A>) => Arbitrary<B> = (f) =>
  gen.chain((ra) =>
    pipe(ra, rose.traverse(gen.Applicative)(f), gen.map(rose.flatten)),
  )

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
export function fromGen<A>(gen_: gen.Gen<A>): Arbitrary<A> {
  return pipe(gen_, gen.map(rose.of))
}

export function fromGenK<T extends readonly unknown[], A>(
  gen_: (...args: T) => gen.Gen<A>,
): (...args: T) => Arbitrary<A> {
  return flow(gen_, fromGen)
}

const fromShrinker: <A>(f: Shrinker<A>) => (a: A) => rose.Rose<A> = (f) =>
  rose.unfoldRose((a) => ({ value: a, branch: f(a) }))

export type Shrinker<A> = (a: A) => Iterable<A>

const integralShrinker: Shrinker<number> = (int) =>
  int === 0
    ? // if zero end shrink
      iterable.zero<number>()
    : pipe(
        // if negative, start shrink with positive of same number
        int < 0 ? iterable.of(Math.abs(int)) : iterable.zero<number>(),
        // 0
        iterable.alt(() => iterable.of(0)),
        // logarithmically approach the number from 0
        iterable.alt(() => rightDichotomy(int)),
      )

const fromGenIntegral: (gen_: gen.Gen<number>) => Arbitrary<number> = gen.map(
  fromShrinker(integralShrinker),
)

/**
 * @category Constructors
 */
export const int = flow(gen.int, fromGenIntegral)

/**
 * @category Constructors
 */
export const float = flow(gen.float, fromGenIntegral)

export type StringParams = Partial<Record<"from" | "to", string>>

export function character(options?: StringParams): Arbitrary<string> {
  return pipe(gen.char(options), gen.map(fromShrinker(shrink.string)))
}

export function string(options?: StringParams): Arbitrary<string> {
  return pipe(gen.string(options), gen.map(fromShrinker(shrink.string)))
}

/**
 * Allow generating arbitraries of `T` or `null`.
 *
 * @category Combinators
 */
export const nullable: <T>(arbitrary: Arbitrary<T>) => Arbitrary<T | null> = (
  arbitrary,
) =>
  pipe(
    arbitrary,
    // prepend null to iterators, unless value is null
    gen.map((a) => a),
  )

// /**
//  * Creates an arbitrary as a struct that optionally defines properties.
//  *
//  * @category Combinators
//  */
// export function partial<T extends Record<string, unknown>>(arbitraries: {
//   readonly [P in keyof T]: Arbitrary<T[P]>
// }): Arbitrary<Partial<T>> {
//   // todo shrink
//   // all keys first and down on all,
//   // then all permutations of keys with number of keys increasing

//   return pipe()
// }

/**
 * Allows use of an arbitrary that is used after the current arbitrary is defined.
 * Useful for recursive patterns.
 *
 * @category Combinators
 * @example
 * const y = AR.lazy(() => x)
 * const x = AR.of(constVoid())
 * // now y can use x without it being unreachable code
 */
export function lazy<A>(lazy: Lazy<Arbitrary<A>>): Arbitrary<A> {
  return (s) => lazy()(s)
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
  return (fa: Arbitrary<A>): Arbitrary<A> =>
    pipe(
      fa,
      gen.filter((r) => predicate(r.value)),
      gen.map((fa) =>
        rose.make(
          fa.value,
          pipe(
            fa.branches,
            iterable.filter((fa) => predicate(fa.value)),
          ),
        ),
      ),
    )
}

/**
 * @summary
 * Generates an array with a random size, then each has the random contents.
 *
 * @category Combinators
 */
export function array<A>(arbitrary: Arbitrary<A>): Arbitrary<ReadonlyArray<A>> {
  // smallest array size first
  return pipe(
    gen.arrayOf(arbitrary),
    gen.map(flow(readonlyArray.sequence(rose.Applicative))),
  )
}

/**
 * Generates an array with a fixed size, then each has the random contents.
 * @category Combinators
 */
export function vector(size: number) {
  return <A>(fa: Arbitrary<A>): Arbitrary<ReadonlyArray<A>> =>
    pipe(
      fa,
      gen.vectorOf(size),
      gen.map(readonlyArray.sequence(rose.Applicative)),
    )
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
  return sequenceS(Apply)(struct)
}

/**
 * @category Combinators
 */
export function union<T extends readonly [unknown, ...(readonly unknown[])]>(
  ...arbitraries: { readonly [P in keyof T]: Arbitrary<T[P]> }
): Arbitrary<T[number]> {
  // chain together rose ? how will it know when to use another shrink?
  return pipe(
    gen.oneOf(
      arbitraries as unknown as nonEmptyArray.NonEmptyArray<Arbitrary<T>>,
    ),
  )
}

// DESTRUCTORS

/**
 * @category Destructors
 */
export function toGen<A>(fa: Arbitrary<A>) {
  return pipe(
    fa,
    gen.map((r) => r.value),
  )
}

//PRIMITIVES

/**
 * @category Primitives
 */
export const boolean: Arbitrary<boolean> = pipe(
  gen.boolean,
  gen.map(
    fromShrinker((boolean) => (boolean ? iterable.of(false) : iterable.zero())),
  ),
)

export function stringNonempty(options?: StringParams): Arbitrary<string> {
  return pipe(
    string(options),
    filter((string) => string.length > 0),
  )
}
