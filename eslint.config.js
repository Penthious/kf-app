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
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/array-type': 'off',
      'import/no-named-as-default': 'off',
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
    },
  },
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/__tests__/**/*.{ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'import/first': 'off',
      'react/display-name': 'off',
    },
  },
]);
