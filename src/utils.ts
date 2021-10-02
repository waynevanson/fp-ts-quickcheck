export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R
