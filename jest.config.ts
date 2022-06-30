/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["jest-extended/all"],
    modulePathIgnorePatterns: ["/dist/", "/types/"],
    collectCoverage: true,
    coveragePathIgnorePatterns: ["/dist/", "/__mocks__/"],
    verbose: true,
    testRegex: "/.*.test.ts$",
    moduleDirectories: ["node_modules", "src"],
    roots: ["<rootDir>"],
    modulePaths: ["<rootDir>"],
};
export default config;
