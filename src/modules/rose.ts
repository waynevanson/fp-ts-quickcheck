/**
 * `Tree` but with iterables, for runtime performance and infinite list capabilities.
 */
import { option, readonlyArray } from "fp-ts"
import { identity, pipe } from "fp-ts/lib/function"
import { Pointed1 } from "fp-ts/lib/Pointed"
import { iterable } from "."
import { state } from "./fp-ts"
import * as optional from "monocle-ts/Optional"
import { FunctorWithIndex1 } from "fp-ts/lib/FunctorWithIndex"
import { Chain1 } from "fp-ts/lib/Chain"
import { Apply1 } from "fp-ts/lib/Apply"
import { Functor1 } from "fp-ts/lib/Functor"
import { PipeableTraverse1, Traversable1 } from "fp-ts/lib/Traversable"
import { Foldable1 } from "fp-ts/lib/Foldable"
import { pipeable } from "fp-ts/lib/pipeable"
import {
  Applicative1,
  Applicative as ApplicativeHKT,
} from "fp-ts/lib/Applicative"
import { Monoid } from "fp-ts/lib/Monoid"
import { HKT } from "fp-ts/lib/HKT"

export const URI = "Rose"
export type URI = typeof URI

export type Branches<A> = Iterable<Rose<A>>

export interface Rose<A> {
  readonly value: A
  readonly branches: Branches<A>
}

export type Index = Iterable<number>

declare module "fp-ts/HKT" {
  export interface URItoKind<A> {
    readonly [URI]: Rose<A>
  }
}

export const of: <A>(a: A) => Rose<A> = (a) => ({
  value: a,
  branches: iterable.zero(),
})

export const make: <A>(value: A, treetables?: Branches<A>) => Rose<A> = (
  value,
  treetables = iterable.zero(),
) => ({
  value,
  branches: treetables,
})

export const Pointed: Pointed1<URI> = { URI, of }

const incrementLastIndex = pipe(
  optional.id<Index>(),
  // todo - use iterable instead of array
  optional.imap(iterable.toReadonlyArray, identity),
  optional.compose(
    optional.optional(
      readonlyArray.findLast(() => true),
      (a) => (s) =>
        pipe(
          s,
          readonlyArray.findLastIndex(() => true),
          option.chain((i) => pipe(s, readonlyArray.updateAt(i, a))),
          option.getOrElse(() => s),
        ),
    ),
  ),
  optional.modify((i: number) => i + 1),
)

function mapWithIndexState<A, B>(
  f: (i: Index, a: A) => B,
): (fa: Rose<A>) => state.State<Index, Rose<B>> {
  return (fa) =>
    pipe(
      state.of<Index, unknown>({}),
      state.bind("value", () =>
        pipe(
          state.modify(iterable.alt(() => iterable.of(0))),
          state.apSecond(state.get<Index>()),
          state.map((index) => f(index, fa.value)),
        ),
      ),
      state.bind("branches", () =>
        pipe(
          fa.branches,
          iterable.traverse(state.Applicative)((fa) =>
            pipe(
              state.modify<Index>(incrementLastIndex),
              state.apSecond(mapWithIndexState(f)(fa)),
            ),
          ),
        ),
      ),
    )
}

export const mapWithIndex: <A, B>(
  f: (i: Index, a: A) => B,
) => (fa: Rose<A>) => Rose<B> = (f) => (fa) =>
  pipe(mapWithIndexState(f)(fa), state.evaluate(iterable.zero()))

export const map: <A, B>(f: (a: A) => B) => (fa: Rose<A>) => Rose<B> = (f) =>
  mapWithIndex((_, a) => f(a))

export const Functor: Functor1<URI> = {
  URI,
  map: (fa, f) => map(f)(fa),
}

export const FunctorWithIndex: FunctorWithIndex1<URI, Index> = {
  ...Functor,
  mapWithIndex: (fa, f) => mapWithIndex(f)(fa),
}

export const chain: <A, B>(f: (a: A) => Rose<B>) => (fab: Rose<A>) => Rose<B> =
  (f) => (fa) => {
    const { value, branches: treetables } = f(fa.value)
    return {
      value,
      branches: pipe(
        treetables,
        iterable.alt(() => pipe(fa.branches, iterable.map(chain(f)))),
      ),
    }
  }

