---
layout: default
title: "coarbitrary"
has_children: true
has_toc: false
nav_order: 1
---

[fp-ts-quickcheck](../README.md) / [Exports](../modules.md) / coarbitrary

# Namespace: coarbitrary

## Table of contents

### Model Interfaces

- [Coarbitrary](interfaces/Coarbitrary.md)

### Model Type aliases

- [URI](index.md#uri)

### Model Variables

- [URI](index.md#uri-1)

### Other Variables

- [Contravariant](index.md#contravariant)
- [boolean](index.md#boolean)
- [ordering](index.md#ordering)

### Contravariant Functions

- [contramap](index.md#contramap)

### Other Functions

- [either](index.md#either)
- [option](index.md#option)
- [reader](index.md#reader)

## Model Type aliases

### URI

Ƭ **URI**: typeof [`URI`](index.md#uri-1)

#### Defined in

[src/coarbitrary.ts:21](https://github.com/waynevanson/fp-ts-test/blob/e9f384e/src/coarbitrary.ts#L21)

## Model Variables

### URI

• `Const` **URI**: ``"Coarbitrary"``

#### Defined in

[src/coarbitrary.ts:16](https://github.com/waynevanson/fp-ts-test/blob/e9f384e/src/coarbitrary.ts#L16)

___

## Other Variables

### Contravariant

• `Const` **Contravariant**: `Contravariant1`<[`URI`](index.md#uri-1)\>

#### Defined in

[src/coarbitrary.ts:36](https://github.com/waynevanson/fp-ts-test/blob/e9f384e/src/coarbitrary.ts#L36)

___

### boolean

• `Const` **boolean**: [`Coarbitrary`](interfaces/Coarbitrary.md)<`boolean`\>

#### Defined in

[src/coarbitrary.ts:58](https://github.com/waynevanson/fp-ts-test/blob/e9f384e/src/coarbitrary.ts#L58)

___

### ordering

• `Const` **ordering**: [`Coarbitrary`](interfaces/Coarbitrary.md)<`Ordering`\>

#### Defined in

[src/coarbitrary.ts:51](https://github.com/waynevanson/fp-ts-test/blob/e9f384e/src/coarbitrary.ts#L51)

## Contravariant Functions

### contramap

▸ **contramap**<`B`, `A`\>(`f`): (`fa`: [`Coarbitrary`](interfaces/Coarbitrary.md)<`A`\>) => [`Coarbitrary`](interfaces/Coarbitrary.md)<`B`\>

#### Type parameters

| Name |
| :------ |
| `B` |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | (`b`: `B`) => `A` |

#### Returns

`fn`

▸ (`fa`): [`Coarbitrary`](interfaces/Coarbitrary.md)<`B`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Coarbitrary`](interfaces/Coarbitrary.md)<`A`\> |

##### Returns

[`Coarbitrary`](interfaces/Coarbitrary.md)<`B`\>

#### Defined in

[src/coarbitrary.ts:46](https://github.com/waynevanson/fp-ts-test/blob/e9f384e/src/coarbitrary.ts#L46)

___

## Other Functions

### either

▸ **either**<`E`, `A`\>(`fe`, `fa`): [`Coarbitrary`](interfaces/Coarbitrary.md)<`E.Either`<`E`, `A`\>\>

#### Type parameters

| Name |
| :------ |
| `E` |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fe` | [`Coarbitrary`](interfaces/Coarbitrary.md)<`E`\> |
| `fa` | [`Coarbitrary`](interfaces/Coarbitrary.md)<`A`\> |

#### Returns

[`Coarbitrary`](interfaces/Coarbitrary.md)<`E.Either`<`E`, `A`\>\>

#### Defined in

[src/coarbitrary.ts:75](https://github.com/waynevanson/fp-ts-test/blob/e9f384e/src/coarbitrary.ts#L75)

___

### option

▸ **option**<`A`\>(`fa`): [`Coarbitrary`](interfaces/Coarbitrary.md)<`O.Option`<`A`\>\>

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Coarbitrary`](interfaces/Coarbitrary.md)<`A`\> |

#### Returns

[`Coarbitrary`](interfaces/Coarbitrary.md)<`O.Option`<`A`\>\>

#### Defined in

[src/coarbitrary.ts:62](https://github.com/waynevanson/fp-ts-test/blob/e9f384e/src/coarbitrary.ts#L62)

___

### reader

▸ **reader**<`R`, `A`\>(`ge`, `fa`): [`Coarbitrary`](interfaces/Coarbitrary.md)<`Reader`<`R`, `A`\>\>

#### Type parameters

| Name |
| :------ |
| `R` |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ge` | [`Arbitrary`](../arbitrary/interfaces/Arbitrary.md)<`R`\> |
| `fa` | [`Coarbitrary`](interfaces/Coarbitrary.md)<`A`\> |

#### Returns

[`Coarbitrary`](interfaces/Coarbitrary.md)<`Reader`<`R`, `A`\>\>

#### Defined in

[src/coarbitrary.ts:95](https://github.com/waynevanson/fp-ts-test/blob/e9f384e/src/coarbitrary.ts#L95)
