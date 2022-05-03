import { pipe } from "fp-ts/lib/function"
import * as gen from "./gen"
import { state } from "./modules/fp-ts"

describe("gen", () => {
  describe("variant", () => {
    it("should replace the current seed with the input from variant", () => {
      const newSeed = 24
      const result = pipe(
        gen.variant(newSeed),
        state.execute({ newSeed: gen.mkSeed(0), size: 0 }),
      )
      expect(result.newSeed).toEqual(gen.mkSeed(newSeed))
    })
  })

  describe("nextSeed", () => {
    it("should use a different seed from the one provided", () => {
      const newSeed = gen.mkSeed(24)
      const result = pipe(gen.nextSeed, state.execute({ newSeed, size: 0 }))
      expect(result.newSeed).not.toEqual(newSeed)
    })
  })

  describe("lazy", () => {
    it("should allow usage of generators before their declaration", () => {
      const genState = { newSeed: gen.mkSeed(43), size: 0 }
      const lazyGen = gen.lazy(() => nextGen)
      const value = 24
      const nextGen = gen.of(value)
      const result = pipe(lazyGen, state.evaluate(genState))
      expect(result).toBe(value)
    })
  })

  describe("nullable", () => {
    it("should generate null and the current generator", () => {
      const value = "value"
      const result = pipe(
        gen.of(value),
        gen.nullable,
        gen.generateSample({ seed: gen.mkSeed(23), count: 10 }),
      )
      expect(result).toMatchSnapshot()
    })
  })

  describe("filter", () => {
    it("should regenarate the values until a valid value has been found", () => {
      const predicate = (a: string) => a.length > 3
      const result = pipe(
        gen.string({ from: "a", to: "z" }),
        gen.filter(predicate),
        gen.generateSample({ seed: gen.mkSeed(24), count: 4 }),
      )

      expect(result.every(predicate)).toBeTruthy()
    })
  })
})
