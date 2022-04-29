describe("arbitrary", () => {
  describe("functional foundations", () => {
    describe("Pointed", () => {
      it.todo("of")
      it.todo("laws")
    })
    describe("Functor", () => {
      it.todo("map")
      it.todo("laws")
    })

    describe("Apply", () => {
      it.todo("ap")
      it.todo("laws")
    })

    describe("Applicative", () => {
      it.todo("laws")
    })

    describe("Chain", () => {
      it.todo("chain")
      it.todo("laws")
    })

    describe("Monad", () => {
      it.todo("laws")
    })

    describe("Compactable", () => {
      it.todo("compact")
      it.todo("seperate")
    })

    describe("Filterable", () => {
      it.todo("filter")
      it.todo("partition")
    })
  })

  describe("others", () => {
    describe("nullable", () => {
      it.todo("should generate null or A")
      it.todo("should shrink null first")
      it.todo("should finish shrinking when provided null")
    })

    describe("lazy", () => {
      it.todo("should allow reference of arbitrary before it is defined")
      it.todo("should not allow use of arbitrary before it is defined")
    })

    describe("array", () => {
      it.todo("should generate values of any size")
      it.todo("should finish shrinking when given an empty array")
    })

    describe("vector", () => {
      it.todo("should generate arrays of the provided length")
      it.todo(
        "should return empty when all elements are at their smallest values",
      )
    })

    describe("readonly", () => {
      it.todo("should not change the functionality of the abritrary")
      it.todo("should add the readonly type constraint on the value")
    })

    describe("mutable", () => {
      it.todo("should not change the functionality of the abritrary")
      it.todo("should remove the readonly type constraint on the value")
    })

    describe("tuple", () => {
      it.todo("should generate values that are the same length as the tuple")
      it.todo(
        "should only generate the provided value at the position the arbitrary was provided",
      )
      it.todo("should not allow generating values when the tuple is empty")
    })

    describe("struct", () => {
      it.todo("should generate every key in the struct")
      it.todo("should never use the maximum value when shrinkin")
    })

    describe("union", () => {
      it.todo("should generate all of the values eventually")
      it.todo(
        "should shrink values to empty when given the first smallest value",
      )
    })

    describe("toGen", () => {
      it.todo("should transform an arbitrary into a generator")
    })

    describe("boolean", () => {
      it.todo("should shrink to false when given true")
      it.todo("should finish shrinking when given false")
    })

    describe("string", () => {
      it.todo("can generate strings of any length")
      it.todo("should finish shrinking when given an empty string")
    })

    describe("char", () => {
      it.todo("should not generate strings with a size not equal to one")
    })

    describe("nonemptyString", () => {
      it.todo("should not generate an empty string")
    })
  })
})
