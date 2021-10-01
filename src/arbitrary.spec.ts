import * as _ from "./arbitrary"
import * as laws from "fp-ts-laws"
import * as fc from "fast-check"
import * as lcg from "@no-day/fp-ts-lcg"
import { GenState } from "./generators"
import { pipe } from "fp-ts/lib/function"
import { task } from "fp-ts"

const run =
  <A>(fa: _.Arbitrary<A>) =>
  ({ newSeed, size }: Record<"newSeed" | "size", number>): [A, GenState] =>
    fa.arbitrary({ size, newSeed: lcg.mkSeed(newSeed) })

describe("Arbitrary", () => {
  describe("primitives", () => {
    describe("character", () => {
      it("should return a character", () => {
        const result = run(_.character)({ size: 1, newSeed: 1 })
        expect(result).toMatchSnapshot()
      })
    })

    describe("boolean", () => {
      it("should generate boolean values", () => {
        const result = run(_.boolean)({ newSeed: 1, size: 1 })
        expect(result).toMatchSnapshot()
      })
    })

    describe("boolean", () => {
      it("should generate boolean values", () => {
        const result = run(_.boolean)({ newSeed: 1, size: 1 })
        expect(result).toMatchSnapshot()
      })
    })
  })

  const aa = pipe(_.struct({ name: _.string, age: _.number }))
})
