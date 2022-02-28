---
title: utils.ts
nav_order: 4
parent: Modules
---

## utils overview

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [EnforceNonEmptyRecord (type alias)](#enforcenonemptyrecord-type-alias)
  - [tailRecM](#tailrecm)

---

# utils

## EnforceNonEmptyRecord (type alias)

**Signature**

```ts
export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R
```

## tailRecM

**Signature**

```ts
export declare function tailRecM<M extends URIS2>(
  M: Monad2<M>
): <E, A, B>(f: (a: A) => Kind2<M, E, E.Either<A, B>>) => (fa: Kind2<M, E, A>) => Kind2<M, E, B>
export declare function tailRecM<M extends URIS>(
  M: Monad1<M>
): <A, B>(f: (a: A) => Kind<M, E.Either<A, B>>) => (fa: Kind<M, A>) => Kind<M, B>
export declare function tailRecM<M>(
  M: Monad<M>
): <A, B>(f: (a: A) => HKT<M, E.Either<A, B>>) => (fa: HKT<M, A>) => HKT<M, B>
```
