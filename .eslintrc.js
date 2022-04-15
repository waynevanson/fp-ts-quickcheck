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
  overrides: [
    {
      files: paths.tests,
      env: {
        jest: true,
      },
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
    },
    {
      files: ["src/**/*.ts"],
      excludedFiles: paths.tests,
      plugins: ["functional"],
      rules: {
        "functional/functional-parameters": 0,
      },
      extends: ["plugin:functional/recommended"],
    },
  ],
}
