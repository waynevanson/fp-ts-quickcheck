---
title: arbitrary.ts
nav_order: 1
parent: Modules
---

## arbitrary overview

---

<h2 class="text-delta">Table of contents</h2>

- [Apply](#apply)
  - [ap](#ap)
- [Chain](#chain)
  - [chain](#chain)
- [Combinators](#combinators)
  - [array](#array)
  - [mutable](#mutable)
  - [readonly](#readonly)
  - [struct](#struct)
  - [tuple](#tuple)
- [Constructors](#constructors)
  - [fromGen](#fromgen)
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
  - [Functor](#functor-1)
  - [Pointed](#pointed-1)
- [utils](#utils)
  - [vector](#vector)

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

## mutable

**Signature**

```ts
export declare const mutable: <A>(fa: Arbitrary<Readonly<A>>) => Arbitrary<A>
```

## readonly

**Signature**

```ts
export declare const readonly: <A>(fa: Arbitrary<A>) => Arbitrary<Readonly<A>>
```

## struct

**Signature**

```ts
export declare function struct<R extends Record<string, unknown>>(
  struct: EnforceNonEmptyRecord<{ [P in keyof R]: Arbitrary<R[P]> }>
)
```

## tuple

**Signature**

```ts
export declare function tuple<R extends readonly [Arbitrary<unknown>, ...Arbitrary<unknown>[]]>(...arbitraries: R)
```

# Constructors

## fromGen

**Signature**

```ts
export declare function fromGen<A>(gen: gen.Gen<A>): Arbitrary<A>
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
  arbitrary: gen.Gen<A>
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

# utils

## vector

**Signature**

```ts
export declare function vector(size: number)
```
