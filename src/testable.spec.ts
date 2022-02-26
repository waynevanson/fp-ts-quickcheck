import { AssertionError } from "assert"
import { either as E, option as O } from "fp-ts"
import * as t from "./testable"

describe("testable", () => {
  describe("boolean", () => {
    it("should return no errors when true is returned from the property", () => {
      const result = t.boolean.test({})(() => true)
      expect(result).toEqual(O.none)
    })

    it("should return errors when false is returned from the property", () => {
      const result = t.boolean.test({})(() => false)
      expect(result).toEqual(
        O.some(
          E.right(
            new AssertionError({
              operator: "boolean",
              message: "Received false but expected true",
              actual: false,
              expected: true,
            }),
          ),
        ),
      )
    })
  })
})
