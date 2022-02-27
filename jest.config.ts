import { Config } from "@jest/types"

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
} as Config.InitialOptions
