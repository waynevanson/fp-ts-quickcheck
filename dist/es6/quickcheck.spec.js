var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pipe } from "fp-ts/lib/function";
import { quickCheck } from "./quickcheck";
import * as a from "./arbitrary";
import * as assert from "assert";
describe("runs", () => {
    it("runs at least a little", pipe(a.tuple(a.string), quickCheck({
        count: 100,
        initialSeed: 283723,
        property: (string) => () => __awaiter(void 0, void 0, void 0, function* () {
            assert.strictEqual(string, string);
        }),
    })));
});
