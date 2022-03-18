const tsnode = require("ts-node")
tsnode.register()

const paths = require("./.config/paths")

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  excludedFiles: [".eslint*"],
  overrides: [
    {
      files: paths.tests.map((path) => `!${path}`),
      plugins: ["functional"],
      extends: ["plugin:functional/recommended", "plugin:functional/stylistic"],
    },
    {
      files: paths.tests,
      env: {
        jest: true,
      },
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
    },
  ],
}
