# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.7.0](https://github.com/waynevanson/fp-ts-test/compare/v0.6.0...v0.7.0) (2022-05-01)


### ⚠ BREAKING CHANGES

* **coarbitrary:** `coarbitrary` is no longer exported from the thing.

### Features

* **arbitrary:** add `from` and `fromK` ([8d03475](https://github.com/waynevanson/fp-ts-test/commit/8d034751aadca7a7729c426d6d7c7e0ab26da928))
* **arbitrary:** add `mk` and `fromShrink` ([45604ee](https://github.com/waynevanson/fp-ts-test/commit/45604eec68055ab99ae256a655c71042f7bb6304))
* **arbitrary:** add new signature ([a31dfa5](https://github.com/waynevanson/fp-ts-test/commit/a31dfa51d10806e045d613255c9308e42dc4bdda))
* e ([65621cd](https://github.com/waynevanson/fp-ts-test/commit/65621cd1db430af8bb0cc592ad95cdcf2db3c2da))
* export `shrink` from entrypoint ([25c203f](https://github.com/waynevanson/fp-ts-test/commit/25c203fe263742584245343a3cc73bbe5fcafc03))
* **gen:** add `lazy` ([f766150](https://github.com/waynevanson/fp-ts-test/commit/f7661507fcd762af9e8d56dfab1a8b6e37f90776))
* **gen:** add `union` ([8c58bd4](https://github.com/waynevanson/fp-ts-test/commit/8c58bd4e7f46f1d637d823a53e92d9f575630837))
* **gen:** constrain `of` to `Gen` ([2174068](https://github.com/waynevanson/fp-ts-test/commit/2174068787223c5d9648905dd5b75df8bf944360))
* **gen:** constrain gen `map` and `ap` outputs to be `Gen` ([92fd85c](https://github.com/waynevanson/fp-ts-test/commit/92fd85cd3e3df4bad2654c37763bc7128d850f64))
* **iterable:** add `bind` and `bindTo` ([b6c0b35](https://github.com/waynevanson/fp-ts-test/commit/b6c0b356f65b3ef00902312a93164a3f03e26b7a))
* **shink:** add `lazy` ([f552256](https://github.com/waynevanson/fp-ts-test/commit/f552256531c050d787c89658004174ebbb9f5cfb))
* **shrink:** add `alt` ([8900ef7](https://github.com/waynevanson/fp-ts-test/commit/8900ef7e8f4491f044c1d0b73e89b0fbf9caac4b))
* **shrink:** add `boolean` ([b0f3b47](https://github.com/waynevanson/fp-ts-test/commit/b0f3b47cc0b61b3bccd79c5e817e27c0671fdd72))
* **shrink:** add `boolean` ([c8fc166](https://github.com/waynevanson/fp-ts-test/commit/c8fc1667e45245b3b41020d46e97ea6641180916))
* **shrink:** add `char` ([36194d7](https://github.com/waynevanson/fp-ts-test/commit/36194d79496482db38c0f06d99a26cad5b48dfb1))
* **shrink:** add `fromGen` and `fromGenK` ([be16062](https://github.com/waynevanson/fp-ts-test/commit/be160627ab6c1e6795674506c6e27cded76a6616))
* **shrink:** add `fromIterable` ([31b3f93](https://github.com/waynevanson/fp-ts-test/commit/31b3f931b46869ce68ef10d9aa40ac961abd08ea))
* **shrink:** add `int` ([cd19862](https://github.com/waynevanson/fp-ts-test/commit/cd198629ceeb59b9df2cd2db9f3efe73ac25bd21))
* **shrink:** add `integer` ([fc5ea1b](https://github.com/waynevanson/fp-ts-test/commit/fc5ea1b18443dd8871f770eff8154f6cf36a3a05))
* **shrink:** add `partial` ([5648854](https://github.com/waynevanson/fp-ts-test/commit/5648854ea5cb765ae5ec5272e6bdf1de0196bb45))
* **shrink:** add `string` ([5423e94](https://github.com/waynevanson/fp-ts-test/commit/5423e9450e6ba25b61ce0a0d2427bb3063f22e24))
* **shrink:** add `struct` ([f312fc4](https://github.com/waynevanson/fp-ts-test/commit/f312fc45e38dd4d7b6ab8a35e78441f272c52277))
* **shrink:** rename `recursiveWhile` to `recursive` ([9bb94a7](https://github.com/waynevanson/fp-ts-test/commit/9bb94a7acd464058ecad8c7b51c25f557aacca53))


### Bug Fixes

* **arbitrary:** `char` and `string` now shrink ([1f99d5e](https://github.com/waynevanson/fp-ts-test/commit/1f99d5eea5e9fcbbf9f14897ffb763ceafd96234))
* **arbitrary:** `filter` correctly filters branches ([bdb17ed](https://github.com/waynevanson/fp-ts-test/commit/bdb17ed20d7d1e1ba4cc1223244baf163aec5daf))
* **arbitrary:** import `EnforceNonEmptyRecord` ([8fc3669](https://github.com/waynevanson/fp-ts-test/commit/8fc36694cf683ca11a1d801a7aac102fb0b55858))
* **arbitrary:** remove `float` ([5f3aa82](https://github.com/waynevanson/fp-ts-test/commit/5f3aa8226f90d2d0fd786a3ce77d92bf7386824a))
* **coarbitrary:** use new Arbitrary type ([30aed11](https://github.com/waynevanson/fp-ts-test/commit/30aed11389208663cd95311f88c5e664a5e033ea))
* fix array shrink ([6aa80d3](https://github.com/waynevanson/fp-ts-test/commit/6aa80d3a76ffe1c38573d5fdfbdc6ff01b60f3ae))
* **fp-ts:** use bugfix from fp-ts for it's internals so `traversal` works as expected ([b780e49](https://github.com/waynevanson/fp-ts-test/commit/b780e49659a8dd68683fac55f920610fe70f3d64))
* **gen:** `filter` now matches when predicate returns true ([6582d86](https://github.com/waynevanson/fp-ts-test/commit/6582d861ece0c91bbe1313336e5f7bac6f38100d))
* **shrink:** `char` conditionally uses `""` when shrinking ([f2e3d0d](https://github.com/waynevanson/fp-ts-test/commit/f2e3d0d050150b6934c5633435997bb56e7e3848))
* **shrink:** move empty string handler from `char` to `string` ([daea37d](https://github.com/waynevanson/fp-ts-test/commit/daea37d200c5acefd8f62fee307480a8efc455be))
* **shrink:** shrink to zero when the array is empty ([90850d8](https://github.com/waynevanson/fp-ts-test/commit/90850d841b16f7d3ef9a22727955894d8073d885))
* **utils:** `rightDichotomy` now works on negative numbers without going in a loop ([78dd407](https://github.com/waynevanson/fp-ts-test/commit/78dd407c9ab6a1610eca932d4127cf2c192345a3))


### revert

* **coarbitrary:** remove `coarbitrary` and its exports ([eb6ece8](https://github.com/waynevanson/fp-ts-test/commit/eb6ece84f8201d41dcfaf295880b2de0e86741eb))

## [0.6.0](https://github.com/waynevanson/fp-ts-test/compare/v0.5.0...v0.6.0) (2022-04-16)


### ⚠ BREAKING CHANGES

* Added in the type signature for `shrink`. It's an empty implementation at the moment and shrinking is currently not used.

### Features

* add impl for boolean ([509eb23](https://github.com/waynevanson/fp-ts-test/commit/509eb23d3fdb00dcb5c743b4da36af44534018f2))
* add impl for boolean ([4f2cbca](https://github.com/waynevanson/fp-ts-test/commit/4f2cbca9748bfb5c965eafe049be95d8d9e2c7be))
* add shrink to arbitrary ([1b35997](https://github.com/waynevanson/fp-ts-test/commit/1b35997cb0c9b38bd7cece2836ebbe431a46f45a))
* add shrinkable in some implementations ([25c1d2a](https://github.com/waynevanson/fp-ts-test/commit/25c1d2ab4ac899c3502826509117ea4fc9a2b00f))
* **arbitrary:** add shrink to int ([880e8f9](https://github.com/waynevanson/fp-ts-test/commit/880e8f93afe7c9e15f795c1e4cc38dcf678e9984))
* **iterable:** add every ([a14c792](https://github.com/waynevanson/fp-ts-test/commit/a14c792a7b9b5d9fd738091b087cc7df2894fa47))
* **iterable:** add iterate ([7f9f759](https://github.com/waynevanson/fp-ts-test/commit/7f9f759f921cd7f9e7bbf84d81a94c2fdffd9b19))
* **shrinkable:** add `Shrinkable` to entry point ([a87f854](https://github.com/waynevanson/fp-ts-test/commit/a87f854d08da7e1c5aef12ad11637472c1a6d2e0))
* **util:** add quot ([51fa02f](https://github.com/waynevanson/fp-ts-test/commit/51fa02f27178445bb003d11ccfc3a1bfc78c3f81))
* **util:** add rightDichotomy ([862d439](https://github.com/waynevanson/fp-ts-test/commit/862d43962a713d3b3476ece14449f24cbd2b4eca))


### Bug Fixes

* add perf improvement to partial.shrink ([e0a97dd](https://github.com/waynevanson/fp-ts-test/commit/e0a97dd8dca975667dc8f2039dbb3f8ef5ea86c5))
* iterable.skip counts indicies correctly ([a1f4292](https://github.com/waynevanson/fp-ts-test/commit/a1f429248f0e25da2f4d2372d95454a9e1c11a80))

## [0.5.0](https://github.com/waynevanson/fp-ts-test/compare/v0.4.0...v0.5.0) (2022-04-15)


### ⚠ BREAKING CHANGES

* Removed number, use `int()` instead.

### Features

* add `stringNonempty` ([236678e](https://github.com/waynevanson/fp-ts-test/commit/236678e209805dfa7df718c144a637c9c93579e7))
* add float ([a775dc9](https://github.com/waynevanson/fp-ts-test/commit/a775dc9f8a11fdb0da10cfe5e9b1f4c94ce7958b))
* add nullable ([e9b1adc](https://github.com/waynevanson/fp-ts-test/commit/e9b1adc380e73ee16797443613a4025c7e917e82))
* add partial ([30aaf26](https://github.com/waynevanson/fp-ts-test/commit/30aaf2626ee648e8f616b615564f4328c219b0e0))
* add Testable2 interface ([0189139](https://github.com/waynevanson/fp-ts-test/commit/01891394779b04533df37bb8ab1b714d96925835))
* lots of great stuff ([cdb85f1](https://github.com/waynevanson/fp-ts-test/commit/cdb85f105ef45a5ab6f3af705f5fa1c4d010b905))
* make into options optional ([02511b0](https://github.com/waynevanson/fp-ts-test/commit/02511b0de716143d76f46bb4e38f0b87042c9e18))
* remove number primitive ([bc90a95](https://github.com/waynevanson/fp-ts-test/commit/bc90a95ca7b9295ef7bfe21bd602e1d5de352403))
* rename make-assert to assert ([28f5ad6](https://github.com/waynevanson/fp-ts-test/commit/28f5ad6dde5bdb92366e72daba1ee0a86ed5b11c))

## [0.4.0](https://github.com/waynevanson/fp-ts-test/compare/v0.3.2...v0.4.0) (2022-03-23)


### ⚠ BREAKING CHANGES

* These now take options for extensiblity and performance

### Features

* add toGen ([26ca34e](https://github.com/waynevanson/fp-ts-test/commit/26ca34eeaf49420f8258dad14d36f99b36729a9e))
* use options for character and string ([cd350a7](https://github.com/waynevanson/fp-ts-test/commit/cd350a77bdb3f921da3851c5e3ac44de99487f05))

### [0.3.2](https://github.com/waynevanson/fp-ts-test/compare/v0.3.1...v0.3.2) (2022-03-21)


### Features

* add Chain instance ([df31c73](https://github.com/waynevanson/fp-ts-test/commit/df31c732db766f0c3c312122eb2f31ea3d9d8c0d))
* add lazy arbitrary ([b1fcd4b](https://github.com/waynevanson/fp-ts-test/commit/b1fcd4b15bcb67218ae6becb0157cf6cbb2ba33a))

### [0.3.1](https://github.com/waynevanson/fp-ts-test/compare/v0.3.0...v0.3.1) (2022-03-13)


### Features

* add union combinator ([4da2d2b](https://github.com/waynevanson/fp-ts-test/commit/4da2d2b41c750842de2b754c3de8eb6a66a5ed48))

## 0.3.0 (2022-03-13)


### ⚠ BREAKING CHANGES

* rename `assert` to  `assertTask`
* remove ChainRecTask from Quickcheck module

### Features

*  remove currying from makeAssert ([920e4fe](https://github.com/waynevanson/fp-ts-test/commit/920e4fe442f4a0a0f26f6e2fb1937703a9045618))
* add `unsafeAssertSync` ([f09f379](https://github.com/waynevanson/fp-ts-test/commit/f09f3794f45253086bcccca9cfa1e6a9e07195ed))
* add 0.1.0 version flag ([5081a15](https://github.com/waynevanson/fp-ts-test/commit/5081a1536115736782be653141b479800b1bf35a))
* add assert ([253f793](https://github.com/waynevanson/fp-ts-test/commit/253f79371a86c5a341f2825a1b23e66ff7d5e5d9))
* add better testable module ([f182a33](https://github.com/waynevanson/fp-ts-test/commit/f182a333d2b8f729d45c19ebc953e853840b2c6f))
* add bind, Do and chainFirst to Gen ([4572cac](https://github.com/waynevanson/fp-ts-test/commit/4572cac0d0957cb388ea7f2127c18cfc6d1b2104))
* add Corbitrary docs and combinators ([ea2c3c9](https://github.com/waynevanson/fp-ts-test/commit/ea2c3c97ca16b93d38be27c3f9ac8d4e999879ee))
* add filter to arbitrary ([1181210](https://github.com/waynevanson/fp-ts-test/commit/1181210476615c5e59ef02125ac6e7a273a55887))
* add handle and assert ([489e579](https://github.com/waynevanson/fp-ts-test/commit/489e57928206697dff9ae1ffb59d019837e7a197))
* add nextSeed to generators ([0e736dd](https://github.com/waynevanson/fp-ts-test/commit/0e736dd011d2565777d56fa1eb51d02cd9ef53ab))
* add testable assertion to catch most types ([b0ce880](https://github.com/waynevanson/fp-ts-test/commit/b0ce8805695e0acc62eb1d94f4dff9acf8cfe0ac))
* add testable assertionAsync ([5ed5396](https://github.com/waynevanson/fp-ts-test/commit/5ed5396ff03d159e9e6292a78ce4df67fb059000))
* add unsafeAssertAsync ([ac09d3f](https://github.com/waynevanson/fp-ts-test/commit/ac09d3f4208d2ddb4c73a27fd2a700bb8cbdc45a))
* adds lots of stuff ([3b52f17](https://github.com/waynevanson/fp-ts-test/commit/3b52f1744756232f4e80f57b300edd3af3c2e009))
* build packages ([803a3f4](https://github.com/waynevanson/fp-ts-test/commit/803a3f4a23ed25688fb9be0806ecd4d990cc3e0e))
* increase default count to 100 ([15d3ab5](https://github.com/waynevanson/fp-ts-test/commit/15d3ab5b7e26992d322807b0fa88af215e83c05e))
* StateTask ([bd2c823](https://github.com/waynevanson/fp-ts-test/commit/bd2c8234ac959838b36cb10a8ac99137dc6e4a27))
* testable requires only one HKT ([2170fc3](https://github.com/waynevanson/fp-ts-test/commit/2170fc3aa2283c96e636d8975a09167bf09e942f))


### Bug Fixes

* add implementation to filter ([f39f471](https://github.com/waynevanson/fp-ts-test/commit/f39f4719ffc0cf638a89f3497df5e8968700e32d))
* add version ([797964e](https://github.com/waynevanson/fp-ts-test/commit/797964e6ebd4939171f27ddf2a10e5dc53ba7831))
* call property in main for assertion testable ([0951517](https://github.com/waynevanson/fp-ts-test/commit/0951517a039359d214dc498f1cbfbe73eef718f1))
* export all from index ([38585b0](https://github.com/waynevanson/fp-ts-test/commit/38585b05f0bfd64ef69a5c990928e65fb43f6de5))
* remove need for peerDependencies ([80aa300](https://github.com/waynevanson/fp-ts-test/commit/80aa30079869e294fd37f689fa02b1f1b923b1dd))
* use correct path for type declarations ([b8a961f](https://github.com/waynevanson/fp-ts-test/commit/b8a961f32ae31163358acd1291c85fdd6f94db04))


* remove ChainRecTask from Quickcheck module ([6256c91](https://github.com/waynevanson/fp-ts-test/commit/6256c91946cf38472c2a45e4c6cff30b33c52d1f))
* rename `assert` to  `assertTask` ([7808487](https://github.com/waynevanson/fp-ts-test/commit/7808487badf15cfcc922f2f68f67ebae7e3dc970))
