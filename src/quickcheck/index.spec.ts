import { assert } from "./index"
import * as A from "../arbitrary"
import { pipe } from "fp-ts/lib/function"

describe("assert", () => {
  it(
    "should assert something",
    pipe(
      A.tuple(A.number, A.number),
      assert(([x, y]) => expect(x + y).toBe(y + x), { count: 1000000000 }),
    ),
  )
})
