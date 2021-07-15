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
exports.boolean = exports.string = exports.character = exports.number = exports.struct = exports.tuple = exports.mutable = exports.readonly = exports.array = exports.fromGen = exports.Applicative = exports.Apply = exports.Functor = exports.Pointed = exports.chain = exports.ap = exports.map = exports.of = exports.URI = void 0;
/**
 * @summary
 * The `Arbitrary` typeclass represents a value that can be generated.
 */
var fp_ts_1 = require("fp-ts");
var Apply_1 = require("fp-ts/lib/Apply");
var function_1 = require("fp-ts/lib/function");
var gen = __importStar(require("./gen"));
/**
 * @category Model
 */
exports.URI = "Arbitrary";
// PIPEABLES
/**
 * @category Pointed
 */
var of = function (a) { return ({ arbitrary: fp_ts_1.state.of(a) }); };
exports.of = of;
/**
 * @category Functor
 */
var map = function (f) { return function (fa) { return ({ arbitrary: function_1.pipe(fa.arbitrary, fp_ts_1.state.map(f)) }); }; };
exports.map = map;
/**
 * @category Apply
 */
var ap = function (fa) { return function (fab) { return ({
    arbitrary: function_1.pipe(fab.arbitrary, fp_ts_1.state.ap(fa.arbitrary)),
}); }; };
exports.ap = ap;
/**
 * @category Chain
 */
var chain = function (f) { return function (fa) { return ({
    arbitrary: function_1.pipe(fa.arbitrary, fp_ts_1.state.chain(function_1.flow(f, function (b) { return b.arbitrary; }))),
}); }; };
exports.chain = chain;
// INSTANCES
/**
 * @category Typeclasses
 */
exports.Pointed = { URI: exports.URI, of: exports.of };
/**
 * @category Typeclasses
 */
exports.Functor = { URI: exports.URI, map: function (fa, f) { return exports.map(f)(fa); } };
/**
 * @category Typeclasses
 */
exports.Apply = __assign(__assign({}, exports.Functor), { ap: function (fab, fa) { return exports.ap(fa)(fab); } });
/**
 * @category Typeclasses
 */
exports.Applicative = __assign(__assign({}, exports.Pointed), exports.Apply);
// CONSTRUCTORS
/**
 * @summary
 * Lift a generator into the `Arbitrary` typeclass.
 *
 * @category Constructors
 */
function fromGen(gen) {
    return { arbitrary: gen };
}
exports.fromGen = fromGen;
// COMBINATORS
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
/**
 * @category Combinators
 */
exports.readonly = function_1.unsafeCoerce;
/**
 * @summary
 * Removes the `Readonly` constraint from the value within an `Arbitrary` instance.
 *
 * @category Combinators
 */
exports.mutable = function_1.unsafeCoerce;
/**
 * @category Combinators
 */
function tuple() {
    var arbitraries = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arbitraries[_i] = arguments[_i];
    }
    return function_1.pipe(Apply_1.sequenceT(exports.Apply).apply(void 0, arbitraries));
}
exports.tuple = tuple;
/**
 * @category Combinators
 */
function struct(struct) {
    return Apply_1.sequenceS(exports.Apply)(struct);
}
exports.struct = struct;
//PRIMITIVES
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
 * @category Primitives
 * @todo Would you prefer stricter typing with the `Char` type?
 */
exports.character = {
    arbitrary: function_1.pipe(gen.chooseInt(0, 65536), fp_ts_1.state.map(function (a) { return String.fromCharCode(a); })),
};
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
