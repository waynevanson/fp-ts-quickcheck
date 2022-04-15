import { constVoid, pipe } from "fp-ts/lib/function"
import * as AR from "./arbitrary"
import * as qc from "./quickcheck"

describe("arbitrary", () => {
  describe("filter", () => {
    it("should filter out bad values", () => {
      const arbitrary = pipe(
        AR.string(),
        AR.filter(
          (string): string is `${string}${string}` => string.length > 0,
        ),
      )

      qc.sync(arbitrary, (nonemptystring) =>
        expect(nonemptystring.length).toBeGreaterThan(0),
      )
    })
  })

  describe("array", () => {
    it("should be an array containing the arbitraries", () => {
      const arbitrary = AR.array(AR.string())
      qc.sync(arbitrary, (strings) => {
        expect(strings).toBeInstanceOf(Array)
        strings.forEach((string) => {
          expect(typeof string).toBe("string")
        })
      })
    })
  })

  describe("lazy", () => {
    it("should be able to access an arbitrary after initialization", () => {
      const y = AR.lazy(() => x)
      const x = AR.of(constVoid())
      expect(qc.io(y, constVoid)).not.toThrow()
    })
  })
})
