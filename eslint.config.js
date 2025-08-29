// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // Enforce consistent import paths
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/store/kingdoms'],
              message: 'Import from @/store/kingdoms should be @/catalogs/kingdoms',
            },
          ],
        },
      ],
      // Warn about potentially problematic import patterns
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
    },
  },
  {
    default: 'array-simple', // enforces T[] by default
    readonly: 'generic', // but allows ReadonlyArray<T>
  },
]);
