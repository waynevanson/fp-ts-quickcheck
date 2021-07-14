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
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainTask = exports.fromState = exports.fromTask = exports.modify = exports.Do = exports.bind = exports.chainFirstW = exports.chainFirst = exports.gets = exports.get = exports.executeTask = exports.Monad = exports.Chain = exports.Apply = exports.Functor = exports.Pointed = exports.chain = exports.ap = exports.map = exports.of = exports.URI = void 0;
var fp_ts_1 = require("fp-ts");
var function_1 = require("fp-ts/lib/function");
exports.URI = "StateTask";
exports.of = fp_ts_1.stateT.of(fp_ts_1.task.Pointed);
exports.map = fp_ts_1.stateT.map(fp_ts_1.task.Functor);
exports.ap = fp_ts_1.stateT.ap(fp_ts_1.task.Chain);
exports.chain = fp_ts_1.stateT.chain(fp_ts_1.task.Chain);
exports.Pointed = { URI: exports.URI, of: exports.of };
exports.Functor = { URI: exports.URI, map: function (fa, f) { return exports.map(f)(fa); } };
exports.Apply = __assign(__assign({}, exports.Functor), { ap: function (fab, fa) { return exports.ap(fa)(fab); } });
exports.Chain = __assign(__assign({}, exports.Apply), { chain: function (fa, f) { return exports.chain(f)(fa); } });
exports.Monad = __assign(__assign({}, exports.Pointed), exports.Chain);
function executeTask(s) {
    return function (fa) {
        return function_1.pipe(fa(s), fp_ts_1.task.map(function (as) { return as[1]; }));
    };
}
exports.executeTask = executeTask;
function get() {
    return function (s) { return fp_ts_1.task.of([s, s]); };
}
exports.get = get;
function gets(f) {
    return function (s) { return fp_ts_1.task.of([f(s), s]); };
}
exports.gets = gets;
exports.chainFirst = fp_ts_1.chain.chainFirst(exports.Chain);
exports.chainFirstW = fp_ts_1.chain.chainFirst(exports.Chain);
exports.bind = fp_ts_1.chain.bind(exports.Chain);
exports.Do = exports.of({});
function modify(f) {
    return function (s) { return fp_ts_1.task.of([function_1.constVoid(), f(s)]); };
}
exports.modify = modify;
exports.fromTask = fp_ts_1.stateT.fromF(fp_ts_1.task.Functor);
exports.fromState = fp_ts_1.stateT.fromState(fp_ts_1.task.Pointed);
var chainTask = function (f) {
    return function (fa) {
        return function_1.pipe(fa, exports.chain(function (a) { return exports.fromTask(f(a)); }));
    };
};
exports.chainTask = chainTask;
