import { option, reader, readonlyArray, readonlyRecord } from "fp-ts"
import { flow, pipe, unsafeCoerce } from "fp-ts/lib/function"
import { iterable } from "./modules"
import { combinations, getAssignMonoid, rightDichotomy } from "./utils"

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

export const recursive: <A>(f: (a: A) => option.Option<A>) => Shrink<A> =
  (f) => (a) =>
    pipe(
      option.some(a),
      iterable.iterate(option.chain(f)),
      iterable.skip(1),
      iterable.takeWhileMapWithIndex((i, a) => a),
    )

//array size is the length of the array
// start empty
// for each, apply get the max and
export const array =
  <A>(shrink: Shrink<A>): Shrink<ReadonlyArray<A>> =>
  (fa) =>
    pipe(
      readonlyArray.makeBy(fa.length, (i) => fa.slice(0, i + 1)),
      iterable.fromIterable,
      iterable.chain(
        readonlyArray.traverseWithIndex(iterable.Applicative)((i, a) =>
          pipe(
            shrink(a),
            iterable.alt(() =>
              i === fa.length - 1 ? iterable.zero() : iterable.of(a),
            ),
          ),
        ),
      ),
      (a) =>
        pipe(
          fa.length === 0 ? iterable.zero<ReadonlyArray<A>>() : iterable.of([]),
          iterable.alt(() => a),
        ),
    )
// for each item in array,
//

export const boolean: Shrink<boolean> = (boolean) =>
  boolean ? iterable.of(false) : iterable.zero()

export const struct = <T extends Record<string, unknown>>(shrinks: {
  readonly [P in keyof T]: Shrink<T[P]>
}): Shrink<T> =>
  flow(
    readonlyRecord.fromRecord,
    readonlyRecord.filterMapWithIndex((k, a) =>
      pipe(
        shrinks,
        readonlyRecord.fromRecord,
        readonlyRecord.lookup(k),
        option.flap(a as never),
      ),
    ),
    readonlyRecord.sequence(iterable.Applicative),
    (a) => unsafeCoerce(a),
  )

export const partial =
  <T extends Record<string, unknown>>(shrinks: {
    readonly [P in keyof T]: Shrink<T[P]>
  }): Shrink<Partial<T>> =>
  (fa) =>
    pipe(
      fa,
      (a) => a as readonlyRecord.ReadonlyRecord<string, T[string] | undefined>,
      readonlyRecord.filterMap(
        option.fromPredicate(
          (a): a is Exclude<typeof a, undefined> => typeof a !== "undefined",
        ),
      ),
      readonlyRecord.keys,
      combinations,
      iterable.chain(
        flow(
          readonlyArray.foldMap(getAssignMonoid<Record<string, unknown>>())(
            (property) => ({ [property]: fa[property] }),
          ),
          (value) =>
            pipe(
              shrinks,
              readonlyRecord.fromRecord,
              readonlyRecord.filterWithIndex((i) =>
                readonlyRecord.keys(value).includes(i),
              ),
              (shrink) => struct(shrink)(value as never),
            ),
        ),
      ),
      (a) => unsafeCoerce(a),
      iterable.prepend<Partial<T>>({}),
    )

export const integer: Shrink<number> = (int) =>
  int === 0
    ? iterable.zero<number>()
    : pipe(
        int < 0 ? iterable.of(Math.abs(int)) : iterable.zero<number>(),
        iterable.alt(() => iterable.of(0)),
        iterable.alt(() => rightDichotomy(int)),
      )
