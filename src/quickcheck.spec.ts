import * as qc from "./quickcheck"
import * as A from "./arbitrary"
import { constVoid, pipe } from "fp-ts/lib/function"
import { AssertionError } from "assert"

describe("quickcheck", () => {
  it("should not throw when the property returns true", () => {
    expect(
      pipe(
        A.of(constVoid()),
        qc.assert(() => true),
      ),
    ).not.toThrow()
  })

  it("should throw when the property returns false", () => {
    expect(
      pipe(
        A.of(constVoid()),
        qc.assert(() => false),
      ),
    ).toThrow()
  })

  it("should throw when the property throws", () => {
    expect(
      pipe(
        A.of(constVoid()),
        qc.assert(() => {
          throw ""
        }),
      ),
    ).toThrow()
  })
  it("should be a dummy", () => {
    try {
      expect(2).toBe(1)
    } catch (e) {
      console.log(e instanceof AssertionError)
      console.log(e)
      console.log(JSON.stringify(e))
    }
  })
})
