"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contramap = void 0;
var contramap = function (f) { return function (fa) { return ({
    coarbitrary: function (b) { return fa.coarbitrary(f(b)); },
}); }; };
exports.contramap = contramap;
