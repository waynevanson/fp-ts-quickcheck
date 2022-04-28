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
    it.todo("should allow usage of generators before their declaration")
  })

  describe("nullable", () => {
    it.todo("should generate null and the current generator")
  })

  describe("filter", () => {
    it.todo("should regenarate the values until a valid value has been found")
  })
})
