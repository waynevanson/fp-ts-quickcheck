import { reader } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import { iterable } from "./modules"
import * as shrink from "./shrink"

describe("shrink", () => {
  describe("array", () => {
    it("should shrink to nothing when the array is empty", () => {
      const result = pipe(
        shrink.zero(),
        shrink.array,
        reader.map(iterable.toReadonlyArray),
      )
      expect(result([])).toEqual([])
    })

    it.skip("should return an empty array when the inner is shrunk to nothing", () => {
      const result = pipe(
        shrink.zero(),
        shrink.array,
        reader.map(iterable.toReadonlyArray),
      )
      expect(result([])).toEqual([[]])
    })
  })

  describe("boolean", () => {
    it("should return false given true", () => {
      const result = pipe(shrink.boolean, reader.map(iterable.toReadonlyArray))
      expect(result(true)).toEqual([false])
    })

    it("should return an empty when given false", () => {
      const result = pipe(shrink.boolean, reader.map(iterable.toReadonlyArray))
      expect(result(false)).toEqual([])
    })
  })

  describe("number", () => {
    it("should return an empty when given 0", () => {
      const result = pipe(shrink.integer, reader.map(iterable.toReadonlyArray))
      expect(result(0)).toEqual([])
    })

    it.skip("should show a positive number at the start when the input is negative", () => {
      const result = pipe(shrink.integer, reader.map(iterable.toReadonlyArray))
      const integer = 854
      expect(result(-integer)[0]).toEqual(integer)
    })

    it("should start with 0 when the input is not 0", () => {
      const integer = 854
      const result = pipe(shrink.integer, reader.map(iterable.toReadonlyArray))
      expect(result(integer)[0]).toEqual(0)
    })
  })
})
