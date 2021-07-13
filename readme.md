# fp-ts-test

fp-ts port of Haskell's QuickCheck and (not implemented yet) Python's Hypothesis.

Please note that shrinking is not yet available.
Purescript did the same, so this should be enough to get you started.

## Installation

This library does not exist on NPM yet, so you'll have to clone it and build it yourself.

```sh
yarn add -D fp-ts{,test}
```

## Quick Start

The following `property` will be tested 100 times by default, and return all failures.

Basically check calls the generaor in arbitrary lots of times. the value changes on each call.

```ts
// <basename>.ts
//
// demonstration: function to test
export function add(x: number, y: number) {
  return x + y;
}

// <basename>.test.ts
//
// demonstration: explicitly declaring globals
import { describe, it } from "@jest/globals";
import { add } from ".<basename>";
import { arbitrary as AR, runner as RN } from "fp-ts-test";

describe("add", () => {
  const arbitrary = AR.tuple(AR.number, AR.number);

  // Communitative
  const property /*: () => Promise<void> */ = pipe(
    arbitrary,
    RN.check(([a, b]) => assert.strictEqual(add(a, b), add(b, a)))
  );

  it("Comunitative", property);
});
```

Arbitraries are PURE unlike every other implementation out there, so feel free to put it in any scope you wish.

## How it works

### High Level Overview

### Implementation

## Tips

1. Property's are far more useful when there are multiple.
