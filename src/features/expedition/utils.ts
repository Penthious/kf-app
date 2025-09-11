import type { Campaign } from '@/models/campaign';

/**
 * Check if an expedition has started (vision phase or later)
 */
export function hasExpeditionStarted(campaign: Campaign | undefined): boolean {
  return !!campaign?.expedition?.currentPhase;
}

/**
 * Check if the expedition is in vision phase or later (party leader should be locked)
 */
export function isPartyLeaderLocked(campaign: Campaign | undefined): boolean {
  return hasExpeditionStarted(campaign);
}
