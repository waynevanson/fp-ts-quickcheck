import { iterable } from "./modules"
import * as shrink from "./shrink"

describe("shrink", () => {
  describe("array", () => {
    it("should shrink to nothing when the array is empty", () => {
      const aa = shrink.array(shrink.zero())
      expect(iterable.toReadonlyArray(aa([]))).toEqual([])
    })
  })
})
