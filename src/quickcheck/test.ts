import { Gen } from "@no-day/fp-ts-generators"
import { Seed } from "@no-day/fp-ts-lcg"
import { HKT, Kind, URIS } from "fp-ts/HKT"
import { pipe } from "fp-ts/lib/function"
import { Arbitrary } from "../arbitrary"
import { Testable, Result, Testable11 } from "../testable"
import * as S from "../modules/fp-ts/state"

export interface TestOptions<F, G, I, A> {
  Arbitrary: Arbitrary<I>
  Testable: Testable<F, G, A>
  property: (value: I) => HKT<F, A>
}

export interface TestOptions11<F extends URIS, G extends URIS, I, A> {
  Arbitrary: Arbitrary<I>
  Testable: Testable11<F, G, A>
  property: (value: I) => Kind<F, A>
}

export interface TestResults<G> {
  readonly newSeed: Seed
  readonly resultM: HKT<G, Result>
}
export interface TestResults11<G extends URIS> {
  readonly newSeed: Seed
  readonly resultM: Kind<G, Result>
}

export function test<F extends URIS, G extends URIS, I, A>(
  options: TestOptions11<F, G, I, A>,
): Gen<TestResults11<G>>

export function test<F, G, I, A>(
  options: TestOptions<F, G, I, A>,
): Gen<TestResults<G>>

export function test<F, G, I, A>({
  Arbitrary,
  Testable,
  property,
}: TestOptions<F, G, I, A>): Gen<TestResults<G>> {
  return pipe(
    Arbitrary.arbitrary,
    S.map(Testable.test),
    S.ap(S.of(property)),
    S.bindTo("resultM"),
    S.apS(
      "newSeed",
      S.gets((genState) => genState.newSeed),
    ),
  )
}
