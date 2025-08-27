// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],

  },
  {
    default: 'array-simple', // enforces T[] by default
    readonly: 'generic',     // but allows ReadonlyArray<T>
  },
]);
