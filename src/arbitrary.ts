/**
 * The `Arbitrary` typeclass represents a value that can be generated and shrunk.
 *
 * Please note that shrinking has not been implemented yet.
 */
import {
  either as E,
  nonEmptyArray as NEA,
  option as O,
  readonlyRecord as RC,
  identity as I,
} from "fp-ts"
import { Applicative1 } from "fp-ts/lib/Applicative"
import { Apply1, sequenceS, sequenceT } from "fp-ts/lib/Apply"
import { Chain1 } from "fp-ts/lib/Chain"
import { flow, identity, Lazy, pipe, unsafeCoerce } from "fp-ts/lib/function"
import { Functor1 } from "fp-ts/lib/Functor"
import { Pointed1 } from "fp-ts/lib/Pointed"
import { Predicate } from "fp-ts/lib/Predicate"
import { Refinement } from "fp-ts/lib/Refinement"
import { iterable } from "./modules"
import * as gen from "./gen"
import { state as S } from "./modules/fp-ts"
import * as shrinkable from "./shrink"
import { EnforceNonEmptyRecord, rightDichotomy } from "./utils"

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
  readonly generate: gen.Gen<A>
  // shrink is contextual to arbitrary.
  // using it
  // find the first (and smallest) shrink value
  // use that value on the shrinker recursively until it all passes or and empty iterable
  readonly shrink: shrinkable.Shrink<A>
}

declare module "fp-ts/HKT" {
  export interface URItoKind<A> {
    readonly [URI]: Arbitrary<A>
  }
}

export function from<A>(
  generate: gen.Gen<A>,
  shrink: shrinkable.Shrink<A>,
): Arbitrary<A> {
  return { generate, shrink }
}

export function fromK<T extends readonly unknown[], A>(
  generate: (...args: T) => gen.Gen<A>,
  shrink: (...args: T) => shrinkable.Shrink<A>,
): (...args: T) => Arbitrary<A> {
  return (...args) => ({ generate: generate(...args), shrink: shrink(...args) })
}

const shrink_ = shrinkable.zero
// PIPEABLES

/**
 * @category Pointed
 */
export const of: <A>(a: A) => Arbitrary<A> = (a) => ({
  generate: S.of(a),
  shrink: shrink_(),
})

/**
 * @category Functor
 */
export const map: <A, B>(
  f: (a: A) => B,
) => (fa: Arbitrary<A>) => Arbitrary<B> = (f) => (fa) => ({
  generate: pipe(fa.generate, gen.map(f)),
  shrink: pipe(fa.shrink, shrinkable.map(f)),
})

/**
 * @category Apply
 */
export const ap: <A>(
  fa: Arbitrary<A>,
) => <B>(fab: Arbitrary<(a: A) => B>) => Arbitrary<B> = (fa) => (fab) => ({
  generate: pipe(fab.generate, S.ap(fa.generate)),
  shrink: pipe(fab.shrink, shrinkable.ap(fa.shrink)),
})

/**
 * @category Chain
 */
