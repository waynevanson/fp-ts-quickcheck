import { AssertionError } from "assert"
import { option as O } from "fp-ts"
import * as t from "./testable"
import { constFalse, constTrue, constVoid } from "fp-ts/lib/function"
import * as gen from "./gen"

const seedState: gen.GenState = {
  newSeed: gen.mkSeed(1),
  size: 10,
}

describe("testable", () => {
  describe("boolean", () => {
    it("should return no errors when true is returned from the property", () => {
      const result = t.boolean.test({
        property: constTrue,
        seedState,
        value: constVoid(),
      })
      expect(result).toEqual(O.none)
    })

    it("should return errors when false is returned from the property", () => {
      const result = t.boolean.test({
        property: constFalse,
        seedState,
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
      const result = t.assertionSync.test({
        property: constVoid,
        value: constVoid(),
        seedState,
      })
      expect(result()).toEqual(O.none)
    })

    it("should catch the error that is thrown within", () => {
      const result = t.assertionSync.test({
        property: () => {
          throw new Error()
        },
        seedState,
        value: constVoid(),
      })
      expect(result).not.toThrow()
    })

    it("should fail when there there is a value thrown", () => {
      const error = new Error()
      const result = t.assertionSync.test({
        property: () => {
          throw error
        },
        seedState,
        value: constVoid(),
      })

      expect(result()).toEqual(O.some(error))
    })
  })
})
