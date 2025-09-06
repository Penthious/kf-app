# KF App Development Makefile
# Provides consistent commands for development workflow

.PHONY: help install test test-watch lint format type-check build clean dev start ios android

# Default target
help: ## Show this help message
	@echo "KF App Development Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Installation and Setup
install: ## Install dependencies
	yarn install

# Testing
test: ## Run all tests
	yarn test

test-watch: ## Run tests in watch mode
	yarn test --watch

test-expedition: ## Run expedition-related tests only
	yarn test --testPathPattern="expedition|campaigns" --passWithNoTests

test-coverage: ## Run tests with coverage report
	yarn test --coverage

# Code Quality
lint: ## Run ESLint
	yarn lint

format: ## Format code with Prettier
	yarn format

type-check: ## Run TypeScript type checking
	yarn type-check

# Pre-commit checks (runs format, lint, type-check, and test)
check: format lint type-check test ## Run all pre-commit checks

# Development
dev: ## Start development server
	yarn start

start: dev ## Alias for dev

# Platform-specific builds
ios: ## Start iOS development build
	yarn ios

android: ## Start Android development build
	yarn android

# Building
build: ## Build the app
	yarn build

build-ios: ## Build for iOS
	yarn build:ios

build-android: ## Build for Android
	yarn build:android

# Git workflow helpers
git-status: ## Show git status
	git status

git-add: ## Add all changes
	git add .

git-commit: ## Commit changes (requires MESSAGE="commit message")
	@if [ -z "$(MESSAGE)" ]; then echo "Usage: make git-commit MESSAGE=\"your commit message\""; exit 1; fi
	git commit -m "$(MESSAGE)"

git-push: ## Push current branch
	git push origin $$(git branch --show-current)

git-pull: ## Pull latest changes
	git pull origin $$(git branch --show-current)

# Branch management
branch-create: ## Create new branch (requires BRANCH="branch-name")
	@if [ -z "$(BRANCH)" ]; then echo "Usage: make branch-create BRANCH=\"feature/your-feature\""; exit 1; fi
	git checkout -b $(BRANCH)

branch-switch: ## Switch to branch (requires BRANCH="branch-name")
	@if [ -z "$(BRANCH)" ]; then echo "Usage: make branch-switch BRANCH=\"branch-name\""; exit 1; fi
	git checkout $(BRANCH)

# Cleanup
clean: ## Clean build artifacts and node_modules
	rm -rf node_modules
	rm -rf .expo
	rm -rf dist
	rm -rf build
	yarn install

clean-cache: ## Clean Expo and Metro cache
	yarn start --clear

# Database and Storage
db-reset: ## Reset local database/storage
	@echo "This would reset your local storage - implement as needed"

# Deployment helpers
deploy-preview: ## Deploy preview build
	@echo "Deploy preview - implement as needed"

deploy-prod: ## Deploy production build
	@echo "Deploy production - implement as needed"

# Development workflow shortcuts
quick-test: ## Quick test run (expedition tests only)
	make test-expedition

quick-check: ## Quick pre-commit check (format + lint + test-expedition)
	make format
	make lint
	make test-expedition

# Feature development workflow
feature-start: ## Start new feature (requires FEATURE="feature-name")
	@if [ -z "$(FEATURE)" ]; then echo "Usage: make feature-start FEATURE=\"your-feature-name\""; exit 1; fi
	git checkout main
	git pull origin main
	git checkout -b feature/$(FEATURE)
	@echo "Started new feature branch: feature/$(FEATURE)"

feature-finish: ## Finish feature (commit, push, and show next steps)
	@echo "Finishing feature branch..."
	@echo "Current branch: $$(git branch --show-current)"
	@echo "Run 'make git-add' then 'make git-commit MESSAGE=\"your message\"' then 'make git-push'"
	@echo "Then create a pull request on GitHub"

# Common development patterns
dev-cycle: ## Full development cycle (check + dev)
	make check
	make dev

test-cycle: ## Test development cycle (format + lint + test)
	make format
	make lint
	make test

# Show current project status
status: ## Show current project status
	@echo "=== KF App Status ==="
	@echo "Current branch: $$(git branch --show-current)"
	@echo "Git status:"
	@git status --porcelain
	@echo ""
	@echo "Recent commits:"
	@git log --oneline -5
	@echo ""
	@echo "Available commands: make help"
