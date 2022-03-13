/**
 * Basically the module creates a deterministic seed given by type `<A>`,
 * which can then be used to create
 */
import { either as E, option as O } from "fp-ts"
import { Contravariant1 } from "fp-ts/lib/Contravariant"
import { flow, pipe } from "fp-ts/lib/function"
import { Ordering } from "fp-ts/lib/Ordering"
import { Reader } from "fp-ts/lib/Reader"
import { Arbitrary } from "./arbitrary"
import * as gen from "./modules/generator"

/**
 * @category Model
 */
export const URI = "Coarbitrary"

/**
 * @category Model
 */
export type URI = typeof URI

/**
 * @category Model
 */
export interface Coarbitrary<A> {
  coarbitrary: (a: A) => <R>(fa: gen.Gen<R>) => gen.Gen<R>
}

declare module "fp-ts/HKT" {
  export interface URItoKind<A> {
    readonly [URI]: Coarbitrary<A>
  }
}

export const Contravariant: Contravariant1<URI> = {
  URI,
  contramap: (fa, f) => ({ coarbitrary: (b) => fa.coarbitrary(f(b)) }),
}

// PIPEABLES

/**
 * @category Contravariant
 */
export const contramap: <B, A>(
  f: (b: B) => A,
) => (fa: Coarbitrary<A>) => Coarbitrary<B> = (f) => (fa) =>
  Contravariant.contramap(fa, f)

export const ordering: Coarbitrary<Ordering> = {
  coarbitrary: (ordering) =>
    gen.chainFirst(() =>
      gen.variant(ordering === 1 ? 0 : ordering === 0 ? 1 : 2),
    ),
}

export const boolean: Coarbitrary<boolean> = {
  coarbitrary: (bool) => gen.chainFirst(() => gen.variant(bool ? 1 : 0)),
}

export function option<A>(fa: Coarbitrary<A>): Coarbitrary<O.Option<A>> {
  return {
    coarbitrary: O.fold(
      () => gen.chainFirst(() => gen.variant(0)),
      (a) =>
        flow(
          fa.coarbitrary(a),
          gen.chainFirst(() => gen.variant(1)),
        ),
    ),
  }
}

export function either<E, A>(
  fe: Coarbitrary<E>,
  fa: Coarbitrary<A>,
): Coarbitrary<E.Either<E, A>> {
  return {
    coarbitrary: E.fold(
      (e) =>
        flow(
          fe.coarbitrary(e),
          gen.chainFirst(() => gen.variant(0)),
        ),
      (a) =>
        flow(
          fa.coarbitrary(a),
          gen.chainFirst(() => gen.variant(1)),
        ),
    ),
  }
}

export function reader<R, A>(
  ge: Arbitrary<R>,
  fa: Coarbitrary<A>,
): Coarbitrary<Reader<R, A>> {
  return {
    coarbitrary: (fea) => (fr) =>
      pipe(
        ge.arbitrary,
        gen.map(fea),
        gen.chain((a) => pipe(fr, fa.coarbitrary(a))),
      ),
  }
}
