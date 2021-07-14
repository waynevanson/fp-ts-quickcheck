import { either as E } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
/**
 * @summary
 * Tail recursion via Monad.
 *
 * **note:** not stack safe
 */
export const tailRecM = (M) => (f) => (fa) => pipe(M.chain(fa, f), (fea) => M.chain(fea, E.fold((a) => tailRecM(M)(f)(M.of(a)), (b) => M.of(b))));
