import { reader, readonlyArray } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import { iterable } from "./modules"

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

export const array: <A>(fa: Shrink<A>) => Shrink<ReadonlyArray<A>> =
  (fa) => (fax) =>
    pipe(
      fax,
      readonlyArray.traverse(iterable.Applicative)((a) => fa(a)),
      iterable.chain((a) =>
        readonlyArray.isEmpty(a) ? iterable.zero() : iterable.of(a),
      ),
    )

export const boolean: Shrink<boolean> = (boolean) =>
  boolean ? iterable.of(false) : iterable.zero()

// export const partial: <T extends Record<string, unknown>>(fa: {
//   readonly [P in keyof T]: Shrink<T[P]>
// }) => Shrink<Partial<T>> = (fa) => {
//   const keys = Object.keys(fa) as ReadonlyArray<keyof T & string>
// }
