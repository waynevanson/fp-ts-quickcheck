"use strict";
/**
 * @summary
 * Runs a list of generators, with the option to configure size and the seed number if that's what your heart desires.
 *
 * @description
 *
 */
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
exports.quickCheck = exports.onRepeat = exports.runProperty = exports.onSuccess = exports.onFailure = exports.makeFailure = exports.appendFailure = exports.incrementSuccess = exports.withSeed = exports.incrementIndex = void 0;
var fp_ts_lcg_1 = require("@no-day/fp-ts-lcg");
var fp_ts_1 = require("fp-ts");
var function_1 = require("fp-ts/lib/function");
var lens = __importStar(require("monocle-ts/Lens"));
var ST = __importStar(require("./StateTask"));
var utils_1 = require("./utils");
exports.incrementIndex = function_1.pipe(lens.id(), lens.prop("index"), lens.modify(function_1.increment), ST.modify);
var withSeed = function (seed) {
    return function_1.pipe(lens.id(), lens.prop("seed"), lens.modify(function () { return seed; }), ST.modify);
};
exports.withSeed = withSeed;
exports.incrementSuccess = function_1.pipe(lens.id(), lens.prop("successes"), lens.modify(function_1.increment), ST.modify);
function appendFailure(failure) {
    return function_1.pipe(lens.id(), lens.prop("failures"), lens.modify(function_1.flow(fp_ts_1.readonlyArray.append(failure), function (a) { return function_1.unsafeCoerce(a); })), ST.modify);
}
exports.appendFailure = appendFailure;
function makeFailure(data) {
    return function_1.pipe(ST.gets(function_1.pipe(lens.id(), lens.props("seed", "index")).get), ST.map(function (most) { return (__assign(__assign({}, most), { data: data })); }));
}
exports.makeFailure = makeFailure;
var onFailure = function (data) {
    return function_1.pipe(ST.of(function_1.constVoid()), ST.chain(function () { return makeFailure(data); }), ST.chain(appendFailure));
};
exports.onFailure = onFailure;
exports.onSuccess = function_1.pipe(ST.of(function_1.constVoid()), ST.chainFirst(function () { return exports.incrementSuccess; }));
function runProperty(gen, property) {
    return function_1.pipe(gen, ST.fromState, ST.chainTask(function_1.flow(function_1.tupled(property), function (property) { return fp_ts_1.taskEither.tryCatch(property, function_1.identity); })));
}
exports.runProperty = runProperty;
// call when we need to loop again
var onRepeat = function (_a, _b) {
    var property = _a.property;
    var gen = _b.arbitrary;
    return function_1.pipe(ST.gets(function (state) { return ({ seed: state.seed, size: 10 }); }), ST.chainTask(runProperty(gen, property)), ST.map(function (_a) {
        var value = _a[0], seed = _a[1].seed;
        return ({ seed: seed, value: value });
    }), 
    // use the new seed from the generator
    ST.chainFirst(function (_a) {
        var seed = _a.seed;
        return exports.withSeed(seed);
    }), ST.chainFirst(function () { return exports.incrementIndex; }), ST.chain(function (_a) {
        var value = _a.value;
        return function_1.pipe(value, fp_ts_1.either.match(exports.onFailure, function () { return exports.onSuccess; }));
    }));
};
exports.onRepeat = onRepeat;
function quickCheck(options) {
    return function (Arbitrary) {
        return function_1.pipe(ST.of(function_1.constVoid()), 
        // this is where the work happens
        utils_1.tailRecM(ST.Monad)(function () {
            return function_1.pipe(ST.gets(function (a) { return a.index >= options.count; }), ST.chain(fp_ts_1.boolean.matchW(function () { return function_1.pipe(exports.onRepeat(options, Arbitrary), ST.map(fp_ts_1.either.left)); }, function () { return ST.of(fp_ts_1.either.right(function_1.constVoid())); })));
        }), 
        // initial state - seed should be random af on some other functions
        ST.executeTask({
            failures: fp_ts_1.readonlyArray.zero(),
            index: 0,
            successes: 0,
            seed: fp_ts_lcg_1.mkSeed(options.initialSeed),
        }), fp_ts_1.task.chain(fp_ts_1.task.fromIOK(fp_ts_1.console.log)));
    };
}
exports.quickCheck = quickCheck;
// when an error happens we should advise what cooked up.
// show them the first. if they want more, require "verbose" flag in options
// that will show more than just the first test failed.
// if they want it looged in a file,
