---
title: utils.ts
nav_order: 8
parent: Modules
---

## utils overview

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [EnforceNonEmptyRecord (type alias)](#enforcenonemptyrecord-type-alias)

---

# utils

## EnforceNonEmptyRecord (type alias)

**Signature**

```ts
export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R
```