export const ap: <A>(fa: Rose<A>) => <B>(fab: Rose<(a: A) => B>) => Rose<B> = (
  fa,
) => chain((f) => pipe(fa, map(f)))

export const Apply: Apply1<URI> = { ...Functor, ap: (fab, fa) => ap(fa)(fab) }

export const Applicative: Applicative1<URI> = { ...Apply, of }

export const Chain: Chain1<URI> = { ...Apply, chain: (fa, f) => chain(f)(fa) }

export const { flatten, chainFirst, apFirst, apSecond } = pipeable(Chain)

/* eslint-disable */
/**
 * @category Foldable
 * @since 2.0.0
 */
export const reduce =
  <A, B>(b: B, f: (b: B, a: A) => B) =>
  (fa: Rose<A>): B => {
    let r: B = f(b, fa.value)
    let i = 0
    for (const branch of fa.branches) {
      r = pipe(branch, reduce(r, f))
    }
    return r
  }
/* eslint-enable */

/**
 * @category Foldable
 * @since 2.0.0
 */
export const foldMap: <M>(
  M: Monoid<M>,
) => <A>(f: (a: A) => M) => (fa: Rose<A>) => M = (M) => (f) =>
  reduce(M.empty, (acc, a) => M.concat(acc, f(a)))

/* eslint-disable */
/**
 * @category Foldable
 * @since 2.0.0
 */
export const reduceRight =
  <A, B>(b: B, f: (a: A, b: B) => B) =>
  (fa: Rose<A>): B => {
    const faa = iterable.toReadonlyArray(fa.branches)
    let r: B = b
    const len = faa.length
    for (let i = len - 1; i >= 0; i--) {
      r = pipe(faa[i], reduceRight(r, f))
    }
    return f(fa.value, r)
  }
/* eslint-enable */

export const Foldable: Foldable1<URI> = {
  URI,
  foldMap: (M) => (fa, f) => foldMap(M)(f)(fa),
  reduce: (fa, b, f) => reduce(b, f)(fa),
  reduceRight: (fa, b, f) => reduceRight(b, f)(fa),
}

/**
 * @since 2.6.3
 */
export const traverse: PipeableTraverse1<URI> = <F>(
  F: ApplicativeHKT<F>,
): (<A, B>(f: (a: A) => HKT<F, B>) => (ta: Rose<A>) => HKT<F, Rose<B>>) => {
  const traverseF = iterable.traverse(F)
  const out =
    <A, B>(f: (a: A) => HKT<F, B>) =>
    (ta: Rose<A>): HKT<F, Rose<B>> =>
      F.ap(
        F.map(f(ta.value), (value: B) => (branches: Branches<B>) => ({
          value,
          branches,
        })),
        pipe(ta.branches, traverseF(out(f))),
      )
  return out
}
/* istanbul ignore next */
const _traverse = <F>(
  F: ApplicativeHKT<F>,
): (<A, B>(ta: Rose<A>, f: (a: A) => HKT<F, B>) => HKT<F, Rose<B>>) => {
  const traverseF = traverse(F)
  return (ta, f) => pipe(ta, traverseF(f))
}

/**
 * @since 2.6.3
 */
export const sequence: Traversable1<URI>["sequence"] = <F>(
  F: ApplicativeHKT<F>,
): (<A>(ta: Rose<HKT<F, A>>) => HKT<F, Rose<A>>) => traverse(F)(identity)

export const Traversable: Traversable1<URI> = {
  ...Foldable,
  ...Functor,
  traverse: _traverse,
  sequence,
}

export function unfoldBranch<A, B>(
  f: (b: B) => { readonly value: A; readonly branch: Iterable<B> },
): (bs: Iterable<B>) => Branches<A> {
  return iterable.map(unfoldRose(f))
}

export function unfoldRose<A, B>(
  f: (b: B) => { readonly value: A; readonly branch: Iterable<B> },
): (b: B) => Rose<A> {
  return (b) => {
    const { branch, value } = f(b)
    return { value, branches: unfoldBranch(f)(branch) }
  }
}
