import { either } from "fp-ts"
import { constVoid, pipe } from "fp-ts/lib/function"
import * as state from "./state"

describe("state", () => {
  describe("tailRec", () => {
    it("should return true eventually", () => {
      const result = pipe(
        10,
        state.chainRec((a: number) =>
          pipe(
            a,
            either.fromPredicate(
              (number) => number <= 5,
              (e) => e,
            ),
            either.mapLeft((e) => e - 1),
            (a) => state.of<void, either.Either<number, number>>(a),
          ),
        ),
        state.evaluate(constVoid()),
      )

      expect(result).toBe(5)
    })
  })
})
