---
layout: default
title: Arbitrary
parent: "arbitrary"
nav_order: 2

---

[fp-ts-quickcheck](../../README.md) / [Exports](../../modules.md) / [arbitrary](../index.md) / Arbitrary

# Interface: Arbitrary<A\>

[arbitrary](../index.md).Arbitrary

## Type parameters

| Name |
| :------ |
| `A` |

## Table of contents

### Properties

- [generate](Arbitrary.md#generate)
- [shrink](Arbitrary.md#shrink)

## Properties

### generate

• `Readonly` **generate**: [`Gen`](../../gen/index.md#gen)<`A`\>

#### Defined in

[src/arbitrary.ts:41](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L41)

___

### shrink

• `Readonly` **shrink**: `Shrink`<`A`\>

#### Defined in

[src/arbitrary.ts:46](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/arbitrary.ts#L46)
