import { assertIO } from "./index"
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