export const chain: <A, B>(
  f: (a: A) => Arbitrary<B>,
) => (fa: Arbitrary<A>) => Arbitrary<B> = (f) => (fa) => ({
  generate: pipe(fa.generate, S.chain(flow(f, (b) => b.generate))),
  shrink: pipe(fa.shrink, shrinkable.chain(flow(f, (b) => b.shrink))),
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
export function fromGen<A>(
  gen: gen.Gen<A>,
  shrink: shrinkable.Shrink<A> = shrinkable.zero(),
): Arbitrary<A> {
  return { generate: gen, shrink }
}

/**
 * @category Constructors
 */
export function int(
  options?: Partial<Record<"min" | "max", number>>,
): Arbitrary<number> {
  return pipe(
    I.Do,
    I.bind("generate", () => gen.int(options)),
    I.bind("shrink", ({ generate }) =>
      pipe(
        generate,
        S.map((int) =>
          int === 0
            ? iterable.zero()
            : pipe(
                int < 0 ? iterable.of(Math.abs(int)) : iterable.zero<number>(),
                iterable.alt(() => iterable.of(0)),
                iterable.alt(() => rightDichotomy(int)),
              ),
        ),
      ),
    ),
  )
}

/**
 * @category Constructors
 */
export function float(
  options?: Partial<Record<"min" | "max", number>>,
): Arbitrary<number> {
  return { generate: gen.float(options), shrink: shrink_() }
}

export type StringParams = Partial<Record<"from" | "to", string>>

/**
 * @summary
 * Generate a single character string.
 *
 * @category Constructors
 */
export const character: (options?: StringParams) => Arbitrary<string> = flow(
  gen.char,
  fromGen,
)

/**
 * @category Constructors
 */
export const string: (options?: StringParams) => Arbitrary<string> = flow(
  gen.string,
  fromGen,
)

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
 * Creates an arbitrary as a struct that optionally defines properties.
 *
 * @category Combinators
 */
export function partial<T extends Record<string, unknown>>(arbitraries: {
  readonly [P in keyof T]: Arbitrary<T[P]>
}): Arbitrary<Partial<T>> {
  return {
    generate: pipe(
      S.get<gen.GenState>(),
      S.map((s) =>
        pipe(
          arbitraries,
          RC.fromRecord,
          RC.map(flow(nullable, toGen, S.evaluate(s))),
          RC.filterMap(O.fromNullable),
          (a) => unsafeCoerce(a),
        ),
      ),
    ),
    //
    shrink: pipe(
      S.get<gen.GenState>(),
      S.map((s) =>
        pipe(
          arbitraries,
          RC.fromRecord,
          RC.map(flow(nullable, toShrink, S.evaluate(s))),
          RC.filterMap(
            O.fromPredicate(
              iterable.some((a): a is NonNullable<typeof a> => a != null),
            ),
          ),
          (a) => unsafeCoerce(a),
        ),
      ),
    ),
  }
}

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
  return {
    generate: (s) => lazy().generate(s),
    shrink: (s) => lazy().shrink(s),
  }
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
    generate: pipe(
      fa.generate,
      S.chain(
        S.chainRec(
          flow(
            E.fromPredicate(predicate, identity),
            E.map((a): gen.Gen<E.Either<A, A>> => gen.of(E.right(a))),
            E.getOrElse(() =>
              pipe(
                fa.generate,
                S.apFirst(gen.nextSeed),
                gen.map((e) => E.left(e)),
              ),
            ),
          ),
        ),
      ),
    ),
    shrink: shrink_(),
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
    generate: gen.arrayOf(arbitrary.generate),
    shrink: shrink_(),
  }
}

/**
 * Generates an array with a fixed size, then each has the random contents.
 * @category Combinators
 */
export function vector(size: number) {
  return <A>(fa: Arbitrary<A>): Arbitrary<ReadonlyArray<A>> => ({
    generate: gen.vectorOf(size)(fa.generate),
    shrink: shrink_(),
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
  return pipe(
    I.Do,
    I.bind("generate", () =>
      gen.oneOf(
        pipe(
          arbitraries as unknown as NEA.NonEmptyArray<Arbitrary<T[number]>>,
          NEA.map((arbitrary) => arbitrary.generate),
        ),
      ),
    ),
    I.bind("shrink", ({ generate }) =>
      pipe(
        generate,
        // get smallest value
        gen.map(() => iterable.zero()),
      ),
    ),
  )
}

// DESTRUCTORS

/**
 * @category Destructors
 */
export function toGen<A>(fa: Arbitrary<A>) {
  return fa.generate
}

/**
 * @category Destructors
 */
export function toShrink<A>(fa: Arbitrary<A>) {
  return fa.shrink
}

//PRIMITIVES

/**
 * @category Primitives
 */
export const boolean: Arbitrary<boolean> = pipe(
  I.Do,
  I.bind("generate", () => gen.boolean),
  // true, false
  I.bind("shrink", ({ generate }) =>
    pipe(
      generate,
      gen.map((boolean) => (boolean ? iterable.of(false) : iterable.zero())),
    ),
  ),
)

export function stringNonempty(options?: StringParams): Arbitrary<string> {
  return pipe(
    string(options),
    filter((string) => string.length > 0),
  )
}
