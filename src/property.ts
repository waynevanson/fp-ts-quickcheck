import { either as E } from "fp-ts"
import { Monoid } from "fp-ts/lib/Monoid"
import { Reader } from "fp-ts/lib/Reader"
import { Arbitrary } from "./arbitrary"

/**
 * @summary
 * A property is a function that tests whether something worked or not.
 *
 * Properties should have an assertion that **THROWS**,
 * as the thrown assertion indicates that the test will fail.
 *
 * Or it can return a boolean. this way we know it's all good.
 */
export interface Property<A> {
  (r: A): boolean | void
}
