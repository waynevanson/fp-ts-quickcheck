import { assertIO, assertTask } from "./index"
import * as A from "../arbitrary"

const numnum = A.tuple(A.int(), A.int())

describe("assert", () => {
  it(
    "should assert something",
    assertIO(numnum, ([x, y]) => expect(x + y).toBe(y + x)),
  )
})

describe("assert", () => {
  it(
    "should look functionalish",
    assertTask(numnum, ([x, y]) => Promise.resolve(true), { count: 10000 }),
  )
})
