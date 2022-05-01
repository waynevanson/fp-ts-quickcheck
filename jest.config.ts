import { Config } from "@jest/types"
import * as paths from "./.config/paths"

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  watchPlugins: ["jest-runner-eslint/watch-fix", "jest-watch-select-projects"],
  projects: [
    "<rootDir>/packages/*",
    {
      runner: "jest-runner-eslint",
      displayName: "lint",
      roots: ["packages"],
      testMatch: ["**/*.ts"],
    },
  ],
} as Config.InitialOptions
