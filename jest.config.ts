import { Config } from "@jest/types"
import * as paths from "./.config/paths"

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: paths.tests,
} as Config.InitialOptions
