import type { InvestigationResult } from '@/models/knight';

/**
 * Calculate investigation progress for a knight in a specific chapter.
 * This is pure business logic that can be tested independently.
 */
export const calculateInvestigationProgress = (
  investigations: Array<{ type: 'normal' | 'lead'; result: InvestigationResult }>,
  totalRequired: number = 5
): {
  completed: number;
  total: number;
  percentage: number;
  isComplete: boolean;
} => {
  const completed = investigations.filter(inv => inv.result === 'pass').length;
  const percentage = totalRequired > 0 ? (completed / totalRequired) * 100 : 0;

  return {
    completed,
    total: totalRequired,
    percentage: Math.min(percentage, 100),
    isComplete: completed >= totalRequired,
  };
};

/**
 * Check if normal investigations are locked for a chapter.
 * Normal investigations are locked until the quest is completed.
 */
export const isNormalLocked = (questCompleted: boolean, chapter: number): boolean => {
  // Normal investigations are locked until quest is completed
  return !questCompleted;
};

/**
 * Validate investigation input data.
 */
export const validateInvestigationInput = (
  chapter: number,
  invId: string,
  result: InvestigationResult,
  type: 'normal' | 'lead'
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (chapter < 1) errors.push('Chapter must be at least 1');
  if (!invId) errors.push('Investigation ID is required');
  if (!['pass', 'fail'].includes(result)) errors.push('Result must be pass or fail');
  if (!['normal', 'lead'].includes(type)) errors.push('Type must be normal or lead');

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate total investigation attempts for a chapter.
 */
export const getInvestigationAttempts = (
  investigations: Array<{ type: 'normal' | 'lead'; result: InvestigationResult }>
): {
  normal: number;
  lead: number;
  total: number;
} => {
  const normal = investigations.filter(inv => inv.type === 'normal').length;
  const lead = investigations.filter(inv => inv.type === 'lead').length;

  return {
    normal,
    lead,
    total: normal + lead,
  };
};

/**
 * Get investigation success rate.
 */
export const getInvestigationSuccessRate = (
  investigations: Array<{ type: 'normal' | 'lead'; result: InvestigationResult }>
): {
  normal: number;
  lead: number;
  overall: number;
} => {
  const normalInvestigations = investigations.filter(inv => inv.type === 'normal');
  const leadInvestigations = investigations.filter(inv => inv.type === 'lead');

  const normalSuccess = normalInvestigations.filter(inv => inv.result === 'pass').length;
  const leadSuccess = leadInvestigations.filter(inv => inv.result === 'pass').length;

  return {
    normal:
      normalInvestigations.length > 0 ? (normalSuccess / normalInvestigations.length) * 100 : 0,
    lead: leadInvestigations.length > 0 ? (leadSuccess / leadInvestigations.length) * 100 : 0,
    overall:
      investigations.length > 0 ? ((normalSuccess + leadSuccess) / investigations.length) * 100 : 0,
  };
};

/**
 * Check if a knight can attempt more investigations.
 * This could be used for validation before allowing new attempts.
 */
export const canAttemptInvestigation = (
  currentAttempts: number,
  maxAttempts: number = 5,
  isLocked: boolean = false
): boolean => {
  return !isLocked && currentAttempts < maxAttempts;
};

/**
 * Format investigation result for display.
 */
export const formatInvestigationResult = (result: InvestigationResult): string => {
  return result === 'pass' ? 'Success' : 'Failure';
};

/**
 * Get investigation type display name.
 */
export const getInvestigationTypeName = (type: 'normal' | 'lead'): string => {
  return type === 'normal' ? 'Normal Investigation' : 'Lead Investigation';
};
