---
layout: default
title: "fp-ts-quickcheck"
has_children: true
has_toc: false
nav_order: 1
---

fp-ts-quickcheck / [Exports](modules.md)

# fp-ts-test

fp-ts port of Haskell's QuickCheck.

> **NOTE**
> Please note that shrinking is exposed, but not used in the assertions.
> When used in the assertions, this library will be ready for production use.

## Features

- [x] Pure - Purely functional implementation.
- [x] Compatible - Easily integrates into existing testing frameworks.
- [x] Extensible - Customize what testable property's are.
- [ ] Shrinking (in progress) - Let the software decide what the minimum value that is causing an error.

## Installation

```sh
yarn add -D fp-ts-quickcheck
```

## Quick Start

Grab your favourite test library, in this case `jest`, and put the assertion call of this library into the test caller.

```ts
export function add(x: number, y: number) {
  return x + y
}

import { quickcheck, arbitrary } from "fp-ts-quickcheck"
import { expect, it, describe } from "@jest/globals"
import { pipe } from "fp-ts/function"

describe(add, () => {
  const numnum = arbitrary.tuple(arbitraty.int(), arbitrary.int())

  it("should be an associative operation", () => {
    // returning a boolean
    quickcheck.sync(numnum, ([x, y]) => add(y, x) === add(x, y))
  })

  it("should be an associative operation", () => {
    // throwing an assertion error
    quickcheck.sync(numnum, ([x, y]) => {
      expect(add(x, y)).toBe(add(y, x))
    })
  })
})
```
