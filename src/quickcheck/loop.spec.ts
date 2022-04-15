import * as lcg from "@no-day/fp-ts-lcg"
import { identity as I, option as O } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import * as A from "../arbitrary"
import { LoopFailure } from "../loopstate"
import { stateT as ST } from "../modules/fp-ts"
import { boolean } from "../testable"
import { loop } from "./loop"

describe(loop, () => {
  describe("boolean", () => {
    it("should increment index, seed and successes on successful test", () => {
      const result = pipe(
        loop(I.Monad)({
          Arbitrary: A.int(),
          property: () => true,
          size: 1,
          Testable: boolean,
        }),
        ST.execute(I.Functor)({
          failure: O.zero<LoopFailure>(),
          index: 0,
          seed: lcg.mkSeed(1),
          successes: 0,
        }),
      )

      expect(result).toEqual({
        failure: O.zero<LoopFailure>(),
        index: 1,
        seed: lcg.lcgNext(lcg.mkSeed(1)),
        successes: 1,
      })
    })

    it("should increment index, seed and failure on unsuccessful test", () => {
      const result = pipe(
        loop(I.Monad)({
          Arbitrary: A.int(),
          property: () => false,
          size: 1,
          Testable: boolean,
        }),
        ST.execute(I.Functor)({
          failure: O.zero<LoopFailure>(),
          index: 0,
          seed: lcg.mkSeed(1),
          successes: 0,
        }),
      )

      expect(result).toMatchObject({
        failure: O.some({
          data: {
            operator: "boolean",
            expected: true,
            actual: false,
            code: "ERR_ASSERTION",
            generatedMessage: false,
          },
          index: 1,
          seed: lcg.lcgNext(lcg.mkSeed(1)),
        }),
        index: 1,
        seed: lcg.lcgNext(lcg.mkSeed(1)),
        successes: 0,
      })
    })
  })
})
