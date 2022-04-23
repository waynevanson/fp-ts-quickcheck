import { option, reader, readonlyArray } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import { iterable } from "./modules"
import { rightDichotomy } from "./utils"

export const URI = "Shrinkable"
export type URI = typeof URI

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Shrink<A> extends reader.Reader<A, Iterable<A>> {}

declare module "fp-ts/HKT" {
  export interface URItoKind<A> {
    readonly [URI]: Shrink<A>
  }
}

// Contravariant
export const imap: <A, B>(
  f: (a: A) => B,
  g: (b: B) => A,
) => (fa: Shrink<A>) => Shrink<B> = (f, g) => reader.promap(g, iterable.map(f))

export const zero: <A>() => Shrink<A> = () => reader.of(iterable.zero())

export const recursiveWhile: <A>(f: (a: A) => option.Option<A>) => Shrink<A> =
  (f) => (a) =>
    pipe(
      option.some(a),
      iterable.iterate(option.chain(f)),
      iterable.skip(1),
      iterable.takeWhileMapWithIndex((i, a) => a),
    )

//array size is the length of the array
export const array: <A>(fa: Shrink<A>) => Shrink<ReadonlyArray<A>> = (shrink) =>
  recursiveWhile((fa) =>
    pipe(
      fa,
      readonlyArray.last,
      option.chain((last) =>
        pipe(
          last,
          shrink,
          iterable.head,
          option.map((shrunk) =>
            pipe(fa, readonlyArray.updateAt(fa.length - 1, shrunk)),
          ),
          option.getOrElse(() =>
            pipe(fa, readonlyArray.deleteAt(fa.length - 1)),
          ),
        ),
      ),
    ),
  )

export const boolean: Shrink<boolean> = (boolean) =>
  boolean ? iterable.of(false) : iterable.zero()

// export const partial: <T extends Record<string, unknown>>(fa: {
//   readonly [P in keyof T]: Shrink<T[P]>
// }) => Shrink<Partial<T>> = (fa) => {
//   const keys = Object.keys(fa) as ReadonlyArray<keyof T & string>
// }

export const integer: Shrink<number> = (int) =>
  int === 0
    ? iterable.zero<number>()
    : pipe(
        int < 0 ? iterable.of(Math.abs(int)) : iterable.zero<number>(),
        iterable.alt(() => iterable.of(0)),
        iterable.alt(() => rightDichotomy(int)),
      )
