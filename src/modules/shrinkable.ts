import { flow, pipe } from "fp-ts/lib/function"
import * as generator from "./generator"
import * as iterable from "./iterable"

export const URI = "Shrinkable"
export type URI = typeof URI

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Shrinkable<A> extends generator.Gen<Iterable<A>> {}

declare module "fp-ts/HKT" {
  export interface URItoKind<A> {
    readonly [URI]: Shrinkable<A>
  }
}

export const of: <A>(a: A) => Shrinkable<A> = (a) =>
  generator.of(iterable.of(a))

export const map: <A, B>(
  f: (a: A) => B,
) => (fa: Shrinkable<A>) => Shrinkable<B> = (f) =>
  flow(generator.map(iterable.map(f)))

export const ap: <A>(
  fa: Shrinkable<A>,
) => <B>(fab: Shrinkable<(a: A) => B>) => Shrinkable<B> = (fa) => (fab) =>
  pipe(
    fab,
    generator.chain((iab) =>
      pipe(
        fa,
        generator.map((ia) => pipe(iab, iterable.ap(ia))),
      ),
    ),
  )

export const chain: <A, B>(
  f: (a: A) => Shrinkable<B>,
) => (fa: Shrinkable<A>) => Shrinkable<B> = (f) =>
  flow(
    generator.chain(iterable.traverse(generator.Applicative)(f)),
    generator.map(iterable.flatten),
  )

export const zero: <A>() => Shrinkable<A> = () => generator.of(iterable.zero())
