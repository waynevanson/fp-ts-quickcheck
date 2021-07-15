/**
 * @summary
 * Runs a list of generators, with the option to configure size and the seed number if that's what your heart desires.
 *
 * @description
 *
 */
import { mkSeed } from "@no-day/fp-ts-lcg";
import { boolean as BL, console as Console, either as E, readonlyArray as A, task as T, taskEither as TE, } from "fp-ts";
import { constVoid, flow, identity, increment, pipe, tupled, unsafeCoerce, } from "fp-ts/lib/function";
import * as lens from "monocle-ts/Lens";
import * as ST from "./StateTask";
import { tailRecM } from "./utils";
export const incrementIndex = pipe(lens.id(), lens.prop("index"), lens.modify(increment), ST.modify);
export const withSeed = (seed) => pipe(lens.id(), lens.prop("seed"), lens.modify(() => seed), ST.modify);
export const incrementSuccess = pipe(lens.id(), lens.prop("successes"), lens.modify(increment), ST.modify);
export function appendFailure(failure) {
    return pipe(lens.id(), lens.prop("failures"), lens.modify(flow(A.append(failure), (a) => unsafeCoerce(a))), ST.modify);
}
export function makeFailure(data) {
    return pipe(ST.gets(pipe(lens.id(), lens.props("seed", "index")).get), ST.map((most) => (Object.assign(Object.assign({}, most), { data }))));
}
export const onFailure = (data) => pipe(ST.of(constVoid()), ST.chain(() => makeFailure(data)), ST.chain(appendFailure));
export const onSuccess = pipe(ST.of(constVoid()), ST.chainFirst(() => incrementSuccess));
export function runProperty(gen, property) {
    return pipe(gen, ST.fromState, ST.chainTask(flow(tupled(property), (property) => TE.tryCatch(property, identity))));
}
// call when we need to loop again
export const onRepeat = ({ property }, { arbitrary: gen }) => pipe(ST.gets((state) => ({ seed: state.seed, size: 10 })), ST.chainTask(runProperty(gen, property)), ST.map(([value, { seed }]) => ({ seed, value })), 
// use the new seed from the generator
ST.chainFirst(({ seed }) => withSeed(seed)), ST.chainFirst(() => incrementIndex), ST.chain(({ value }) => pipe(value, E.match(onFailure, () => onSuccess))));
export function quickCheck(options) {
    return (Arbitrary) => pipe(ST.of(constVoid()), 
    // this is where the work happens
    tailRecM(ST.Monad)(() => pipe(ST.gets((a) => a.index >= options.count), ST.chain(BL.matchW(() => pipe(onRepeat(options, Arbitrary), ST.map(E.left)), () => ST.of(E.right(constVoid())))))), 
    // initial state - seed should be random af on some other functions
    ST.executeTask({
        failures: A.zero(),
        index: 0,
        successes: 0,
        seed: mkSeed(options.initialSeed),
    }), T.chain(T.fromIOK(Console.log)));
}
// when an error happens we should advise what cooked up.
// show them the first. if they want more, require "verbose" flag in options
// that will show more than just the first test failed.
// if they want it looged in a file,
