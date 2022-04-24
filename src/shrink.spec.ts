import { reader, readonlyArray } from "fp-ts"
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

    it("should return arrays that increase in size over time", () => {
      const result = pipe(
        shrink.integer,
        shrink.array,
        reader.map(iterable.toReadonlyArray),
      )
      expect(result([2, 2])).toEqual([
        [],
        [0],
        [1],
        [2],
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        [2, 0],
        [2, 1],
      ])
    })

    it("should remove the last element of an array if it is at it's lowest", () => {
      const result = pipe(
        shrink.integer,
        shrink.array,
        reader.map(iterable.toReadonlyArray),
      )
      expect(result([0, 0])).toEqual([[], [0]])
    })

    it("should return array no bigger than it is given", () => {
      const input = [1, 5, 54, 5483, 64]
      const result = pipe(
        shrink.integer,
        shrink.array,
        reader.map(
          iterable.every(
            (fa) => readonlyArray.size(fa) <= readonlyArray.size(input),
          ),
        ),
      )
      expect(result(input)).toBeTruthy()
    })

    it.todo("should apply shrink at lower indexes first")
    it.todo("should try all sizes at the size first")
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

    it("should show a positive number at the start when the input is negative", () => {
      const result = pipe(shrink.integer, reader.map(iterable.toReadonlyArray))
      const integer = 854
      expect(result(-integer)[0]).toEqual(integer)
    })

    it("should start with 0 when the input is not 0", () => {
      const integer = 854
      const result = pipe(shrink.integer, reader.map(iterable.toReadonlyArray))
      expect(result(integer)[0]).toEqual(0)
    })

    it("should only contain positive numbers given a positive number", () => {
      const result = pipe(
        shrink.integer,
        reader.map(iterable.every((integer) => integer >= 0)),
      )
      const integer = 854
      expect(result(integer)).toBeTruthy()
    })
  })

  describe("struct", () => {
    it("should start premutations with the smallest values first", () => {
      const result = pipe(
        shrink.struct({ a: shrink.integer, b: shrink.integer }),
        reader.map(iterable.toReadonlyArray),
      )

      expect(result({ a: 2, b: 2 })).toEqual([
        { a: 0, b: 0 },
        { a: 0, b: 1 },
        { a: 1, b: 0 },
        { a: 1, b: 1 },
      ])
    })
  })
})
