import { AssertionError } from "assert"
import { either as E, option as O } from "fp-ts"
import * as t from "./testable"
import * as assert from "assert"
import { constVoid } from "fp-ts/lib/function"

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
      const result = t.assertion.test(constVoid())(() => {})
      expect(result()).toEqual(O.none)
    })

    it("should catch the error that is thrown within", () => {
      const error = new Error()
      const result = t.assertion.test(constVoid())(() => {
        throw error
      })
      expect(result).not.toThrow()
    })

    it("should fail when there there is a value thrown", () => {
      const error = new Error()
      const result = t.assertion.test(constVoid())(() => {
        throw error
      })

      expect(result()).toEqual(O.some(error))
    })
  })
})
