module.exports = {
  testEnvironment: 'node',
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './html-report',
        filename: 'report.html',
        expand: true,
      },
    ],
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js',
    '!**/jest.config.js',
    '!**/firebaseConfig.ts',
    '!**/metro.config.js',
    '!**/src/resources/schema/**',
    '!**/src/tests/api/setup/**',
    '!**/src/navigation/AppContainer.tsx',
    '!**/html-report/**',
    '!**/jest-html-reporters-attach/**',
  ],
  setupFiles: ['./src/tests/setupJest.js'],
};
