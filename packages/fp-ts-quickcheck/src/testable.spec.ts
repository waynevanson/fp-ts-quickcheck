import { AssertionError } from "assert"
import { option as O } from "fp-ts"
import * as t from "./testable"
import { constFalse, constTrue, constVoid } from "fp-ts/lib/function"

describe("testable", () => {
  describe("boolean", () => {
    it("should return no errors when true is returned from the property", () => {
      const result = t.boolean({
        property: constTrue,
        value: constVoid(),
      })
      expect(result).toEqual(O.none)
    })

    it("should return errors when false is returned from the property", () => {
      const result = t.boolean({
        property: constFalse,
        value: constVoid(),
      })
      expect(result).toEqual(
        O.some(
          new AssertionError({
            operator: "boolean",
            message: "Received false but expected true",
            actual: false,
            expected: true,
          }),
        ),
      )
    })
  })

  describe("assertion", () => {
    it("should pass when there there is no value thrown", () => {
      const result = t.sync({
        property: constVoid,
        value: constVoid(),
      })
      expect(result()).toEqual(O.none)
    })

    it("should catch the error that is thrown within", () => {
      const result = t.sync({
        property: () => {
          throw new Error()
        },
        value: constVoid(),
      })
      expect(result).not.toThrow()
    })

    it("should fail when there there is a value thrown", () => {
      const error = new Error()
      const result = t.sync({
        property: () => {
          throw error
        },
        value: constVoid(),
      })

      expect(result()).toEqual(O.some(error))
    })
  })
})
