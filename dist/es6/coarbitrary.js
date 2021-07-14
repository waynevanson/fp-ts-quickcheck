export const contramap = (f) => (fa) => ({
    coarbitrary: (b) => fa.coarbitrary(f(b)),
});
