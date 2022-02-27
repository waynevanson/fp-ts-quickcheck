export interface Rose<A> {
  readonly leaf: A
  readonly roses: ReadonlyArray<Rose<A>>
}

// export const map: <A, B>(f: (a: A) => B) => (fa: Rose<A>) => Rose<B> =
//   (f) => (fa) => {

//   }
