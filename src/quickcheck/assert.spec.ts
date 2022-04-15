import { mk } from "./assert"
import { io, io as IO } from "fp-ts"
import * as testable from "../testable"
import * as A from "../arbitrary"

describe(mk, () => {
  it("should apply a simple signature", () => {
    mk({
      MonadRecIO: { ...IO.MonadIO, ...IO.ChainRec },
      Testable: testable.assertionSync,
      defaults: {
        count: 10,
        initialSeed: 1,
        size: 10,
      },
    })(A.int(), () => true, {})
  })
})
