module.exports = {
  preset: '@react-native/jest-preset',

  // Don't treat files inside __mocks__ folders as test suites
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__mocks__/',
  ],

  // Map native modules that can't run under Jest to lightweight stubs
  moduleNameMapper: {
    // op-sqlite in-memory mock (already existed)
    '@op-engineering/op-sqlite':
      '<rootDir>/__tests__/__mocks__/@op-engineering/op-sqlite',

    // Stub out the native gradient & icon libraries so Jest doesn't choke
    // on their ESM / native code
    'react-native-linear-gradient':
      '<rootDir>/__tests__/__mocks__/react-native-linear-gradient',
  },

  // Allow Jest's Babel transformer to process these node_modules
  // (they ship ESM that Node / Jest can't parse by default)
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-linear-gradient|@notifee)/)',
  ],

  setupFiles: ['<rootDir>/jest.setup.js'],
};
