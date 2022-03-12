import { task as T } from "fp-ts"
import { ChainRec1 } from "fp-ts/lib/ChainRec"
import { tailRecM } from "../../utils"

export * from "fp-ts/Task"

export const ChainRec: ChainRec1<T.URI> = {
  ...T.Chain,
  chainRec: (fa, f) => tailRecM(T.Monad)(f)(T.of(fa)),
}
