import * as E from "fp-ts/Either"
import { ChainRec2 } from "fp-ts/lib/ChainRec"
import { Chain, URI, State } from "fp-ts/State"

export * from "fp-ts/State"

export const ChainRec: ChainRec2<URI> = {
  ...Chain,
  chainRec: (a, f) => (s) => {
    // eslint-disable-next-line functional/no-let
    let [_ea, _state] = f(a)(s)

    // eslint-disable-next-line functional/no-loop-statement
    while (E.isLeft(_ea)) {
      const result = f(_ea.left)(_state)
      // eslint-disable-next-line functional/no-expression-statement
      _ea = result[0]
      // eslint-disable-next-line functional/no-expression-statement
      _state = result[1]
    }

    return [_ea.right, _state]
  },
}

export const chainRec =
  <A, B, S>(f: (a: A) => State<S, E.Either<A, B>>) =>
  (a: A) =>
    ChainRec["chainRec"](a, f)
