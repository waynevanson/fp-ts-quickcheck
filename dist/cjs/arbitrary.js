"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boolean = exports.string = exports.struct = exports.tuple = exports.mutable = exports.readonly = exports.array = exports.character = exports.number = exports.Applicative = exports.Apply = exports.Functor = exports.Pointed = exports.chain = exports.ap = exports.map = exports.of = exports.URI = void 0;
/**
 * To shrink these bad boys, we need some TSRATEGIES!
 *
 *
 *
 */
var gen = __importStar(require("./gen"));
var function_1 = require("fp-ts/lib/function");
var fp_ts_1 = require("fp-ts");
var Apply_1 = require("fp-ts/lib/Apply");
exports.URI = "Arbitrary";
var of = function (a) { return ({ arbitrary: fp_ts_1.state.of(a) }); };
exports.of = of;
var map = function (f) { return function (fa) { return ({ arbitrary: function_1.pipe(fa.arbitrary, fp_ts_1.state.map(f)) }); }; };
exports.map = map;
var ap = function (fa) { return function (fab) { return ({
    arbitrary: function_1.pipe(fab.arbitrary, fp_ts_1.state.ap(fa.arbitrary)),
}); }; };
exports.ap = ap;
var chain = function (f) { return function (fa) { return ({
    arbitrary: function_1.pipe(fa.arbitrary, fp_ts_1.state.chain(function_1.flow(f, function (b) { return b.arbitrary; }))),
}); }; };
exports.chain = chain;
exports.Pointed = { URI: exports.URI, of: exports.of };
exports.Functor = { URI: exports.URI, map: function (fa, f) { return exports.map(f)(fa); } };
exports.Apply = __assign(__assign({}, exports.Functor), { ap: function (fab, fa) { return exports.ap(fa)(fab); } });
exports.Applicative = __assign(__assign({}, exports.Pointed), exports.Apply);
/**
 * @category Primitives
 */
exports.number = {
    arbitrary: gen.chooseInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
};
/**
 * @summary
 * Generate a single character string.
 *
 * `65536` seems to be the maximum charcode supported by javascript.
 *
 * @category Primitives
 */
exports.character = {
    arbitrary: function_1.pipe(gen.chooseInt(0, 65536), fp_ts_1.state.map(function (a) { return String.fromCharCode(a); })),
};
/**
 * @summary
 * Generates an array with a random size, then each has the random contents.
 *
 * @category Combinators
 */
function array(arbitrary) {
    return {
        arbitrary: function_1.pipe(gen.sized, fp_ts_1.state.chain(function (size) { return gen.chooseInt(0, size); }), fp_ts_1.state.chain(function (size) {
            return function_1.pipe(fp_ts_1.readonlyArray.makeBy(size, function_1.constant(arbitrary.arbitrary)), fp_ts_1.state.sequenceArray);
        })),
    };
}
exports.array = array;
function readonly(fa) {
    return function_1.unsafeCoerce(fa);
}
exports.readonly = readonly;
function mutable(fa) {
    return function_1.unsafeCoerce(fa);
}
exports.mutable = mutable;
function tuple() {
    var arbitraries = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arbitraries[_i] = arguments[_i];
    }
    return function_1.pipe(Apply_1.sequenceT(exports.Apply).apply(void 0, arbitraries));
}
exports.tuple = tuple;
function struct(struct) {
    return function_1.pipe(Apply_1.sequenceS(exports.Apply)(struct));
}
exports.struct = struct;
/**
 * @category Primitives
 */
exports.string = function_1.pipe(exports.character, array, exports.map(function (strings) { return strings.join(""); }));
/**
 * @category Primitives
 */
exports.boolean = {
    arbitrary: function_1.pipe(gen.uniform, fp_ts_1.state.map(function (seed) { return seed < 0.5; })),
};
