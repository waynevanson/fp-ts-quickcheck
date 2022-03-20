const tsnode = require("ts-node")
tsnode.register()

const paths = require("./.config/paths")
const main = {
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
}

module.exports = {
  ...main,
  overrides: [
    {
      ...main,
      files: paths.tests.map((path) => `!${path}`),
      plugins: ["functional"].concat(main.plugins),
      extends: [
        "plugin:functional/recommended",
        "plugin:functional/stylistic",
      ].concat(main.extends),
    },
    {
      ...main,
      files: paths.tests,
      env: {
        jest: true,
      },
      plugins: ["jest"].concat(main.plugins),
      extends: ["plugin:jest/recommended"].concat(main.extends),
    },
  ],
}

console.log(module.exports)
