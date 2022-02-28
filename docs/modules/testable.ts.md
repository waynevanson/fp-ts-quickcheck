---
title: testable.ts
nav_order: 3
parent: Modules
---

## testable overview

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Promisable (type alias)](#promisable-type-alias)
  - [Result (type alias)](#result-type-alias)
  - [Testable (interface)](#testable-interface)
  - [Testable1 (interface)](#testable1-interface)
  - [Thunk (type alias)](#thunk-type-alias)
  - [Thunkable (type alias)](#thunkable-type-alias)
  - [assertion](#assertion)
  - [assertionAsync](#assertionasync)
  - [assertionSync](#assertionsync)
  - [boolean](#boolean)

---

# utils

## Promisable (type alias)

**Signature**

```ts
export type Promisable<A> = A | Promise<A>
```

## Result (type alias)

**Signature**

```ts
export type Result = O.Option<unknown>
```

## Testable (interface)

**Signature**

```ts
export interface Testable<F, A> {
  readonly test: <I>(value: I) => (property: (value: I) => A) => HKT<F, Result>
}
```

## Testable1 (interface)

**Signature**

```ts
export interface Testable1<F extends URIS, A> {
  readonly test: <I>(value: I) => (property: (value: I) => A) => Kind<F, Result>
}
```

## Thunk (type alias)

**Signature**

```ts
export type Thunk<A> = () => A
```

## Thunkable (type alias)

**Signature**

```ts
export type Thunkable<A> = A | Thunk<A>
```

## assertion

**Signature**

```ts
export declare const assertion: Testable1<'Task', Thunkable<Promisable<boolean | void>>>
```

## assertionAsync

**Signature**

```ts
export declare const assertionAsync: Testable1<'Task', Promise<void>>
```

## assertionSync

**Signature**

```ts
export declare const assertionSync: Testable1<'IO', void>
```

## boolean

**Signature**

```ts
export declare const boolean: Testable1<'Identity', boolean>
```
