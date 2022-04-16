---
layout: default
title: "arbitrary"
has_children: true
has_toc: false
nav_order: 1
---

[fp-ts-quickcheck](../README.md) / [Exports](../modules.md) / arbitrary

# Namespace: arbitrary

## Table of contents

### Model Interfaces

- [Arbitrary](interfaces/Arbitrary.md)

### Model Type aliases

- [URI](index.md#uri)

### Other Type aliases

- [StringParams](index.md#stringparams)

### Model Variables

- [URI](index.md#uri-1)

### Primitives Variables

- [boolean](index.md#boolean)

### Typeclasses Variables

- [Applicative](index.md#applicative)
- [Apply](index.md#apply)
- [Chain](index.md#chain)
- [Functor](index.md#functor)
- [Pointed](index.md#pointed)

### Apply Functions

- [ap](index.md#ap)

### Chain Functions

- [chain](index.md#chain-1)

### Combinators Functions

- [array](index.md#array)
- [filter](index.md#filter)
- [lazy](index.md#lazy)
- [mutable](index.md#mutable)
- [nullable](index.md#nullable)
- [partial](index.md#partial)
- [readonly](index.md#readonly)
- [struct](index.md#struct)
- [tuple](index.md#tuple)
- [union](index.md#union)
- [vector](index.md#vector)

### Constructors Functions

- [character](index.md#character)
- [float](index.md#float)
- [fromGen](index.md#fromgen)
- [int](index.md#int)
- [string](index.md#string)

### Destructors Functions

- [toGen](index.md#togen)
- [toShrink](index.md#toshrink)

### Functor Functions

- [map](index.md#map)

### Other Functions

- [stringNonempty](index.md#stringnonempty)

### Pointed Functions

- [of](index.md#of)

## Model Type aliases

### URI

Ƭ **URI**: typeof [`URI`](index.md#uri-1)

#### Defined in

[src/arbitrary.ts:35](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L35)

___

## Other Type aliases

### StringParams

Ƭ **StringParams**: `Partial`<`Record`<``"from"`` \| ``"to"``, `string`\>\>

#### Defined in

[src/arbitrary.ts:176](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L176)

## Model Variables

### URI

• `Const` **URI**: ``"Arbitrary"``

#### Defined in

[src/arbitrary.ts:30](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L30)

___

## Primitives Variables

### boolean

• `Const` **boolean**: [`Arbitrary`](interfaces/Arbitrary.md)<`boolean`\>

#### Defined in

[src/arbitrary.ts:408](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L408)

___

## Typeclasses Variables

### Applicative

• `Const` **Applicative**: `Applicative1`<[`URI`](index.md#uri-1)\>

#### Defined in

[src/arbitrary.ts:116](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L116)

___

### Apply

• `Const` **Apply**: `Apply1`<[`URI`](index.md#uri-1)\>

#### Defined in

[src/arbitrary.ts:111](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L111)

___

### Chain

• `Const` **Chain**: `Chain1`<[`URI`](index.md#uri-1)\>

#### Defined in

[src/arbitrary.ts:121](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L121)

___

### Functor

• `Const` **Functor**: `Functor1`<[`URI`](index.md#uri-1)\>

#### Defined in

[src/arbitrary.ts:106](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L106)

___

### Pointed

• `Const` **Pointed**: `Pointed1`<[`URI`](index.md#uri-1)\>

#### Defined in

[src/arbitrary.ts:101](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L101)

## Apply Functions

### ap

▸ **ap**<`A`\>(`fa`): <B\>(`fab`: [`Arbitrary`](interfaces/Arbitrary.md)<(`a`: `A`) => `B`\>) => [`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Arbitrary`](interfaces/Arbitrary.md)<`A`\> |

#### Returns

`fn`

▸ <`B`\>(`fab`): [`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

##### Type parameters

| Name |
| :------ |
| `B` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `fab` | [`Arbitrary`](interfaces/Arbitrary.md)<(`a`: `A`) => `B`\> |

##### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

#### Defined in

[src/arbitrary.ts:79](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L79)

___

## Chain Functions

### chain

▸ **chain**<`A`, `B`\>(`f`): (`fa`: [`Arbitrary`](interfaces/Arbitrary.md)<`A`\>) => [`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

#### Type parameters

| Name |
| :------ |
| `A` |
| `B` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | (`a`: `A`) => [`Arbitrary`](interfaces/Arbitrary.md)<`B`\> |

#### Returns

`fn`

▸ (`fa`): [`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Arbitrary`](interfaces/Arbitrary.md)<`A`\> |

##### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

#### Defined in

[src/arbitrary.ts:89](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L89)

___

## Combinators Functions

### array

▸ **array**<`A`\>(`arbitrary`): [`Arbitrary`](interfaces/Arbitrary.md)<`ReadonlyArray`<`A`\>\>

**`summary`**
Generates an array with a random size, then each has the random contents.

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arbitrary` | [`Arbitrary`](interfaces/Arbitrary.md)<`A`\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`ReadonlyArray`<`A`\>\>

#### Defined in

[src/arbitrary.ts:309](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L309)

___

### filter

▸ **filter**<`A`, `B`\>(`refinement`): (`fa`: [`Arbitrary`](interfaces/Arbitrary.md)<`A`\>) => [`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

Arbitrary cannot have a Compactable typeclass instance, as the state needs
to be supplied and called before being able to seperate the output
conditionally.

#### Type parameters

| Name |
| :------ |
| `A` |
| `B` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `refinement` | `Refinement`<`A`, `B`\> |

#### Returns

`fn`

▸ (`fa`): [`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

Arbitrary cannot have a Compactable typeclass instance, as the state needs
to be supplied and called before being able to seperate the output
conditionally.

**`category`** Combinators

##### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Arbitrary`](interfaces/Arbitrary.md)<`A`\> |

##### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

#### Defined in

[src/arbitrary.ts:273](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L273)

▸ **filter**<`A`\>(`predicate`): (`fa`: [`Arbitrary`](interfaces/Arbitrary.md)<`A`\>) => [`Arbitrary`](interfaces/Arbitrary.md)<`A`\>

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `predicate` | `Predicate`<`A`\> |

#### Returns

`fn`

▸ (`fa`): [`Arbitrary`](interfaces/Arbitrary.md)<`A`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Arbitrary`](interfaces/Arbitrary.md)<`A`\> |

##### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`A`\>

#### Defined in

[src/arbitrary.ts:276](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L276)

___

### lazy

▸ **lazy**<`A`\>(`lazy`): [`Arbitrary`](interfaces/Arbitrary.md)<`A`\>

Allows use of an arbitrary that is used after the current arbitrary is defined.
Useful for recursive patterns.

**`example`**
const y = AR.lazy(() => x)
const x = AR.of(constVoid())
// now y can use x without it being unreachable code

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `lazy` | `Lazy`<[`Arbitrary`](interfaces/Arbitrary.md)<`A`\>\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`A`\>

#### Defined in

[src/arbitrary.ts:259](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L259)

___

### mutable

▸ **mutable**<`A`\>(`fa`): [`Arbitrary`](interfaces/Arbitrary.md)<`A`\>

**`summary`**
Removes the `Readonly` type constraint from the value within an `Arbitrary` instance.

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Arbitrary`](interfaces/Arbitrary.md)<`Readonly`<`A`\>\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`A`\>

#### Defined in

[src/arbitrary.ts:340](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L340)

___

### nullable

▸ **nullable**<`T`\>(`arbitrary`): [`Arbitrary`](interfaces/Arbitrary.md)<``null`` \| `T`\>

Allow generating arbitraries of `T` or `null`.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arbitrary` | [`Arbitrary`](interfaces/Arbitrary.md)<`T`\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<``null`` \| `T`\>

#### Defined in

[src/arbitrary.ts:204](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L204)

___

### partial

▸ **partial**<`T`\>(`arbitraries`): [`Arbitrary`](interfaces/Arbitrary.md)<`Partial`<`T`\>\>

Creates an arbitrary as a struct that optionally defines properties.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arbitraries` | { readonly [P in string \| number \| symbol]: Arbitrary<T[P]\> } |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`Partial`<`T`\>\>

#### Defined in

[src/arbitrary.ts:213](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L213)

___

### readonly

▸ **readonly**<`A`\>(`fa`): [`Arbitrary`](interfaces/Arbitrary.md)<`Readonly`<`A`\>\>

Adds the `Readonly` type constraint from the value within an `Arbitrary` instance.

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Arbitrary`](interfaces/Arbitrary.md)<`A`\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`Readonly`<`A`\>\>

#### Defined in

[src/arbitrary.ts:331](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L331)

___

### struct

▸ **struct**<`R`\>(`struct`): [`Arbitrary`](interfaces/Arbitrary.md)<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends `Record`<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `struct` | `EnforceNonEmptyRecord`<{ readonly [P in string \| number \| symbol]: Arbitrary<R[P]\> }\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`R`\>

#### Defined in

[src/arbitrary.ts:355](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L355)

___

### tuple

▸ **tuple**<`R`\>(...`arbitraries`): [`Arbitrary`](interfaces/Arbitrary.md)<[...{ [K in string \| number \| symbol]: [R[K]] extends [Arbitrary<A\>] ? A : never }[]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends readonly [[`Arbitrary`](interfaces/Arbitrary.md)<`unknown`\>, [`Arbitrary`](interfaces/Arbitrary.md)<`unknown`\>, `R`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...arbitraries` | `R` |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<[...{ [K in string \| number \| symbol]: [R[K]] extends [Arbitrary<A\>] ? A : never }[]]\>

#### Defined in

[src/arbitrary.ts:346](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L346)

___

### union

▸ **union**<`T`\>(...`arbitraries`): [`Arbitrary`](interfaces/Arbitrary.md)<`T`[`number`]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends readonly [`unknown`, `unknown`, `T`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...arbitraries` | { readonly [P in string \| number \| symbol]: Arbitrary<T[P]\> } |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`T`[`number`]\>

#### Defined in

[src/arbitrary.ts:364](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L364)

___

### vector

▸ **vector**(`size`): <A\>(`fa`: [`Arbitrary`](interfaces/Arbitrary.md)<`A`\>) => [`Arbitrary`](interfaces/Arbitrary.md)<readonly `A`[]\>

Generates an array with a fixed size, then each has the random contents.

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`fn`

▸ <`A`\>(`fa`): [`Arbitrary`](interfaces/Arbitrary.md)<readonly `A`[]\>

##### Type parameters

| Name |
| :------ |
| `A` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Arbitrary`](interfaces/Arbitrary.md)<`A`\> |

##### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<readonly `A`[]\>

#### Defined in

[src/arbitrary.ts:320](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L320)

___

## Constructors Functions

### character

▸ **character**(`options?`): [`Arbitrary`](interfaces/Arbitrary.md)<`string`\>

**`summary`**
Generate a single character string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Partial`<`Record`<``"from"`` \| ``"to"``, `string`\>\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`string`\>

#### Defined in

[src/arbitrary.ts:184](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L184)

___

### float

▸ **float**(`options?`): [`Arbitrary`](interfaces/Arbitrary.md)<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Partial`<`Record`<``"min"`` \| ``"max"``, `number`\>\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`number`\>

#### Defined in

[src/arbitrary.ts:170](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L170)

___

### fromGen

▸ **fromGen**<`A`\>(`gen`, `shrink?`): [`Arbitrary`](interfaces/Arbitrary.md)<`A`\>

**`summary`**
Lift a generator into the `Arbitrary` typeclass.

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `gen` | [`Gen`](../gen/index.md#gen)<`A`\> |
| `shrink` | `Shrink`<`A`\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`A`\>

#### Defined in

[src/arbitrary.ts:134](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L134)

___

### int

▸ **int**(`options?`): [`Arbitrary`](interfaces/Arbitrary.md)<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Partial`<`Record`<``"min"`` \| ``"max"``, `number`\>\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`number`\>

#### Defined in

[src/arbitrary.ts:144](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L144)

___

### string

▸ **string**(`options?`): [`Arbitrary`](interfaces/Arbitrary.md)<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Partial`<`Record`<``"from"`` \| ``"to"``, `string`\>\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`string`\>

#### Defined in

[src/arbitrary.ts:192](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L192)

___

## Destructors Functions

### toGen

▸ **toGen**<`A`\>(`fa`): [`Gen`](../gen/index.md#gen)<`A`\>

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Arbitrary`](interfaces/Arbitrary.md)<`A`\> |

#### Returns

[`Gen`](../gen/index.md#gen)<`A`\>

#### Defined in

[src/arbitrary.ts:392](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L392)

___

### toShrink

▸ **toShrink**<`A`\>(`fa`): `Shrink`<`A`\>

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Arbitrary`](interfaces/Arbitrary.md)<`A`\> |

#### Returns

`Shrink`<`A`\>

#### Defined in

[src/arbitrary.ts:399](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L399)

___

## Functor Functions

### map

▸ **map**<`A`, `B`\>(`f`): (`fa`: [`Arbitrary`](interfaces/Arbitrary.md)<`A`\>) => [`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

#### Type parameters

| Name |
| :------ |
| `A` |
| `B` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | (`a`: `A`) => `B` |

#### Returns

`fn`

▸ (`fa`): [`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | [`Arbitrary`](interfaces/Arbitrary.md)<`A`\> |

##### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`B`\>

#### Defined in

[src/arbitrary.ts:69](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L69)

___

## Other Functions

### stringNonempty

▸ **stringNonempty**(`options?`): [`Arbitrary`](interfaces/Arbitrary.md)<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Partial`<`Record`<``"from"`` \| ``"to"``, `string`\>\> |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`string`\>

#### Defined in

[src/arbitrary.ts:420](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L420)

___

## Pointed Functions

### of

▸ **of**<`A`\>(`a`): [`Arbitrary`](interfaces/Arbitrary.md)<`A`\>

#### Type parameters

| Name |
| :------ |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `A` |

#### Returns

[`Arbitrary`](interfaces/Arbitrary.md)<`A`\>

#### Defined in

[src/arbitrary.ts:61](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L61)
