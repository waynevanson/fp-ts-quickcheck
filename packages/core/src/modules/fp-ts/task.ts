import { task as T } from "fp-ts"
import { ChainRec1 } from "fp-ts/lib/ChainRec"
import { tailRecM } from "../../utils"
import { MonadRecIO1 } from "../monad-rec-io"

export * from "fp-ts/Task"

export const ChainRec: ChainRec1<T.URI> = {
  ...T.Chain,
  chainRec: (fa, f) => tailRecM(T.Monad)(f)(T.of(fa)),
}

export const MonadRecIO: MonadRecIO1<T.URI> = {
  ...ChainRec,
  ...T.FromIO,
  ...T.Pointed,
}
