import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'fs';
const { compilerOptions } = JSON.parse(readFileSync('tsconfig.json', 'utf-8'));

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.(e2e-)?spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest'],
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/main.(t|j)s',
    '!**/index.(t|j)s',
    '!**/*.module.(t|j)s',
    '!**/*.input.(t|j)s',
    '!**/*.entity.(t|j)s',
    '!**/*.schema.(t|j)s',
    '!**/*.model.(t|j)s',
    '!**/*.type.(t|j)s',
    '!**/*.fake.(t|j)s',
    '!**/configuration.ts',
    '!**/dto/*.(t|j)s',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  maxWorkers: '50%',
  detectLeaks: false,
};
