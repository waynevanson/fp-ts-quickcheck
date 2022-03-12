import { assertIO, assert } from "./index"
import * as A from "../arbitrary"

const numnum = A.tuple(A.number, A.number)

describe("assert", () => {
  it(
    "should assert something",
    assertIO(numnum, ([x, y]) => expect(x + y).toBe(y + x)),
  )
})

describe("assert", () => {
  it(
    "should look functionalish",
    assert(numnum, ([x, y]) => Promise.resolve(true), { count: 10000 }),
  )
})
