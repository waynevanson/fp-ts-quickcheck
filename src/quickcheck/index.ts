import * as as from "./make-assert"
import { assertion } from "../testable"
import { io as IO } from "fp-ts"

export interface QuickCheckOptions {
  initialSeed: number
  count: number
  size: number
}

const defaults: QuickCheckOptions = {
  count: 10,
  initialSeed: 100,
  size: 10,
}

export const assertIO = as.makeAssert({
  Testable: assertion,
  MonadRecIO: { ...IO.ChainRec, ...IO.FromIO, ...IO.Pointed },
  defaults,
})
