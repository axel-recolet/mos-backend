import defaultJestConfig from '../jest.config';

export default {
  ...defaultJestConfig,
  rootDir: '..',
  testRegex: '.e2e-spec.ts$',
  testEnvironment: 'node',
};
