import { Config } from "@jest/types"
import * as paths from "./.config/paths"

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  watchPlugins: ["jest-runner-eslint/watch-fix"],
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
