# fp-ts-test

fp-ts port of Haskell's QuickCheck and (not implemented yet) Python's Hypothesis.

Please note that shrinking is not yet available.
Purescript did the same, so this should be enough to get you started.

> NOTE: Still in development.
> It works, but the developer experience of the API surface needs some more additions.

## Installation

This library does not exist on NPM yet, so use the built versions in this repo instead.

```sh
yarn add fp-ts && yarn add -D fp-ts-test@git+ssh://git@github.com:waynevanson/fp-ts-test
```

## Quick Start

Grab your favourite test runner like `jest`, put the assertion call of this library into the caller.

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
  const arbitrary = qc.tuple(qc.number, qc.number)

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
