/**
 * @summary
 * Quickcheck is a combinator library which can be used to compose generators 
 * for property based tests.

 * The `*assert*` functions run these generators as tests, safely lifting the
 * property (not a key in an object, but a property in the context of property
 * base testing) result from it's value `HKT<F, A>` to an `FromIO` instance.
 */

export { sync, async, io, task, quickcheckOptionsDefault, mk } from "./assert"
