import { Config } from "@jest/types"
import * as paths from "../../.config/paths"

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["src"],
  displayName: "unit",
  testMatch: paths.tests,
} as Config.InitialProjectOptions
