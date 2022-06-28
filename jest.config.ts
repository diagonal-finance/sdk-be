/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["jest-extended/all"],
    // TODO: Disable temporally metadata tests due to requiring postgres
    modulePathIgnorePatterns: ["/dist/", "/types/"],
    // TODO: Remove this when tests are separated to unit and integration tests
    maxConcurrency: 1,
    maxWorkers: 1,
    testTimeout: 50000,
    collectCoverage: true,
    coveragePathIgnorePatterns: ["/dist/", "/__mocks__/"],
    verbose: true,
    testRegex: "/.*.test.ts$",
};
export default config;
