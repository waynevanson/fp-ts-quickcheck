import { constVoid, pipe } from "fp-ts/lib/function"
import * as AR from "./arbitrary"
import { iterable } from "./modules"
import { state } from "./modules/fp-ts"
import * as qc from "./quickcheck"
import * as gen from "./gen"

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

  describe("int", () => {
    describe("shrink", () => {
      it("should contain positive numbers only when given positive numbers", () => {
        const number = AR.int({ min: 0 })
        const size = AR.int()
        const newSeed = pipe(AR.int(), AR.map(gen.mkSeed))

        const genState = AR.struct({
          newSeed,
          size,
        })

        const arbitrary = AR.struct({
          genState,
          number,
        })

        qc.sync(arbitrary, ({ genState, number }) => {
          const results = pipe(
            AR.int({ min: number, max: number }).shrink,
            state.evaluate(genState),
            iterable.every((i: number) => i >= 0),
          )

          expect(results).toBeTruthy()
        })
      })
    })
  })
})
