const tsnode = require("ts-node")
tsnode.register()

const paths = require("./.config/paths")

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "prettier", "unused-imports"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "unused-imports/no-unused-imports": 1,
  },
  overrides: [
    {
      files: paths.tests,
      env: {
        jest: true,
      },
      rules: {
        "jest/valid-title": 0,
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
        "functional/no-mixed-type": 0,
      },
      extends: ["plugin:functional/recommended"],
    },
  ],
}
