import * as qc from "./quickcheck"
import * as A from "./arbitrary"
import { pipe } from "fp-ts/lib/function"

describe("qc", () => {
  it("shoudl work baby", () => {
    console.log(
      pipe(
        A.struct({ name: A.string, age: A.number }),
        qc.run(({ name, age }) => true, {
          count: 10,
          initialSeed: 434,
          size: 10,
        }),
      ),
    )
  })
})
