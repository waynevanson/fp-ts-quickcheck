import { io as IO } from "fp-ts"
import { flow } from "fp-ts/lib/function"
import { task as T } from "../modules/fp-ts"
import { assertion, assertionSync } from "../testable"
import { makeAssert } from "./make-assert"

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
