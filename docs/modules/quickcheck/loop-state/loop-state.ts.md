---
title: quickcheck/loop-state/loop-state.ts
nav_order: 7
parent: Modules
---

## loop-state overview

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [LoopState (interface)](#loopstate-interface)
  - [Monoid](#monoid)
  - [incrementIndex](#incrementindex)
  - [incrementSuccess](#incrementsuccess)
  - [seedPut](#seedput)

---

# utils

## LoopState (interface)

**Signature**

```ts
export interface LoopState {
  seed: lcg.Seed
  index: number
  successes: number
  failures: ReadonlyArray<failure.LoopFailure>
}
```

## Monoid

**Signature**

```ts
export declare const Monoid: M.Monoid<LoopState>
```

## incrementIndex

**Signature**

```ts
export declare const incrementIndex: (s: LoopState) => LoopState
```

## incrementSuccess

**Signature**

```ts
export declare const incrementSuccess: (s: LoopState) => LoopState
```

## seedPut

**Signature**

```ts
export declare function seedPut(seed: lcg.Seed)
```
