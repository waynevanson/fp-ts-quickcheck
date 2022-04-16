import { flow, pipe } from "fp-ts/lib/function"
import * as gen from "./gen"
import * as iterable from "./modules/iterable"

export const URI = "Shrinkable"
export type URI = typeof URI

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Shrink<A> extends gen.Gen<Iterable<A>> {}

declare module "fp-ts/HKT" {
  export interface URItoKind<A> {
    readonly [URI]: Shrink<A>
  }
}

export const of: <A>(a: A) => Shrink<A> = (a) => gen.of(iterable.of(a))

export const map: <A, B>(f: (a: A) => B) => (fa: Shrink<A>) => Shrink<B> = (
  f,
) => flow(gen.map(iterable.map(f)))

export const ap: <A>(
  fa: Shrink<A>,
) => <B>(fab: Shrink<(a: A) => B>) => Shrink<B> = (fa) => (fab) =>
  pipe(
    fab,
    gen.chain((iab) =>
      pipe(
        fa,
        gen.map((ia) => pipe(iab, iterable.ap(ia))),
      ),
    ),
  )

export const chain: <A, B>(
  f: (a: A) => Shrink<B>,
) => (fa: Shrink<A>) => Shrink<B> = (f) =>
  flow(
    gen.chain(iterable.traverse(gen.Applicative)(f)),
    gen.map(iterable.flatten),
  )

export const zero: <A>() => Shrink<A> = () => gen.of(iterable.zero())
