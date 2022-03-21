---
title: arbitrary.ts
nav_order: 1
parent: Modules
---

## arbitrary overview

The `Arbitrary` typeclass represents a value that can be generated and shrunk.

Please note that shrinking has not been implemented yet.

---

<h2 class="text-delta">Table of contents</h2>

- [Apply](#apply)
  - [ap](#ap)
- [Chain](#chain)
  - [chain](#chain)
- [Combinators](#combinators)
  - [array](#array)
  - [filter](#filter)
  - [mutable](#mutable)
  - [readonly](#readonly)
  - [struct](#struct)
  - [tuple](#tuple)
  - [union](#union)
  - [vector](#vector)
- [Constructors](#constructors)
  - [fromGen](#fromgen)
  - [lazy](#lazy)
- [Functor](#functor)
  - [map](#map)
- [Model](#model)
  - [Arbitrary (interface)](#arbitrary-interface)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [Pointed](#pointed)
  - [of](#of)
- [Primitives](#primitives)
  - [boolean](#boolean)
  - [character](#character)
  - [int](#int)
  - [number](#number)
  - [string](#string)
- [Typeclasses](#typeclasses)
  - [Applicative](#applicative)
  - [Apply](#apply-1)
  - [Chain](#chain-1)
  - [Functor](#functor-1)
  - [Pointed](#pointed-1)

---

# Apply

## ap

**Signature**

```ts
export declare const ap: <A>(fa: Arbitrary<A>) => <B>(fab: Arbitrary<(a: A) => B>) => Arbitrary<B>
```

# Chain

## chain

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => Arbitrary<B>) => (fa: Arbitrary<A>) => Arbitrary<B>
```

# Combinators

## array

**Signature**

```ts
export declare function array<A>(arbitrary: Arbitrary<A>): Arbitrary<ReadonlyArray<A>>
```

## filter

Arbitrary cannot have a Compactable typeclass instance, as the state needs
to be supplied and called before being able to seperate the output
conditionally.

**Signature**

```ts
export declare function filter<A, B extends A>(refinement: Refinement<A, B>): (fa: Arbitrary<A>) => Arbitrary<B>
export declare function filter<A>(predicate: Predicate<A>): (fa: Arbitrary<A>) => Arbitrary<A>
```

## mutable

**Signature**

```ts
export declare const mutable: <A>(fa: Arbitrary<Readonly<A>>) => Arbitrary<A>
```

## readonly

Adds the `Readonly` type constraint from the value within an `Arbitrary` instance.

**Signature**

```ts
export declare const readonly: <A>(fa: Arbitrary<A>) => Arbitrary<Readonly<A>>
```

## struct

**Signature**

```ts
export declare function struct<R extends Record<string, unknown>>(
  struct: EnforceNonEmptyRecord<{ readonly [P in keyof R]: Arbitrary<R[P]> }>
)
```

## tuple

**Signature**

```ts
export declare function tuple<R extends readonly [Arbitrary<unknown>, ...(readonly Arbitrary<unknown>[])]>(
  ...arbitraries: R
)
```

## union

**Signature**

```ts
export declare function union<T extends readonly [unknown, ...(readonly unknown[])]>(
  ...arbitraries: { readonly [P in keyof T]: Arbitrary<T[P]> }
): Arbitrary<T[number]>
```

## vector

Generates an array with a fixed size, then each has the random contents.s

**Signature**

```ts
export declare function vector(size: number)
```

# Constructors

## fromGen

**Signature**

```ts
export declare function fromGen<A>(gen: gen.Gen<A>): Arbitrary<A>
```

## lazy

**Signature**

```ts
export declare function lazy<A>(lazy: Lazy<Arbitrary<A>>): Arbitrary<A>
```

# Functor

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: Arbitrary<A>) => Arbitrary<B>
```

# Model

## Arbitrary (interface)

**Signature**

```ts
export interface Arbitrary<A> {
  readonly arbitrary: gen.Gen<A>
}
```

## URI

**Signature**

```ts
export declare const URI: 'Arbitrary'
```

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

# Pointed

## of

**Signature**

```ts
export declare const of: <A>(a: A) => Arbitrary<A>
```

# Primitives

## boolean

**Signature**

```ts
export declare const boolean: Arbitrary<boolean>
```

## character

**Signature**

```ts
export declare const character: Arbitrary<string>
```

## int

**Signature**

```ts
export declare function int(options: Partial<Record<'min' | 'max', number>>): Arbitrary<number>
```

## number

**Signature**

```ts
export declare const number: Arbitrary<number>
```

## string

**Signature**

```ts
export declare const string: Arbitrary<string>
```

# Typeclasses

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative1<'Arbitrary'>
```

## Apply

**Signature**

```ts
export declare const Apply: Apply1<'Arbitrary'>
```

## Chain

**Signature**

```ts
export declare const Chain: Chain1<'Arbitrary'>
```

## Functor

**Signature**

```ts
export declare const Functor: Functor1<'Arbitrary'>
```

## Pointed

**Signature**

```ts
export declare const Pointed: Pointed1<'Arbitrary'>
```
