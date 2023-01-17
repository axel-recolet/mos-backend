export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!main.(t|j)s',
    '!**/*.module.(t|j)s',
    '!**/*.input.(t|j)s',
    '!**/*.entity.(t|j)s',
    '!**/*.schema.(t|j)s',
    '!**/*.type.(t|j)s',
    '!**/configuration.ts',
    '!**/dto/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)': ['<rootDir>'],
    '^auth/(.*)': ['<rootDir>/modules/auth/$1'],
    '^storages/(.*)': ['<rootDir>/modules/storages/$1'],
    '^users/(.*)': ['<rootDir>/modules/users/$1'],
    '^utils/(.*)': ['<rootDir>/utils/$1'],
  },
};
