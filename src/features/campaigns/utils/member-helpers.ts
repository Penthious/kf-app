import type { CampaignMember } from '@/models/campaign';

/**
 * Ensure a member exists; if adding, fill required fields.
 * This is pure business logic that can be tested independently.
 */
export const ensureMember = (
  members: CampaignMember[] | undefined,
  knightUID: string,
  meta?: { catalogId?: string; displayName?: string }
): CampaignMember[] => {
  const list = Array.isArray(members) ? members.map(m => ({ ...m })) : [];
  const idx = list.findIndex(m => m.knightUID === knightUID);
  if (idx >= 0) return list;

  const { catalogId = 'unknown', displayName = 'Unknown Knight' } = meta ?? {};
  return [
    ...list,
    {
      knightUID,
      catalogId,
      displayName,
      isActive: true,
      isLeader: false,
      joinedAt: Date.now(),
    },
  ];
};

/**
 * Check if adding a knight would create a catalog conflict.
 * Only one active member per catalog is allowed.
 */
export const checkCatalogConflict = (
  members: CampaignMember[],
  catalogId: string,
  excludeKnightUID?: string
): CampaignMember | null => {
  return (
    members.find(
      m => m.catalogId === catalogId && m.isActive && m.knightUID !== excludeKnightUID
    ) ?? null
  );
};

/**
 * Create a new member with default values.
 */
export const createMember = (
  knightUID: string,
  catalogId: string = 'unknown',
  displayName: string = 'Unknown Knight',
  isActive: boolean = true,
  isLeader: boolean = false
): CampaignMember => ({
  knightUID,
  catalogId,
  displayName,
  isActive,
  isLeader,
  joinedAt: Date.now(),
});

/**
 * Update member properties while preserving other fields.
 */
export const updateMember = (
  member: CampaignMember,
  updates: Partial<Omit<CampaignMember, 'knightUID' | 'joinedAt'>>
): CampaignMember => ({
  ...member,
  ...updates,
});

/**
 * Get all active members for a campaign.
 */
export const getActiveMembers = (members: CampaignMember[]): CampaignMember[] =>
  members.filter(m => m.isActive);

/**
 * Get all benched members for a campaign.
 */
export const getBenchedMembers = (members: CampaignMember[]): CampaignMember[] =>
  members.filter(m => !m.isActive);

/**
 * Get the party leader from a list of members.
 */
export const getPartyLeader = (members: CampaignMember[]): CampaignMember | undefined =>
  members.find(m => m.isLeader);

/**
 * Check if a member can be set as party leader.
 */
export const canBePartyLeader = (member: CampaignMember): boolean => member.isActive; // Only active members can be leaders

/**
 * Validate member data.
 */
export const validateMember = (member: CampaignMember): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!member.knightUID) errors.push('knightUID is required');
  if (!member.catalogId) errors.push('catalogId is required');
  if (!member.displayName) errors.push('displayName is required');
  if (typeof member.isActive !== 'boolean') errors.push('isActive must be boolean');
  if (typeof member.isLeader !== 'boolean') errors.push('isLeader must be boolean');
  if (typeof member.joinedAt !== 'number') errors.push('joinedAt must be number');

  return {
    valid: errors.length === 0,
    errors,
  };
};
