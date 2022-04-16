---
layout: default
title: "quickcheck"
has_children: true
has_toc: false
nav_order: 1
---

[fp-ts-quickcheck](../README.md) / [Exports](../modules.md) / quickcheck

# Namespace: quickcheck

## Table of contents

### Variables

- [quickcheckOptionsDefault](index.md#quickcheckoptionsdefault)

### Functions

- [async](index.md#async)
- [io](index.md#io)
- [mk](index.md#mk)
- [sync](index.md#sync)
- [task](index.md#task)

## Variables

### quickcheckOptionsDefault

• `Const` **quickcheckOptionsDefault**: `QuickCheckOptions`

**`summary`**
Quickcheck is a combinator library which can be used to compose generators
for property based tests.

The `*assert*` functions run these generators as tests, safely lifting the
property (not a key in an object, but a property in the context of property
base testing) result from it's value `HKT<F, A>` to an `FromIO` instance.

#### Defined in

[src/quickcheck/assert.ts:18](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/quickcheck/assert.ts#L18)

## Functions

### async

▸ **async**<`I`\>(...`a`): `Promise`<`void`\>

#### Type parameters

| Name |
| :------ |
| `I` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...a` | [arbitrary: Arbitrary<I\>, property: Function, options?: Partial<QuickCheckOptions\>] |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/quickcheck/assert.ts:99](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/quickcheck/assert.ts#L99)

___

### io

▸ **io**<`I`\>(`arbitrary`, `property`, `options?`): `IO`<`void`\>

#### Type parameters

| Name |
| :------ |
| `I` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arbitrary` | [`Arbitrary`](../arbitrary/interfaces/Arbitrary.md)<`I`\> |
| `property` | (`value`: `I`) => `void` |
| `options?` | `Partial`<`QuickCheckOptions`\> |

#### Returns

`IO`<`void`\>

#### Defined in

[src/quickcheck/assert.ts:87](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/quickcheck/assert.ts#L87)

___

### mk

▸ **mk**<`F`, `A`\>(`options`): `Assert1`<`F`, `A`\>

**`summary`**
Quickcheck is a combinator library which can be used to compose generators
for property based tests.

The `*assert*` functions run these generators as tests, safely lifting the
property (not a key in an object, but a property in the context of property
base testing) result from it's value `HKT<F, A>` to an `FromIO` instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `F` | extends keyof `URItoKind`<`any`\> |
| `A` | `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `AssertOptions1`<`F`, `A`\> |

#### Returns

`Assert1`<`F`, `A`\>

#### Defined in

[src/quickcheck/assert.ts:52](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/quickcheck/assert.ts#L52)

▸ **mk**<`F`, `A`\>(`dependencies`): `Assert`<`F`, `A`\>

**`summary`**
Quickcheck is a combinator library which can be used to compose generators
for property based tests.

The `*assert*` functions run these generators as tests, safely lifting the
property (not a key in an object, but a property in the context of property
base testing) result from it's value `HKT<F, A>` to an `FromIO` instance.

#### Type parameters

| Name |
| :------ |
| `F` |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | `AssertOptions`<`F`, `A`\> |

#### Returns

`Assert`<`F`, `A`\>

#### Defined in

[src/quickcheck/assert.ts:56](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/quickcheck/assert.ts#L56)

___

### sync

▸ **sync**<`I`\>(...`a`): `void`

#### Type parameters

| Name |
| :------ |
| `I` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...a` | [arbitrary: Arbitrary<I\>, property: Function, options?: Partial<QuickCheckOptions\>] |

#### Returns

`void`

#### Defined in

[src/quickcheck/assert.ts:98](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/quickcheck/assert.ts#L98)

___

### task

▸ **task**<`I`\>(`arbitrary`, `property`, `options?`): `Task`<`void`\>

#### Type parameters

| Name |
| :------ |
| `I` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arbitrary` | [`Arbitrary`](../arbitrary/interfaces/Arbitrary.md)<`I`\> |
| `property` | (`value`: `I`) => `Assertion` |
| `options?` | `Partial`<`QuickCheckOptions`\> |

#### Returns

`Task`<`void`\>

#### Defined in

[src/quickcheck/assert.ts:92](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/quickcheck/assert.ts#L92)
