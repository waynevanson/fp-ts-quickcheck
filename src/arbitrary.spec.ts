import { pipe } from "fp-ts/lib/function"
import * as AR from "./arbitrary"
import * as qc from "./quickcheck"

describe("arbitrary", () => {
  describe("filter", () => {
    it("should filter out bad values", () => {
      const arbitrary = pipe(
        AR.string,
        AR.filter(
          (string): string is `${string}${string}` => string.length > 0,
        ),
      )

      qc.unsafeAssertSync(
        arbitrary,
        (nonemptystring) => nonemptystring.length > 0,
      )
    })
  })
})
