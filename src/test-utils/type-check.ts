import { execSync } from 'child_process';

/**
 * Utility to check TypeScript compilation during tests
 * This helps catch import path issues and other TypeScript errors
 */
export function checkTypeScriptCompilation(): void {
  try {
    // Check if we're in a test environment
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      console.log('🔍 Checking TypeScript compilation...');
      
      // Run TypeScript compiler in noEmit mode (just check, don't output files)
      execSync('npx tsc --noEmit --skipLibCheck', {
        stdio: 'pipe',
        cwd: process.cwd(),
      });
      
      console.log('✅ TypeScript compilation check passed');
    }
  } catch (error) {
    console.error('❌ TypeScript compilation failed:');
    console.error(error);
    throw new Error('TypeScript compilation check failed - fix import issues before proceeding');
  }
}

/**
 * Check if all import paths are valid
 * This is a more targeted check for import issues
 */
export function validateImportPaths(): void {
  const commonImportIssues = [
    {
      pattern: /from ['"]@\/store\/kingdoms['"]/,
      message: 'Import from @/store/kingdoms should be @/catalogs/kingdoms',
      fix: 'Update import to @/catalogs/kingdoms'
    },
    {
      pattern: /from ['"]@\/store\/[^'"]*['"]/,
      message: 'Check if store import path is correct',
      fix: 'Verify store import path exists'
    },
    {
      pattern: /from ['"]@\/features\/[^'"]*\/[^'"]*['"]/,
      message: 'Check if feature import path is correct',
      fix: 'Verify feature import path exists'
    }
  ];

  // This would need to be implemented with a file system walk
  // For now, we'll rely on the TypeScript compiler check
  console.log('🔍 Import path validation would run here');
}

/**
 * Run all validation checks
 */
export function runValidationChecks(): void {
  checkTypeScriptCompilation();
  validateImportPaths();
}
