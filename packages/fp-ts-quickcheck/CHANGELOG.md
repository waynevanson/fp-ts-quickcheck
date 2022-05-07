# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.8.0](https://github.com/waynevanson/fp-ts-test/compare/v0.7.0...v0.8.0) (2022-05-07)


### ⚠ BREAKING CHANGES

* **testable:** `sync` and `async` are now exported from `Testable`. Delegates the exceptions
elsewhere

### Features

* **arbitrary:** add `intersect` ([517e64e](https://github.com/waynevanson/fp-ts-test/commit/517e64ed18e7466ff2aadef5b808601e39eb5b2c))
* **shrink:** use dichotomy for array indexes ([2549cf2](https://github.com/waynevanson/fp-ts-test/commit/2549cf2575c584aa619745dc99bb371b911deefd))
* **testable:** `Testable` is a function instead of a struct with property `test` ([aadbe5d](https://github.com/waynevanson/fp-ts-test/commit/aadbe5d8ef3ec0ae21417197c6e7a731b3c9d38a))
* **testable:** add better result type for testable ([f94fdbc](https://github.com/waynevanson/fp-ts-test/commit/f94fdbc9a7603f8b0960095fa6406b7ddb556abf))


### Bug Fixes

* **testable:** fix borken tests and bad testable.boolean ([42701b4](https://github.com/waynevanson/fp-ts-test/commit/42701b463bbb479d281755d72834ab8f3898a84e))
