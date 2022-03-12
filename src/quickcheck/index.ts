import { makeAssert } from "./make-assert"
import { assertionSync, assertion } from "../testable"
import { io as IO, task as T } from "fp-ts"
import { ChainRec1 } from "fp-ts/lib/ChainRec"
import { tailRecM } from "../utils"

export interface QuickCheckOptions {
  initialSeed: number
  count: number
  size: number
}

export type InitialQuickCheckOptions = Partial<QuickCheckOptions>

const defaults: QuickCheckOptions = {
  count: 100,
  initialSeed: 100,
  size: 10,
}

export const assertIO = makeAssert({
  Testable: assertionSync,
  MonadRecIO: { ...IO.ChainRec, ...IO.FromIO, ...IO.Pointed },
  defaults,
})

export const ChainRecTask: ChainRec1<T.URI> = {
  ...T.Chain,
  chainRec: (fa, f) => tailRecM(T.Monad)(f)(T.of(fa)),
}

export const assert = makeAssert({
  MonadRecIO: { ...ChainRecTask, ...T.FromIO, ...T.Pointed },
  Testable: assertion,
  defaults,
})
