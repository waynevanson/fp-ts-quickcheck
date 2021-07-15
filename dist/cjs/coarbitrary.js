"use strict";
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
exports.func = exports.either = exports.option = exports.boolean = exports.ordering = exports.contramap = exports.URI = void 0;
/**
 * Basically the module creates a deterministic seed given by type `<A>`,
 * which can then be used to create
 */
var fp_ts_1 = require("fp-ts");
var function_1 = require("fp-ts/lib/function");
var gen = __importStar(require("./gen"));
/**
 * @category Model
 */
exports.URI = "Coarbitrary";
// PIPEABLES
/**
 * @category Contravariant
 */
var contramap = function (f) { return function (fa) { return ({
    coarbitrary: function (b) { return fa.coarbitrary(f(b)); },
}); }; };
exports.contramap = contramap;
exports.ordering = {
    coarbitrary: function (ordering) {
        return gen.chainFirst(function () {
            return gen.variant(ordering === 1 ? 0 : ordering === 0 ? 1 : 2);
        });
    },
};
exports.boolean = {
    coarbitrary: function (bool) { return gen.chainFirst(function () { return gen.variant(bool ? 1 : 0); }); },
};
function option(fa) {
    return {
        coarbitrary: fp_ts_1.option.fold(function () { return gen.chainFirst(function () { return gen.variant(0); }); }, function (a) {
            return function_1.flow(fa.coarbitrary(a), gen.chainFirst(function () { return gen.variant(1); }));
        }),
    };
}
exports.option = option;
function either(fe, fa) {
    return {
        coarbitrary: fp_ts_1.either.fold(function (e) {
            return function_1.flow(fe.coarbitrary(e), gen.chainFirst(function () { return gen.variant(0); }));
        }, function (a) {
            return function_1.flow(fa.coarbitrary(a), gen.chainFirst(function () { return gen.variant(1); }));
        }),
    };
}
exports.either = either;
function func(ge, fa) {
    return {
        coarbitrary: function (fea) { return function (fr) {
            return function_1.pipe(ge.arbitrary, gen.map(fea), gen.chain(function (a) { return function_1.pipe(fr, fa.coarbitrary(a)); }));
        }; },
    };
}
exports.func = func;
