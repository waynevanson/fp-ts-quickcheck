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
exports.perturb = exports.uniform = exports.next = exports.suchThat = exports.oneOf = exports.chooseInt = exports.seeded = exports.sized = exports.variant = exports.repeatable = exports.stated = exports.URI = void 0;
/**
 * @description
 * When researching how to create this library, there's definitely a lack of documentation on how the internals work.
 *
 * So a generator `Gen<A>` can functionally generate a value of `A`, given a `seed` and a `size`.
 * Some generators don't need these values, but `seed` is the most commonly used one.
 *
 * We use the `State` monad because it gives us a level of determinism that allows troubleshooting and shrinking of values.
 *
 * All values must be possibly generated by numbers, so we can use the seed or size parameters from the state.
 */
var lcg = __importStar(require("@no-day/fp-ts-lcg"));
var fp_ts_1 = require("fp-ts");
var function_1 = require("fp-ts/lib/function");
var lens = __importStar(require("monocle-ts/Lens"));
exports.URI = "Gen";
/**
 * @summary
 * State's `get` constructor but with `GenState` type applied.
 */
exports.stated = fp_ts_1.state.get();
function repeatable(kleisli) {
    return function_1.pipe(exports.stated, fp_ts_1.state.map(function (state) { return function_1.flow(kleisli, fp_ts_1.state.evaluate(state)); }), fp_ts_1.state.chainFirst(function () { return exports.next; }));
}
exports.repeatable = repeatable;
/**
 * @summary
 * Change the seed to a specific value, useful for shrinking and other
 * deterministic operations.
 *
 * @category Constructors
 */
function variant(seed) {
    return fp_ts_1.state.modify(function_1.pipe(lens.id(), lens.prop("seed"), lens.modify(function () { return lcg.mkSeed(seed); })));
}
exports.variant = variant;
/**
 * @summary
 * Get the size of the current generator.
 */
exports.sized = fp_ts_1.state.gets(function (state) { return state.size; });
exports.seeded = fp_ts_1.state.gets(function (state) { return lcg.unSeed(state.seed); });
/**
 * @summary
 * Select a randomly uniform integer betwee `min` and `max`. Also takes a bounded instance.
 *
 * This were to be called "range", but range should be applied to the seed or size
 *
 * @todo **note**: Normalize the value to a 32 bit integer.
 */
function chooseInt(min, max) {
    return function_1.pipe(exports.uniform, fp_ts_1.state.map(fp_ts_1.ord.clamp(fp_ts_1.number.Ord)(min, max)));
}
exports.chooseInt = chooseInt;
/**
 * @summary
 * From a `ReadonlyNonEmptyArray` of `Gen<A>`'s, randomly pick a generator.
 *
 * @category Combinators
 */
function oneOf(gens) {
    return function_1.pipe(chooseInt(0, fp_ts_1.readonlyArray.size(gens) - 1), 
    // index is always in range
    fp_ts_1.state.chain(function (index) { return gens[index]; }));
}
exports.oneOf = oneOf;
/**
 * @summary
 *
 * **Please note** that this may loop forever if the predicate never returns true.
 *
 * @todo Implement as stack safe.
 */
function suchThat(predicate) {
    return function (gen) {
        var self = function_1.pipe(gen, fp_ts_1.state.chain(function (a) { return (predicate(a) ? fp_ts_1.state.of(a) : self); }));
        return self;
    };
}
exports.suchThat = suchThat;
exports.next = fp_ts_1.state.modify(function_1.pipe(lens.id(), lens.prop("seed"), lens.modify(lcg.lcgNext)));
exports.uniform = function_1.pipe(exports.next, fp_ts_1.state.chain(function () { return exports.seeded; }));
/**
 * @summary
 * Modifies the seed using an LCG perturber
 */
function perturb(perturber) {
    return fp_ts_1.state.modify(function_1.pipe(lens.id(), lens.prop("seed"), lens.modify(lcg.lcgPertub(perturber))));
}
exports.perturb = perturb;
