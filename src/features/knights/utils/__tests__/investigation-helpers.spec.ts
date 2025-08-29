import type { InvestigationResult } from '@/models/knight';
import { describe, expect, it } from 'vitest';
import {
  calculateInvestigationProgress,
  canAttemptInvestigation,
  formatInvestigationResult,
  getInvestigationAttempts,
  getInvestigationSuccessRate,
  getInvestigationTypeName,
  isNormalLocked,
  validateInvestigationInput,
} from '../investigation-helpers';

describe('investigation-helpers', () => {
  describe('calculateInvestigationProgress', () => {
    it('calculates progress correctly for successful investigations', () => {
      const investigations = [
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'lead' as const, result: 'pass' as InvestigationResult },
      ];

      const result = calculateInvestigationProgress(investigations, 5);

      expect(result).toEqual({
        completed: 3,
        total: 5,
        percentage: 60,
        isComplete: false,
      });
    });

    it('handles failed investigations correctly', () => {
      const investigations = [
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'fail' as InvestigationResult },
        { type: 'lead' as const, result: 'pass' as InvestigationResult },
      ];

      const result = calculateInvestigationProgress(investigations, 5);

      expect(result).toEqual({
        completed: 2,
        total: 5,
        percentage: 40,
        isComplete: false,
      });
    });

    it('marks as complete when required number reached', () => {
      const investigations = [
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
      ];

      const result = calculateInvestigationProgress(investigations, 5);

      expect(result).toEqual({
        completed: 5,
        total: 5,
        percentage: 100,
        isComplete: true,
      });
    });

    it('caps percentage at 100', () => {
      const investigations = [
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
      ];

      const result = calculateInvestigationProgress(investigations, 5);

      expect(result.percentage).toBe(100);
    });

    it('handles zero total required', () => {
      const investigations = [{ type: 'normal' as const, result: 'pass' as InvestigationResult }];

      const result = calculateInvestigationProgress(investigations, 0);

      expect(result).toEqual({
        completed: 1,
        total: 0,
        percentage: 0,
        isComplete: true,
      });
    });
  });

  describe('isNormalLocked', () => {
    it('returns true when quest not completed', () => {
      expect(isNormalLocked(false, 1)).toBe(true);
      expect(isNormalLocked(false, 5)).toBe(true);
    });

    it('returns false when quest completed', () => {
      expect(isNormalLocked(true, 1)).toBe(false);
      expect(isNormalLocked(true, 5)).toBe(false);
    });
  });

  describe('validateInvestigationInput', () => {
    it('returns valid for correct input', () => {
      const result = validateInvestigationInput(1, 'inv-1', 'pass', 'normal');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns errors for invalid chapter', () => {
      const result = validateInvestigationInput(0, 'inv-1', 'pass', 'normal');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Chapter must be at least 1');
    });

    it('returns errors for missing investigation ID', () => {
      const result = validateInvestigationInput(1, '', 'pass', 'normal');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Investigation ID is required');
    });

    it('returns errors for invalid result', () => {
      const result = validateInvestigationInput(1, 'inv-1', 'invalid' as 'pass' | 'fail', 'normal');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Result must be pass or fail');
    });

    it('returns errors for invalid type', () => {
      const result = validateInvestigationInput(1, 'inv-1', 'pass', 'invalid' as 'normal' | 'lead');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Type must be normal or lead');
    });
  });

  describe('getInvestigationAttempts', () => {
    it('counts attempts correctly', () => {
      const investigations = [
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'fail' as InvestigationResult },
        { type: 'lead' as const, result: 'pass' as InvestigationResult },
        { type: 'lead' as const, result: 'pass' as InvestigationResult },
      ];

      const result = getInvestigationAttempts(investigations);

      expect(result).toEqual({
        normal: 2,
        lead: 2,
        total: 4,
      });
    });

    it('handles empty investigations', () => {
      const result = getInvestigationAttempts([]);

      expect(result).toEqual({
        normal: 0,
        lead: 0,
        total: 0,
      });
    });
  });

  describe('getInvestigationSuccessRate', () => {
    it('calculates success rates correctly', () => {
      const investigations = [
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'fail' as InvestigationResult },
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'lead' as const, result: 'pass' as InvestigationResult },
        { type: 'lead' as const, result: 'pass' as InvestigationResult },
      ];

      const result = getInvestigationSuccessRate(investigations);

      expect(result).toEqual({
        normal: 66.66666666666666, // 2/3 * 100
        lead: 100, // 2/2 * 100
        overall: 80, // 4/5 * 100
      });
    });

    it('handles zero investigations', () => {
      const result = getInvestigationSuccessRate([]);

      expect(result).toEqual({
        normal: 0,
        lead: 0,
        overall: 0,
      });
    });

    it('handles only normal investigations', () => {
      const investigations = [
        { type: 'normal' as const, result: 'pass' as InvestigationResult },
        { type: 'normal' as const, result: 'fail' as InvestigationResult },
      ];

      const result = getInvestigationSuccessRate(investigations);

      expect(result).toEqual({
        normal: 50, // 1/2 * 100
        lead: 0,
        overall: 50, // 1/2 * 100
      });
    });
  });

  describe('canAttemptInvestigation', () => {
    it('returns true when conditions are met', () => {
      expect(canAttemptInvestigation(3, 5, false)).toBe(true);
    });

    it('returns false when locked', () => {
      expect(canAttemptInvestigation(3, 5, true)).toBe(false);
    });

    it('returns false when max attempts reached', () => {
      expect(canAttemptInvestigation(5, 5, false)).toBe(false);
      expect(canAttemptInvestigation(6, 5, false)).toBe(false);
    });

    it('returns false when both locked and max attempts reached', () => {
      expect(canAttemptInvestigation(5, 5, true)).toBe(false);
    });
  });

  describe('formatInvestigationResult', () => {
    it('formats pass correctly', () => {
      expect(formatInvestigationResult('pass')).toBe('Success');
    });

    it('formats fail correctly', () => {
      expect(formatInvestigationResult('fail')).toBe('Failure');
    });
  });

  describe('getInvestigationTypeName', () => {
    it('formats normal type correctly', () => {
      expect(getInvestigationTypeName('normal')).toBe('Normal Investigation');
    });

    it('formats lead type correctly', () => {
      expect(getInvestigationTypeName('lead')).toBe('Lead Investigation');
    });
  });
});
