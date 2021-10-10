import { identity as Identity, io as IO } from "fp-ts"
import { flow, pipe } from "fp-ts/lib/function"
import { arbitrary } from "."
import * as AT from "./arbitrary"
import * as tb from "./testable"

const I = Object.assign({}, IO.Pointed, IO.ChainRec, IO.FromIO)

/**
 * @summary
 * Asserts that a property passes when generating pseudorandom values,
 * otherwise it **throws**.
 *
 * Use this in a test runner which can handle exceptions.
 *
 * @throws
 */
export const _assertIO = tb.assert(I)

export function assert<A>(
  property: tb.Property1<"Identity", A>,
  options: tb.QuickCheckOptions,
): (arbitrary: AT.Arbitrary<A>) => IO.IO<void> {
  return (arbitrary) =>
    _assertIO(
      {
        property: flow(property, IO.of),
        arbitrary: pipe(arbitrary, AT.map(IO.of)).arbitrary,
      },
      options,
    )
}

export function assertIO<A>(
  property: tb.Property1<"IO", A>,
  options: tb.QuickCheckOptions,
): (arbitrary: AT.Arbitrary<IO.IO<A>>) => IO.IO<void> {
  return (arbitrary) =>
    _assertIO({ property, arbitrary: arbitrary.arbitrary }, options)
}
