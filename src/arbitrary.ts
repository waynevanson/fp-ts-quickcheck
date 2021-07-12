export interface GenState {
  seed: number;
  // size >= 0
  size: number;
}

export interface Gen<A> {
  (s: GenState): [A, GenState];
}

export interface Arbitrary<A> {
  arbitrary: Gen<A>;
}

export const number = (min: number, max: number): Arbitrary<number> => ({
  // does the seed stay the same?
  // like what is the seed?
  arbitrary: (s) => [s.size, s],
});

export interface Ranged<A> {
  min: A;
  max: A;
}
