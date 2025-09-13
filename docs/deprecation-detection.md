# Deprecation Detection Setup

## Overview

This project now has comprehensive deprecation detection using TypeScript ESLint's built-in `@typescript-eslint/no-deprecated` rule.

## How It Works

The `@typescript-eslint/no-deprecated` rule automatically detects:

- Deprecated TypeScript/JavaScript APIs (like `substr`, `componentWillMount`)
- Deprecated React Native APIs (like `blurOnSubmit`)
- Deprecated Expo APIs (like `manipulateAsync`, `MediaTypeOptions`)
- Any code marked with `@deprecated` JSDoc tags

## Configuration

### ESLint Configuration (`eslint.config.js`)

```javascript
{
  languageOptions: {
    parserOptions: {
      project: './tsconfig.json', // Required for type-aware rules
    },
  },
  rules: {
    '@typescript-eslint/no-deprecated': 'warn', // Detect deprecated APIs
  },
}
```

### Package Dependencies

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.43.0",
    "@typescript-eslint/parser": "^8.43.0"
  }
}
```

## Usage

### Run Deprecation Checks

```bash
# Check for deprecated APIs across the entire codebase
yarn lint

# Check specific files
yarn eslint src/expo-utils/image-handler.ts
```

### Current Deprecation Warnings Found

1. **`manipulateAsync`** - Fixed ✅ (migrated to new ImageManipulator API)
2. **`MediaTypeOptions`** - Needs migration to `MediaType` array
3. **`blurOnSubmit`** - Needs migration to `submitBehavior`
4. **`substr`** - Needs migration to `substring`

## Benefits

- **Proactive Detection**: Catches deprecated APIs before they break
- **Type-Aware**: Uses TypeScript's type system for accurate detection
- **Comprehensive**: Covers TypeScript, React Native, and Expo APIs
- **CI Integration**: Runs automatically in GitHub Actions
- **Developer Experience**: Shows warnings in IDE and terminal

## Integration with CI/CD

The deprecation detection runs automatically as part of:

- `yarn lint` (local development)
- GitHub Actions workflows
- Pre-commit hooks (if configured)

## Next Steps

1. Fix remaining deprecation warnings found by the linter
2. Consider upgrading to `error` level for stricter enforcement
3. Add custom deprecation patterns if needed
4. Set up pre-commit hooks to prevent new deprecations

## Resources

- [TypeScript ESLint Documentation](https://typescript-eslint.io/)
- [TypeScript ESLint Repository](https://github.com/typescript-eslint/typescript-eslint)
- [ESLint Type-Aware Linting Guide](https://typescript-eslint.io/getting-started/typed-linting)
