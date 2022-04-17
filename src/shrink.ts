import { state } from "fp-ts"
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

export function fromIterable<A>(fa: Iterable<A>): Shrink<A> {
  return state.of(fa)
}

export function fromGen<A>(generator: gen.Gen<A>): Shrink<A> {
  return pipe(generator, gen.map(iterable.of))
}

export function fromGenK<T extends readonly unknown[], A>(
  f: (...args: T) => gen.Gen<A>,
): (...args: T) => Shrink<A> {
  return flow(f, fromGen)
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

export const alt: <A>(that: () => Shrink<A>) => (fa: Shrink<A>) => Shrink<A> =
  (that) => (fa) =>
    pipe(
      fa,
      gen.chain((ia1) =>
        pipe(
          that(),
          gen.map((ia2) =>
            pipe(
              ia1,
              iterable.alt(() => ia2),
            ),
          ),
        ),
      ),
    )

export const boolean = pipe(
  gen.boolean,
  fromGen,
  chain((boolean) => (boolean ? of(false) : zero<boolean>())),
)
