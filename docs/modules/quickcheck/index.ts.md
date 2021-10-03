---
title: quickcheck/index.ts
nav_order: 5
parent: Modules
---

## index overview

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Loop (interface)](#loop-interface)
  - [LoopParameters (interface)](#loopparameters-interface)
  - [QuickCheckOptions (interface)](#quickcheckoptions-interface)
  - [QuickcheckParameters (interface)](#quickcheckparameters-interface)
  - [assert](#assert)
  - [assertErrors](#asserterrors)
  - [loop](#loop)
  - [quickcheck](#quickcheck)
  - [runProperty](#runproperty)

---

# utils

## Loop (interface)

**Signature**

```ts
export interface Loop<A> extends S.State<state.LoopState, A> {}
```

## LoopParameters (interface)

**Signature**

```ts
export interface LoopParameters<A> {
  property: Property<A>
  arbitrary: Arbitrary<A>
  // non-negative number
  size: number
}
```

## QuickCheckOptions (interface)

**Signature**

```ts
export interface QuickCheckOptions {
  initialSeed: number
  count: number
  size: number
}
```

## QuickcheckParameters (interface)

**Signature**

```ts
export interface QuickcheckParameters {}
```

## assert

**Signature**

```ts
export declare function assert<A>(property: Property<A>, options?: Partial<QuickCheckOptions>)
```

## assertErrors

**Signature**

```ts
export declare function assertErrors(fa: state.LoopState): IO.IO<void>
```

## loop

**Signature**

```ts
export declare const loop: <A>({ property, arbitrary }: LoopParameters<A>) => Loop<void>
```

## quickcheck

**Signature**

```ts
export declare function quickcheck<A>(property: Property<A>, options: QuickCheckOptions)
```

## runProperty

**Signature**

```ts
export declare function runProperty<A>({ arbitrary, property }: { arbitrary: Arbitrary<A>; property: Property<A> })
```
