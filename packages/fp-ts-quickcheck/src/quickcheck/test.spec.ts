import { sync, boolean } from "../testable"
import { test as tester } from "./test"
import * as A from "../arbitrary"
import { pipe } from "fp-ts/lib/function"
import { option as O, state as S } from "fp-ts"
import { mkSeed, lcgNext } from "@no-day/fp-ts-lcg"

describe(test, () => {
  describe("boolean", () => {
    it("should increment the newSeed and return no errors when the property returns true", () => {
      const result = pipe(
        tester({ Arbitrary: A.int(), Testable: boolean, property: () => true }),
        S.evaluate({ size: 1, newSeed: mkSeed(1) }),
      )
      expect(result).toEqual({ resultM: O.none, newSeed: lcgNext(mkSeed(1)) })
    })
  })

  describe("assertion", () => {
    it("should increment the newSeed and return no errors when the property returns true", () => {
      const result = pipe(
        tester({
          Arbitrary: A.int(),
          Testable: sync,
          property: () => true,
        }),
        S.evaluate({ size: 1, newSeed: mkSeed(1) }),
      )
      expect(result.newSeed).toEqual(lcgNext(mkSeed(1)))
      expect(result.resultM()).toEqual(O.none)
    })
  })
})
