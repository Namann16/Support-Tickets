export default {
    transform: {
      '^.+\\.js$': 'babel-jest', // transform JS files using babel-jest
    },
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.js'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1', // remove .js extension for imports
    },
  };
  