module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@services(.*)$': '<rootDir>/src/services$1',
    '^@configs(.*)$': '<rootDir>/src/configs$1',
    '^@libs(.*)$': '<rootDir>/src/libs$1',
    '^@controllers(.*)$': '<rootDir>/src/controllers$1',
    '^@models(.*)$': '<rootDir>/src/models$1',
    '^@repositories(.*)$': '<rootDir>/src/repositories$1',
    '^@types(.*)$': '<rootDir>/src/types$1',
    '^@middlewares(.*)$': '<rootDir>/src/middlewares$1',
    '^@routes(.*)$': '<rootDir>/src/routes$1',
  },
};
