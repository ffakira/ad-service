/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testEnvironment: "node",
  testRegex: "./src/.*\\.(test|spec)?\\.(ts|ts)$",
  moduleFileExtensions: ["js", "ts"],
  roots: ["<rootDir>/src"],
};
