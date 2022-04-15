/**
 * @summary
 * Quickcheck is a combinator library which can be used to compose generators 
 * for property based tests.

 * The `*assert*` functions run these generators as tests, safely lifting the
 * property (not a key in an object, but a property in the context of property
 * base testing) result from it's value `HKT<F, A>` to an `FromIO` instance.
 */
import { io as IO } from "fp-ts"
import { flow } from "fp-ts/lib/function"
import { task as T } from "../modules/fp-ts"
import { assertion, assertionSync } from "../testable"
import { makeAssert } from "./assert"

export interface QuickCheckOptions {
  readonly initialSeed: number
  readonly count: number
  readonly size: number
}

export type InitialQuickCheckOptions = Partial<QuickCheckOptions>

export const defaults: QuickCheckOptions = {
  count: 100,
  initialSeed: 100,
  size: 10,
}

export const assertIO = makeAssert({
  Testable: assertionSync,
  MonadRecIO: { ...IO.ChainRec, ...IO.FromIO, ...IO.Pointed },
  defaults,
})

export const unsafeAssertSync = flow(assertIO, (io) => io())

export const assertTask = makeAssert({
  MonadRecIO: { ...T.ChainRec, ...T.FromIO, ...T.Pointed },
  Testable: assertion,
  defaults,
})

export const unsafeAssertAsync = flow(assertTask, (a) => a())
