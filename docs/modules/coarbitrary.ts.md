---
title: coarbitrary.ts
nav_order: 2
parent: Modules
---

## coarbitrary overview

Basically the module creates a deterministic seed given by type `<A>`,
which can then be used to create

---

<h2 class="text-delta">Table of contents</h2>

- [Contravariant](#contravariant)
  - [contramap](#contramap)
- [Model](#model)
  - [Coarbitrary (interface)](#coarbitrary-interface)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [utils](#utils)
  - [Contravariant](#contravariant-1)
  - [boolean](#boolean)
  - [either](#either)
  - [option](#option)
  - [ordering](#ordering)
  - [reader](#reader)

---

# Contravariant

## contramap

**Signature**

```ts
export declare const contramap: <B, A>(f: (b: B) => A) => (fa: Coarbitrary<A>) => Coarbitrary<B>
```

# Model

## Coarbitrary (interface)

**Signature**

```ts
export interface Coarbitrary<A> {
  readonly coarbitrary: (a: A) => <R>(fa: gen.Gen<R>) => gen.Gen<R>
}
```

## URI

**Signature**

```ts
export declare const URI: 'Coarbitrary'
```

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

# utils

## Contravariant

**Signature**

```ts
export declare const Contravariant: Contravariant1<'Coarbitrary'>
```

## boolean

**Signature**

```ts
export declare const boolean: Coarbitrary<boolean>
```

## either

**Signature**

```ts
export declare function either<E, A>(fe: Coarbitrary<E>, fa: Coarbitrary<A>): Coarbitrary<E.Either<E, A>>
```

## option

**Signature**

```ts
export declare function option<A>(fa: Coarbitrary<A>): Coarbitrary<O.Option<A>>
```

## ordering

**Signature**

```ts
export declare const ordering: Coarbitrary<Ordering>
```

## reader

**Signature**

```ts
export declare function reader<R, A>(ge: Arbitrary<R>, fa: Coarbitrary<A>): Coarbitrary<Reader<R, A>>
```
