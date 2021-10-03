---
title: quickcheck/loop-state/failure.ts
nav_order: 5
parent: Modules
---

## failure overview

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [LoopFailure (interface)](#loopfailure-interface)
  - [Monoid](#monoid)
  - [append](#append)
  - [make](#make)

---

# utils

## LoopFailure (interface)

**Signature**

```ts
export interface LoopFailure {
  seed: lcg.Seed
  index: number
  data: unknown
}
```

## Monoid

**Signature**

```ts
export declare const Monoid: M.Monoid<LoopFailure>
```

## append

**Signature**

```ts
export declare function append(failure: LoopFailure)
```

## make

**Signature**

```ts
export declare function make(data: unknown)
```
