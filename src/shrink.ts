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
      iterable.chain((keys) =>
        pipe(
          keys,
          readonlyArray.foldMap(getAssignMonoid<Partial<T>>())(
            (property) => ({ [property]: fa[property] } as never),
          ),
          pipe(
            shrinks,
            readonlyRecord.fromRecord,
            readonlyRecord.filterWithIndex((i) => keys.includes(i)),
            (shinks) => struct<Partial<T>>(shinks as never),
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

export const char: Shrink<string> = pipe(
  integer,
  imap(
    (integer) => String.fromCharCode(integer),
    (char) => char.charCodeAt(0),
  ),
  reader.chain(
    (strings) => (string) =>
      string === ""
        ? iterable.zero<string>()
        : pipe(strings, iterable.prepend("")),
  ),
)

export const string: Shrink<string> = pipe(
  char,
  array,
  imap(
    (strings) => strings.join(""),
    (string) => string.split(""),
  ),
)
