import { io as IO } from "fp-ts"
import { MonadRecIO1 } from "../monad-rec-io"

export * from "fp-ts/IO"

export const MonadRecIO: MonadRecIO1<IO.URI> = {
  ...IO.ChainRec,
  ...IO.FromIO,
  ...IO.Pointed,
}
