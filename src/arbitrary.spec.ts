import * as _ from "./arbitrary"
import * as laws from "fp-ts-laws"
import * as fc from "fast-check"
import * as lcg from "@no-day/fp-ts-lcg"
import { GenState } from "./gen"
import { pipe } from "fp-ts/lib/function"
import { task } from "fp-ts"

const run =
  <A>(fa: _.Arbitrary<A>) =>
  ({ seed, size }: Record<"seed" | "size", number>): [A, GenState] =>
    fa.arbitrary({ size, seed: lcg.mkSeed(seed) })

describe("Arbitrary", () => {
  describe("primitives", () => {
    describe("character", () => {
      it("should return a character", () => {
        const result = run(_.character)({ size: 1, seed: 1 })
        expect(result).toMatchSnapshot()
      })
    })

    describe("boolean", () => {
      it("should generate boolean values", () => {
        const result = run(_.boolean)({ seed: 1, size: 1 })
        expect(result).toMatchSnapshot()
      })
    })

    describe("boolean", () => {
      it("should generate boolean values", () => {
        const result = run(_.boolean)({ seed: 1, size: 1 })
        expect(result).toMatchSnapshot()
      })
    })
  })

  const aa = pipe(_.struct({ name: _.string, age: _.number }))
})
