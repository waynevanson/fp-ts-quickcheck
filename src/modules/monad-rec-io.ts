import { URIS } from "fp-ts/HKT"
import { ChainRec, ChainRec1 } from "fp-ts/lib/ChainRec"
import { FromIO, FromIO1 } from "fp-ts/lib/FromIO"
import { Pointed, Pointed1 } from "fp-ts/lib/Pointed"

/**
 * @category Typeclasses
 */
export interface MonadRecIO<F> extends ChainRec<F>, Pointed<F>, FromIO<F> {}

/**
 * @category Typeclasses
 */
export interface MonadRecIO1<F extends URIS>
  extends ChainRec1<F>,
    Pointed1<F>,
    FromIO1<F> {}
