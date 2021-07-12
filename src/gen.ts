import {
  readonlyArray as A,
  state as S,
  chainRec as CHR,
  either as E,
  readonlyArray,
} from "fp-ts";
import { mkSeed, unSeed, Seed } from "@no-day/fp-ts-lcg";

export const URI = "Gen";
export type URI = typeof URI;

/**
 * @summary
 * The state used in `Gen.
 * `seed`, and
 * `size` is the current size of the `Gen`.
 */
export interface GenState {
  seed: Seed;
  size: number;
}

export interface Gen<A> extends S.State<GenState, A> {}

declare module "fp-ts" {
  export interface URItoKind<A> {
    readonly [URI]: Gen<A>;
  }
}

export const of: <A>(a: A) => Gen<A> = S.of;

export const ap: <A>(fa: Gen<A>) => <B>(fab: Gen<(a: A) => B>) => Gen<B> = S.ap;

export const map: <A, B>(f: (a: A) => B) => (fa: Gen<A>) => Gen<B> = S.map;

export const chain: <A, B>(f: (a: A) => Gen<B>) => (fa: Gen<A>) => Gen<B> =
  S.chain;
