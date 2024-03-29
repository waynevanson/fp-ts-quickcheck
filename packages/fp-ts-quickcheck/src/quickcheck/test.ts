import { Gen } from "@no-day/fp-ts-generators"
import { Seed } from "@no-day/fp-ts-lcg"
import { HKT, Kind, URIS } from "fp-ts/HKT"
import { pipe } from "fp-ts/lib/function"
import { Arbitrary } from "../arbitrary"
import { Testable, Result, Testable1 } from "../testable"
import * as S from "../modules/fp-ts/state"

export interface TestOptions<F, I, A> {
  readonly Arbitrary: Arbitrary<I>
  readonly Testable: Testable<F, A>
  readonly property: (value: I) => A
}

export interface TestOptions1<F extends URIS, I, A> {
  readonly Arbitrary: Arbitrary<I>
  readonly Testable: Testable1<F, A>
  readonly property: (value: I) => A
}

export interface TestResults<F> {
  readonly newSeed: Seed
  readonly resultM: HKT<F, Result>
}

export interface TestResults1<F extends URIS> {
  readonly newSeed: Seed
  readonly resultM: Kind<F, Result>
}

/**
 * @summary
 * Generates a value given an `Arbitrary`,
 * using the `Testable` instance to test if the `property` passes or fails,
 * then returning the information the loop requires.
 */
export function test<F extends URIS, I, A>(
  options: TestOptions1<F, I, A>,
): Gen<TestResults1<F>>

/**
 * @summary
 * Generates a value given an `Arbitrary`,
 * using the `Testable` instance to test if the `property` passes or fails,
 * then returning the information the loop requires.
 */
export function test<F, I, A>(
  options: TestOptions<F, I, A>,
): Gen<TestResults<F>>

/**
 * @summary
 * Generates a value given an `Arbitrary`,
 * using the `Testable` instance to test if the `property` passes or fails,
 * then returning the information the loop requires.
 */
export function test<F, I, A>({
  Arbitrary,
  Testable,
  property,
}: TestOptions<F, I, A>): Gen<TestResults<F>> {
  return pipe(
    Arbitrary,
    S.map((rose) => Testable({ property, value: rose.value })),
    S.bindTo("resultM"),
    S.apS(
      "newSeed",
      S.gets((genState) => genState.newSeed),
    ),
  )
}
