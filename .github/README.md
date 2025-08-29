# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD, testing, and deployment.

## Workflows Overview

### 🔄 **CI** (`ci.yml`)

**Triggers:** Push to main/develop, Pull Requests
**Purpose:** Core continuous integration pipeline

**Jobs:**

- **Test Matrix**: Runs on Node.js 18.x and 20.x
  - ✅ Prettier formatting check
  - ✅ TypeScript type checking
  - ✅ Unit tests (Vitest)
  - ✅ UI tests (Jest)
  - ✅ ESLint linting
  - 📊 Test coverage upload to Codecov

- **Security**: Dependency security checks
  - 🔒 Security audit (`yarn audit`)
  - 📦 Outdated dependency check

- **Build**: Project build verification
  - 🏗️ Build process validation
  - 📏 Bundle size monitoring

### 🔍 **Dependency Review** (`dependency-review.yml`)

**Triggers:** Pull Requests
**Purpose:** Automated security review of dependencies

### 🤖 **Dependabot Auto-merge** (`dependabot.yml`)

**Triggers:** Dependabot PRs
**Purpose:** Automated merging of safe dependency updates

### 📊 **Code Quality** (`code-quality.yml`)

**Triggers:** Push to main/develop, Pull Requests
**Purpose:** SonarCloud integration for code quality analysis

### 🚀 **Release** (`release.yml`)

**Triggers:** Version tags (v\*)
**Purpose:** Automated release creation with changelog

### 📱 **Expo Build** (`expo-build.yml`)

**Triggers:** Push to main, Version tags
**Purpose:** Mobile app builds for iOS and Android

## Configuration Files

### Dependabot (`dependabot.yml`)

- **Schedule**: Weekly updates on Monday at 9:00 AM
- **Scope**: npm dependencies only
- **Auto-assign**: @Penthious
- **Labels**: dependencies, automated
- **Ignored**: Major version updates for critical packages (React, Expo, etc.)

## Required Secrets

To use all workflows, you'll need to set up these repository secrets:

### Essential

- `GITHUB_TOKEN` (automatically provided)

### Optional (for enhanced features)

- `EXPO_TOKEN` - Expo access token for builds
- `SONAR_TOKEN` - SonarCloud access token
- `CODECOV_TOKEN` - Codecov access token (if using private coverage)

## Setup Instructions

1. **Enable GitHub Actions** in your repository settings
2. **Set up secrets** in Settings → Secrets and variables → Actions
3. **Configure branch protection** (recommended):
   - Require status checks to pass before merging
   - Require branches to be up to date
   - Include administrators in restrictions

## Branch Protection Rules

Recommended settings for `main` and `develop` branches:

```yaml
# Settings → Branches → Add rule
Branch name pattern: main,develop
✓ Require a pull request before merging
✓ Require status checks to pass before merging
✓ Require branches to be up to date before merging
✓ Include administrators
Status checks: CI/test, CI/security, CI/build
```

## Workflow Status Badges

Add these badges to your README.md:

```markdown
![CI](https://github.com/Penthious/kf-app/workflows/CI/badge.svg)
![Code Quality](https://github.com/Penthious/kf-app/workflows/Code%20Quality/badge.svg)
![Dependency Review](https://github.com/Penthious/kf-app/workflows/Dependency%20Review/badge.svg)
```

## Local Development

To run the same checks locally:

```bash
# Format check
yarn format:check

# Type check
yarn type-check

# All tests
yarn test

# Linting
yarn lint

# Security audit
yarn audit
```

## Troubleshooting

### Common Issues

1. **Workflow not triggering**: Check branch names and trigger conditions
2. **Secret not found**: Verify secrets are set in repository settings
3. **Node version issues**: Update matrix.node-version in ci.yml
4. **Expo build failures**: Ensure EXPO_TOKEN is valid and has proper permissions

### Performance Optimization

- **Caching**: Yarn cache is enabled for faster builds
- **Matrix strategy**: Tests run in parallel across Node versions
- **Conditional jobs**: Some jobs only run on specific triggers
- **Artifact retention**: Build artifacts are uploaded for download

## Contributing

When adding new workflows:

1. Follow the existing naming conventions
2. Include proper documentation
3. Test locally before pushing
4. Update this README with new workflow details
5. Consider performance impact and run times
