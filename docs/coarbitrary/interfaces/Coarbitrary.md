---
layout: default
title: Coarbitrary
parent: "coarbitrary"
nav_order: 2

---

[fp-ts-quickcheck](../../README.md) / [Exports](../../modules.md) / [coarbitrary](../index.md) / Coarbitrary

# Interface: Coarbitrary<A\>

[coarbitrary](../index.md).Coarbitrary

## Type parameters

| Name |
| :------ |
| `A` |

## Table of contents

### Methods

- [coarbitrary](Coarbitrary.md#coarbitrary)

## Methods

### coarbitrary

▸ `Readonly` **coarbitrary**(`a`): <R\>(`fa`: [`Gen`](../../gen/index.md#gen)<`R`\>) => [`Gen`](../../gen/index.md#gen)<`R`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `A` |

#### Returns

`fn`

▸ <`R`\>(`fa`): [`Gen`](../../gen/index.md#gen)<`R`\>

##### Type parameters

| Name |
| :------ |
| `R` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Gen`](../../gen/index.md#gen)<`R`\> |

##### Returns

[`Gen`](../../gen/index.md#gen)<`R`\>

#### Defined in

[src/coarbitrary.ts:27](https://github.com/waynevanson/fp-ts-test/blob/e9f384e/src/coarbitrary.ts#L27)
