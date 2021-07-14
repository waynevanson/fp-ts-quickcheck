"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tailRecM = void 0;
var fp_ts_1 = require("fp-ts");
var function_1 = require("fp-ts/lib/function");
/**
 * @summary
 * Tail recursion via Monad.
 *
 * **note:** not stack safe
 */
var tailRecM = function (M) {
    return function (f) {
        return function (fa) {
            return function_1.pipe(M.chain(fa, f), function (fea) {
                return M.chain(fea, fp_ts_1.either.fold(function (a) { return exports.tailRecM(M)(f)(M.of(a)); }, function (b) { return M.of(b); }));
            });
        };
    };
};
exports.tailRecM = tailRecM;
