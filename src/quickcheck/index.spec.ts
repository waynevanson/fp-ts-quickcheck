import { assertIO, assert } from "./index"
import * as A from "../arbitrary"
import { pipe } from "fp-ts/lib/function"

describe("assert", () => {
  it(
    "should assert something",
    pipe(
      A.tuple(A.number, A.number),
      assertIO(([x, y]) => expect(x + y).toBe(y + x)),
    ),
  )
})

describe("assert", () => {
  it(
    "should look functionalish",
    pipe(
      A.tuple(A.number, A.number),
      assert(([x, y]) => Promise.resolve(true), { count: 10000 }),
    ),
  )
})
