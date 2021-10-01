import * as qc from "./quickcheck"
import * as A from "./arbitrary"
import { pipe } from "fp-ts/lib/function"

describe("qc", () => {
  it("shoudl work baby", () => {
    pipe(
      A.struct({ name: A.string, age: A.number }),
      qc.assert(({ name, age }) => true, { count: 10, initialSeed: 434 }),
    )
  })
})
