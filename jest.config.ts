import { Config } from "@jest/types"
import * as paths from "./.config/paths"

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  watchPlugins: ["jest-runner-eslint/watch-fix"],
  collectCoverage: true,
  // coverageThreshold: {
  //   global: { branches: 100, functions: 100, lines: 100, statements: 100 },
  // },
  roots: ["src"],
  projects: [
    {
      preset: "ts-jest",
      displayName: "unit",
      testMatch: paths.tests,
    },
    {
      runner: "jest-runner-eslint",
      displayName: "lint",
      roots: ["src"],
      testMatch: ["**/*.ts"],
    },
  ],
} as Config.InitialOptions
