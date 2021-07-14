import { pipe } from "fp-ts/lib/function";
import { quickCheck } from "./quickcheck";
import * as a from "./arbitrary";
import * as assert from "assert";

describe("runs", () => {
  it(
    "runs at least a little",
    pipe(
      a.tuple(a.string),
      quickCheck({
        count: 100,
        initialSeed: 283723,
        property: (string) => async () => {
          assert.strictEqual(string, string);
        },
      })
    )
  );
});
