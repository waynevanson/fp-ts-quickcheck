import {
  readonlyArray,
  io,
  console,
  readonlyNonEmptyArray,
  option,
  string,
} from "fp-ts/lib/index.js"
import { pipe, flow, constant } from "fp-ts/lib/function.js"
import { default as micromatch } from "micromatch"

export default (allFiles) =>
  pipe(
    micromatch(allFiles, "*.ts"),
    readonlyNonEmptyArray.fromArray,
    option.map((tsfiles) =>
      pipe(
        [
          "eslint --cache --fix",
          "prettier --write",
          "jest --selectProjects --passWithNoTests",
        ],
        readonlyArray.map((string) => string.split(" ")),
        readonlyArray.map(readonlyArray.alt(constant(tsfiles))),
        readonlyArray.map(readonlyArray.intersperse(" ")),
        readonlyArray.map(readonlyArray.foldMap(string.Monoid)((a) => a)),
        readonlyArray.append("pnpm run docs"),
        readonlyArray.append("git add ."),
      ),
    ),
    option.getOrElse(readonlyArray.zero),
  )
