# fp-ts-test

fp-ts port of Haskell's QuickCheck.

> **NOTE**
> Please note that shrinking is not yet available.
> Purescript did the same, so this should be enough to get you started.
> When shrinking is available, it will be transparently added as major release.

## Features

- [x] Purely functional implementation.
- [x] Compatible - Easily integrates into existing testing frameworks.
- [x] Polymorphic - Create custom assert functions using fp-ts typeclass instances.
- [x] Extensible - Simply add compatibilty assertions for data structures

## Installation

```sh
yarn add -D fp-ts-test
```

## Quick Start

Grab your favourite test library, in this case `jest`, and put the assertion call of this library into the test caller.

```ts
// main.ts
export function subtract(x: number, y: number) {
  return x - y
}

// main.spec.ts
import { quickcheck as qc, arbitrary as AT } from "fp-ts-test"
import { expect, it, describe } from "@jest/globals"

import { pipe } from "fp-ts/function"

import { subtract } from "./main"

describe(subtract, () => {
  const arbitrary = AT.tuple(AT.number, AT.number)

  it(
    "should always be smaller than the first argument",
    pipe(
      arbitrary,
      // returns a thunk by default, because `qc.assert` throws
      qc.assert(([x, y]) => x > subract(x, y)),
    ),
  )

  it(
    "should matter which order the arguments are passed",
    pipe(
      arbitrary,
      // returns a thunk by default, because `qc.assert` throws
      qc.assert(([x, y]) => subtract(y, x) !== subract(x, y)),
    ),
  )
})
```
