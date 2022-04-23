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
})
