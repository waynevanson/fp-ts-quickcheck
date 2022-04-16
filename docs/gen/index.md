---
layout: default
title: "gen"
has_children: true
has_toc: false
nav_order: 1
---

[fp-ts-quickcheck](../README.md) / [Exports](../modules.md) / gen

# Namespace: gen

## Table of contents

### Model Type aliases

- [Gen](index.md#gen)
- [GenState](index.md#genstate)
- [Size](index.md#size-1)

### constants Variables

- [seedMax](index.md#seedmax)
- [seedMin](index.md#seedmin)

### instances Variables

- [Applicative](index.md#applicative)
- [Functor](index.md#functor)
- [Monad](index.md#monad)

### Apply Functions

- [ap](index.md#ap)

### Constructors Functions

- [arrayOf](index.md#arrayof)
- [boolean](index.md#boolean)
- [char](index.md#char)
- [float](index.md#float)
- [int](index.md#int)
- [lcgStep](index.md#lcgstep)
- [oneOf](index.md#oneof)
- [recordOf](index.md#recordof)
- [string](index.md#string)
- [tupleOf](index.md#tupleof)
- [uniform](index.md#uniform)
- [vectorOf](index.md#vectorof)

### Destructors Functions

- [evalGen](index.md#evalgen)
- [generate](index.md#generate)
- [generateSample](index.md#generatesample)

### Functor Functions

- [map](index.md#map)

### Monad Functions

- [chain](index.md#chain)

### Other Functions

- [bind](index.md#bind)
- [bindTo](index.md#bindto)
- [chainFirst](index.md#chainfirst)
- [nextSeed](index.md#nextseed)
- [variant](index.md#variant)

### Pointed Functions

- [of](index.md#of)

### constructors Functions

- [mkSeed](index.md#mkseed)

## Model Type aliases

### Gen

Ƭ **Gen**<`T`\>: `State`<[`GenState`](index.md#genstate), `T`\>

The random generator monad

**`since`** 0.1.0

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:96

___

### GenState

Ƭ **GenState**: `Object`

The state of the random generator monad.

**`since`** 0.1.0

#### Type declaration

| Name | Type |
| :------ | :------ |
| `newSeed` | `Seed` |
| `size` | [`Size`](index.md#size-1) |

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:86

___

### Size

Ƭ **Size**: `number`

The meaning of size depends on the particular generator used.

**`since`** 0.1.0

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:79

## constants Variables

### seedMax

• `Const` **seedMax**: `number`

**`since`** 1.0.0

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-lcg@1.0.0_fp-ts@2.11.8/node_modules/@no-day/fp-ts-lcg/dist/index.d.ts:24

___

### seedMin

• `Const` **seedMin**: `number`

**`since`** 1.0.0

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-lcg@1.0.0_fp-ts@2.11.8/node_modules/@no-day/fp-ts-lcg/dist/index.d.ts:19

___

## instances Variables

### Applicative

• `Const` **Applicative**: `Applicative2`<`URI`\>

**`since`** 2.7.0

#### Defined in

node_modules/.pnpm/fp-ts@2.11.8/node_modules/fp-ts/lib/State.d.ts:140

___

### Functor

• `Const` **Functor**: `Functor2`<`URI`\>

**`since`** 2.7.0

#### Defined in

node_modules/.pnpm/fp-ts@2.11.8/node_modules/fp-ts/lib/State.d.ts:100

___

### Monad

• `Const` **Monad**: `Monad2`<`URI`\>

**`since`** 2.7.0

#### Defined in

node_modules/.pnpm/fp-ts@2.11.8/node_modules/fp-ts/lib/State.d.ts:150

## Apply Functions

### ap

▸ **ap**<`E`, `A`\>(`fa`): <B\>(`fab`: `State`<`E`, (`a`: `A`) => `B`\>) => `State`<`E`, `B`\>

Apply a function to an argument under a type constructor.

**`since`** 2.0.0

#### Type parameters

| Name |
| :------ |
| `E` |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | `State`<`E`, `A`\> |

#### Returns

`fn`

▸ <`B`\>(`fab`): `State`<`E`, `B`\>

##### Type parameters

| Name |
| :------ |
| `B` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `fab` | `State`<`E`, (`a`: `A`) => `B`\> |

##### Returns

`State`<`E`, `B`\>

#### Defined in

node_modules/.pnpm/fp-ts@2.11.8/node_modules/fp-ts/lib/State.d.ts:61

___

## Constructors Functions

### arrayOf

▸ **arrayOf**<`T`\>(`gen`): [`Gen`](index.md#gen)<`T`[]\>

Generates a pseudo random array

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, arrayOf, int } from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  assert.deepStrictEqual(
    pipe(
      arrayOf(int()),

      generateSample({ count: 10, size: 5, seed: mkSeed(42) })
    ),
    [
      [27],
      [22, -14, 73],
      [-84, -13, 50],
      [-6, 16, -62, 76],
      [-44, 96],
      [48, 0],
      [],
      [23, 75, -63, -71, 64],
      [],
      [-83],
    ]
  );

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `gen` | [`Gen`](index.md#gen)<`T`\> |

#### Returns

[`Gen`](index.md#gen)<`T`[]\>

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:306

___

### boolean

▸ **boolean**(`s`): [`boolean`, [`GenState`](index.md#genstate)]

A pseudo random boolean

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, boolean } from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  assert.deepStrictEqual(
    pipe(
      boolean,

      generateSample({ seed: mkSeed(42) })
    ),
    [true, true, true, true, true, false, true, true, false, false]
  );

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | [`GenState`](index.md#genstate) |

#### Returns

[`boolean`, [`GenState`](index.md#genstate)]

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:345

___

### char

▸ **char**(`__namedParameters?`): [`Gen`](index.md#gen)<`string`\>

A pseudo random character

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, char } from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  assert.deepStrictEqual(
    pipe(
      char(),

      generateSample({ count: 20, seed: mkSeed(42) })
    ),
    ['K', '}', 'l', 'i', 'C', ':', 'n', 'o', 'q', '0', '{', 'h', '}', 'I', '=', 'o', '<', 'U', 'Z', ';']
  );

  assert.deepStrictEqual(
    pipe(
      char({ from: 'a', to: 'z' }),

      generateSample({ count: 20, seed: mkSeed(42) })
    ),
    ['r', 'v', 'l', 'f', 'p', 'i', 'n', 'b', 'k', 's', 'w', 'a', 'j', 'e', 'b', 'q', 'p', 'w', 'a', 'm']
  );

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters?` | `Object` |
| `__namedParameters.from?` | `string` |
| `__namedParameters.to?` | `string` |

#### Returns

[`Gen`](index.md#gen)<`string`\>

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:373

___

### float

▸ **float**(`__namedParameters?`): [`Gen`](index.md#gen)<`number`\>

Generates a pseudo random float in a given interval

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, float } from '@no-day/fp-ts-generators';
  import * as gen from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  const formatFloat = (digits: number) => (n: number) => Math.round(n * 10 ** digits) / 10 ** digits;

  assert.deepStrictEqual(
    pipe(
      float({ min: -10, max: 10 }),
      gen.map(formatFloat(4)),

      generateSample({ count: 10, seed: mkSeed(42) })
    ),
    [-10, -9.9807, 3.1279, 7.1632, -3.2143, 2.4419, -6.8668, -7.1208, -7.7128, -3.9007]
  );

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters?` | `Object` |
| `__namedParameters.max?` | `number` |
| `__namedParameters.min?` | `number` |

#### Returns

[`Gen`](index.md#gen)<`number`\>

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:183

___

### int

▸ **int**(`__namedParameters?`): [`Gen`](index.md#gen)<`number`\>

Generates a pseudo random integer in a given interval

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, int } from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  assert.deepStrictEqual(
    pipe(
      int({ min: -10, max: 10 }),

      generateSample({ count: 10, seed: mkSeed(42) })
    ),
    [-9, 3, 8, -2, -2, -8, -4, 3, -7, -10]
  );

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters?` | `Object` |
| `__namedParameters.max?` | `number` |
| `__namedParameters.min?` | `number` |

#### Returns

[`Gen`](index.md#gen)<`number`\>

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:157

___

### lcgStep

▸ **lcgStep**(`s`): [`number`, [`GenState`](index.md#genstate)]

A random generator which simply outputs the current seed.

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, lcgStep } from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  assert.deepStrictEqual(
    pipe(
      lcgStep,

      generateSample({ count: 4, seed: mkSeed(42) })
    ),
    [43, 2075653, 1409598201, 1842888923]
  );

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | [`GenState`](index.md#genstate) |

#### Returns

[`number`, [`GenState`](index.md#genstate)]

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:115

___

### oneOf

▸ **oneOf**<`T`\>(`gens`): [`Gen`](index.md#gen)<`T`\>

Create a random generator which selects and executes a random generator from a non-empty array of random generators
with uniform probability.

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, oneOf, int } from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  assert.deepStrictEqual(
    pipe(
      oneOf([int({ min: 10, max: 20 }), int({ min: 50, max: 60 })]),

      generateSample({ count: 6, seed: mkSeed(42) })
    ),
    [58, 57, 55, 60, 12, 10]
  );

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `gens` | `NonEmptyArray`<[`Gen`](index.md#gen)<`T`\>\> |

#### Returns

[`Gen`](index.md#gen)<`T`\>

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:326

___

### recordOf

▸ **recordOf**<`E`, `NER`\>(`r`): `State`<`E`, { [K in string \| number \| symbol]: [NER[K]] extends [State<any, A\>] ? A : never }\>

Generates a pseudo random record if generators are provided for each field

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, recordOf, boolean, int } from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  assert.deepStrictEqual(
    pipe(
      recordOf({ bar: boolean, baz: int(), foo: int() }),

      generateSample({ count: 4, seed: mkSeed(42) })
    ),
    [
      {
        bar: true,
        baz: 27,
        foo: -25,
      },
      {
        bar: true,
        baz: -14,
        foo: 73,
      },
      {
        bar: true,
        baz: -84,
        foo: -13,
      },
      {
        bar: false,
        baz: 36,
        foo: -6,
      },
    ]
  );

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | `E` |
| `NER` | extends `Record`<`string`, `State`<`E`, `any`\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | keyof `NER` extends `never` ? `never` : `NER` & `Record`<`string`, `State`<`E`, `any`\>\> |

#### Returns

`State`<`E`, { [K in string \| number \| symbol]: [NER[K]] extends [State<any, A\>] ? A : never }\>

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:226

___

### string

▸ **string**(`__namedParameters?`): [`Gen`](index.md#gen)<`string`\>

A pseudo random string

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, string } from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  assert.deepStrictEqual(
    pipe(
      string({ from: 'a', to: 'z' }),

      generateSample({ count: 10, seed: mkSeed(42) })
    ),

    ['vlfpinbksw', '', 'ebqpwa', 'uknubf', 'lq', 'jflq', 'fehcuxoqm', 'lsug', 'bat', 't']
  );

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters?` | `Object` |
| `__namedParameters.from?` | `string` |
| `__namedParameters.to?` | `string` |

#### Returns

[`Gen`](index.md#gen)<`string`\>

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:396

___

### tupleOf

▸ **tupleOf**<`E`, `T`\>(...`t`): `State`<`E`, { [K in string \| number \| symbol]: [T[K]] extends [State<E, A\>] ? A : never }\>

Generates a pseudo random tuple if generators are provided for each position

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, tupleOf, int, boolean } from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  assert.deepStrictEqual(
    pipe(
      tupleOf(int(), boolean),

      generateSample({ count: 4, seed: mkSeed(42) })
    ),
    [
      [-57, true],
      [-25, true],
      [-14, false],
      [-64, true],
    ]
  );

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | `E` |
| `T` | extends `State`<`E`, `any`\>[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...t` | `T` & { `0`: `State`<`E`, `any`\>  } |

#### Returns

`State`<`E`, { [K in string \| number \| symbol]: [T[K]] extends [State<E, A\>] ? A : never }\>

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:250

___

### uniform

▸ **uniform**<`T`\>(): [`Gen`](index.md#gen)<`number`\>

A random generator which approximates a uniform random variable on `[0, 1]`

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, uniform } from '@no-day/fp-ts-generators';
  import * as gen from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  const formatFloat = (digits: number) => (n: number) => Math.round(n * 10 ** digits) / 10 ** digits;

  assert.deepStrictEqual(
    pipe(
      uniform(),
      gen.map(formatFloat(4)),

      generateSample({ count: 10, seed: mkSeed(42) })
    ),
    [0, 0.001, 0.6564, 0.8582, 0.3393, 0.6221, 0.1567, 0.144, 0.1144, 0.305]
  );

#### Type parameters

| Name |
| :------ |
| `T` |

#### Returns

[`Gen`](index.md#gen)<`number`\>

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:138

___

### vectorOf

▸ **vectorOf**(`size`): <T\>(`gen`: [`Gen`](index.md#gen)<`T`\>) => [`Gen`](index.md#gen)<`T`[]\>

Generates a pseudo random array of a fixed size

**`since`** 0.1.0

**`example`**
  import { mkSeed, generateSample, vectorOf, int } from '@no-day/fp-ts-generators';
  import { pipe } from 'fp-ts/function';

  assert.deepStrictEqual(
    pipe(
      vectorOf(6)(int()),

      generateSample({ count: 4, seed: mkSeed(42) })
    ),
    [
      [-57, 27, -25, 22, -14, 73],
      [-64, -84, -13, 50, 36, -6],
      [16, -62, 76, -8, -44, 96],
      [88, 48, 0, -37, -53, 23],
    ]
  );

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`fn`

▸ <`T`\>(`gen`): [`Gen`](index.md#gen)<`T`[]\>

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `gen` | [`Gen`](index.md#gen)<`T`\> |

##### Returns

[`Gen`](index.md#gen)<`T`[]\>

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:276

___

## Destructors Functions

### evalGen

▸ **evalGen**<`S`\>(`s`): <A\>(`ma`: `State`<`S`, `A`\>) => `A`

Run a random generator

**`since`** 0.1.0

#### Type parameters

| Name |
| :------ |
| `S` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `S` |

#### Returns

`fn`

▸ <`A`\>(`ma`): `A`

##### Type parameters

| Name |
| :------ |
| `A` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `ma` | `State`<`S`, `A`\> |

##### Returns

`A`

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:406

___

### generate

▸ **generate**(`opts`): <T\>(`gen`: [`Gen`](index.md#gen)<`T`\>) => `T`

Run a random generator with a given seed and size.

**`since`** 0.1.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.seed` | `Seed` |
| `opts.size?` | `number` |

#### Returns

`fn`

▸ <`T`\>(`gen`): `T`

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `gen` | [`Gen`](index.md#gen)<`T`\> |

##### Returns

`T`

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:413

___

### generateSample

▸ **generateSample**(`opts`): <T\>(`gen`: [`Gen`](index.md#gen)<`T`\>) => `T`[]

Run a random generator with a given seed and size. Produces an array of results, configured by count.

**`since`** 0.1.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.count?` | `number` |
| `opts.seed` | `Seed` |
| `opts.size?` | `number` |

#### Returns

`fn`

▸ <`T`\>(`gen`): `T`[]

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `gen` | [`Gen`](index.md#gen)<`T`\> |

##### Returns

`T`[]

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-generators@0.1.0-rc.4_fp-ts@2.11.8/node_modules/@no-day/fp-ts-generators/dist/index.d.ts:423

___

## Functor Functions

### map

▸ **map**<`A`, `B`\>(`f`): <E\>(`fa`: `State`<`E`, `A`\>) => `State`<`E`, `B`\>

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**`since`** 2.0.0

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

▸ <`E`\>(`fa`): `State`<`E`, `B`\>

##### Type parameters

| Name |
| :------ |
| `E` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | `State`<`E`, `A`\> |

##### Returns

`State`<`E`, `B`\>

#### Defined in

node_modules/.pnpm/fp-ts@2.11.8/node_modules/fp-ts/lib/State.d.ts:54

___

## Monad Functions

### chain

▸ **chain**<`E`, `A`, `B`\>(`f`): (`ma`: `State`<`E`, `A`\>) => `State`<`E`, `B`\>

Composes computations in sequence, using the return value of one computation to determine the next computation.

**`since`** 2.0.0

#### Type parameters

| Name |
| :------ |
| `E` |
| `A` |
| `B` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | (`a`: `A`) => `State`<`E`, `B`\> |

#### Returns

`fn`

▸ (`ma`): `State`<`E`, `B`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `ma` | `State`<`E`, `A`\> |

##### Returns

`State`<`E`, `B`\>

#### Defined in

node_modules/.pnpm/fp-ts@2.11.8/node_modules/fp-ts/lib/State.d.ts:73

___

## Other Functions

### bind

▸ **bind**<`N`, `A`, `E`, `B`\>(`name`, `f`): (`ma`: `State`<`E`, `A`\>) => `State`<`E`, { readonly [K in string \| number \| symbol]: K extends keyof A ? A[K] : B }\>

**`since`** 2.8.0

#### Type parameters

| Name | Type |
| :------ | :------ |
| `N` | extends `string` |
| `A` | `A` |
| `E` | `E` |
| `B` | `B` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `Exclude`<`N`, keyof `A`\> |
| `f` | (`a`: `A`) => `State`<`E`, `B`\> |

#### Returns

`fn`

▸ (`ma`): `State`<`E`, { readonly [K in string \| number \| symbol]: K extends keyof A ? A[K] : B }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `ma` | `State`<`E`, `A`\> |

##### Returns

`State`<`E`, { readonly [K in string \| number \| symbol]: K extends keyof A ? A[K] : B }\>

#### Defined in

node_modules/.pnpm/fp-ts@2.11.8/node_modules/fp-ts/lib/State.d.ts:187

___

### bindTo

▸ **bindTo**<`N`\>(`name`): <E, A\>(`fa`: `State`<`E`, `A`\>) => `State`<`E`, { readonly [K in string]: A }\>

**`since`** 2.8.0

#### Type parameters

| Name | Type |
| :------ | :------ |
| `N` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `N` |

#### Returns

`fn`

▸ <`E`, `A`\>(`fa`): `State`<`E`, { readonly [K in string]: A }\>

##### Type parameters

| Name |
| :------ |
| `E` |
| `A` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `fa` | `State`<`E`, `A`\> |

##### Returns

`State`<`E`, { readonly [K in string]: A }\>

#### Defined in

node_modules/.pnpm/fp-ts@2.11.8/node_modules/fp-ts/lib/State.d.ts:181

___

### chainFirst

▸ **chainFirst**<`A`, `E`, `B`\>(`f`): (`first`: `State`<`E`, `A`\>) => `State`<`E`, `A`\>

#### Type parameters

| Name |
| :------ |
| `A` |
| `E` |
| `B` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | (`a`: `A`) => `State`<`E`, `B`\> |

#### Returns

`fn`

▸ (`first`): `State`<`E`, `A`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `first` | `State`<`E`, `A`\> |

##### Returns

`State`<`E`, `A`\>

#### Defined in

[src/gen.ts:10](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/gen.ts#L10)

___

### nextSeed

▸ **nextSeed**(`s`): [`void`, [`GenState`](index.md#genstate)]

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | [`GenState`](index.md#genstate) |

#### Returns

[`void`, [`GenState`](index.md#genstate)]

#### Defined in

[src/gen.ts:22](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/gen.ts#L22)

___

### variant

▸ **variant**(`seed`): [`Gen`](index.md#gen)<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `seed` | `number` |

#### Returns

[`Gen`](index.md#gen)<`void`\>

#### Defined in

[src/gen.ts:12](https://github.com/waynevanson/fp-ts-test/blob/062942d/src/gen.ts#L12)

___

## Pointed Functions

### of

▸ **of**<`E`, `A`\>(`a`): `State`<`E`, `A`\>

**`since`** 2.0.0

#### Type parameters

| Name |
| :------ |
| `E` |
| `A` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `A` |

#### Returns

`State`<`E`, `A`\>

#### Defined in

node_modules/.pnpm/fp-ts@2.11.8/node_modules/fp-ts/lib/State.d.ts:66

___

## constructors Functions

### mkSeed

▸ **mkSeed**(`n`): `Seed`

Creates a new `Seed`. Any number can be given as it will be rounded and overflows are wrapped internally.

**`since`** 1.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

`Seed`

#### Defined in

node_modules/.pnpm/@no-day+fp-ts-lcg@1.0.0_fp-ts@2.11.8/node_modules/@no-day/fp-ts-lcg/dist/index.d.ts:31
