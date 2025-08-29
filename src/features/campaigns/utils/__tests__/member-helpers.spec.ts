import type { Campaign, CampaignMember } from '@/models/campaign';
import { describe, expect, it } from 'vitest';
import {
    canBePartyLeader,
    checkCatalogConflict,
    createMember,
    ensureMember,
    getActiveMembers,
    getBenchedMembers,
    getPartyLeader,
    updateMember,
    validateMember,
} from '../member-helpers';

describe('member-helpers', () => {
    describe('ensureMember', () => {
        it('adds new member when not exists', () => {
            const members: CampaignMember[] = [];
            const result = ensureMember(members, 'knight-1', {
                catalogId: 'cat-1',
                displayName: 'Sir Test',
            });

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                knightUID: 'knight-1',
                catalogId: 'cat-1',
                displayName: 'Sir Test',
                isActive: true,
                isLeader: false,
                joinedAt: expect.any(Number),
            });
        });

        it('returns existing members when member already exists', () => {
            const existingMember: CampaignMember = {
                knightUID: 'knight-1',
                catalogId: 'cat-1',
                displayName: 'Sir Test',
                isActive: true,
                isLeader: false,
                joinedAt: 1000,
            };
            const members = [existingMember];
            const result = ensureMember(members, 'knight-1');

            expect(result).toStrictEqual(members);
            expect(result).toHaveLength(1);
        });

        it('handles undefined members array', () => {
            const result = ensureMember(undefined, 'knight-1', {
                catalogId: 'cat-1',
                displayName: 'Sir Test',
            });

            expect(result).toHaveLength(1);
            expect(result[0].knightUID).toBe('knight-1');
        });

        it('uses default values when meta not provided', () => {
            const result = ensureMember([], 'knight-1');

            expect(result[0]).toEqual({
                knightUID: 'knight-1',
                catalogId: 'unknown',
                displayName: 'Unknown Knight',
                isActive: true,
                isLeader: false,
                joinedAt: expect.any(Number),
            });
        });
    });

    describe('checkCatalogConflict', () => {
        it('returns null when no conflict exists', () => {
            const members: CampaignMember[] = [
                {
                    knightUID: 'knight-1',
                    catalogId: 'cat-1',
                    displayName: 'Sir Test',
                    isActive: true,
                    isLeader: false,
                    joinedAt: 1000,
                },
            ];
            const result = checkCatalogConflict(members, 'cat-2');
            expect(result).toBeNull();
        });

        it('returns conflicting member when active member exists for catalog', () => {
            const conflictingMember: CampaignMember = {
                knightUID: 'knight-1',
                catalogId: 'cat-1',
                displayName: 'Sir Test',
                isActive: true,
                isLeader: false,
                joinedAt: 1000,
            };
            const members = [conflictingMember];
            const result = checkCatalogConflict(members, 'cat-1');

            expect(result).toBe(conflictingMember);
        });

        it('ignores benched members', () => {
            const benchedMember: CampaignMember = {
                knightUID: 'knight-1',
                catalogId: 'cat-1',
                displayName: 'Sir Test',
                isActive: false,
                isLeader: false,
                joinedAt: 1000,
            };
            const members = [benchedMember];
            const result = checkCatalogConflict(members, 'cat-1');

            expect(result).toBeNull();
        });

        it('excludes specified knight UID from conflict check', () => {
            const member: CampaignMember = {
                knightUID: 'knight-1',
                catalogId: 'cat-1',
                displayName: 'Sir Test',
                isActive: true,
                isLeader: false,
                joinedAt: 1000,
            };
            const members = [member];
            const result = checkCatalogConflict(members, 'cat-1', 'knight-1');

            expect(result).toBeNull();
        });
    });

    describe('createMember', () => {
        it('creates member with provided values', () => {
            const result = createMember('knight-1', 'cat-1', 'Sir Test', true, true);

            expect(result).toEqual({
                knightUID: 'knight-1',
                catalogId: 'cat-1',
                displayName: 'Sir Test',
                isActive: true,
                isLeader: true,
                joinedAt: expect.any(Number),
            });
        });

        it('uses default values when not provided', () => {
            const result = createMember('knight-1');

            expect(result).toEqual({
                knightUID: 'knight-1',
                catalogId: 'unknown',
                displayName: 'Unknown Knight',
                isActive: true,
                isLeader: false,
                joinedAt: expect.any(Number),
            });
        });
    });

    describe('updateMember', () => {
        it('updates member properties while preserving others', () => {
            const member: CampaignMember = {
                knightUID: 'knight-1',
                catalogId: 'cat-1',
                displayName: 'Sir Test',
                isActive: true,
                isLeader: false,
                joinedAt: 1000,
            };

            const result = updateMember(member, {
                displayName: 'Sir Updated',
                isActive: false,
            });

            expect(result).toEqual({
                knightUID: 'knight-1',
                catalogId: 'cat-1',
                displayName: 'Sir Updated',
                isActive: false,
                isLeader: false,
                joinedAt: 1000,
            });
        });
    });

    describe('getActiveMembers', () => {
        it('returns only active members', () => {
            const members: CampaignMember[] = [
                {
                    knightUID: 'knight-1',
                    catalogId: 'cat-1',
                    displayName: 'Active 1',
                    isActive: true,
                    isLeader: false,
                    joinedAt: 1000,
                },
                {
                    knightUID: 'knight-2',
                    catalogId: 'cat-2',
                    displayName: 'Benched 1',
                    isActive: false,
                    isLeader: false,
                    joinedAt: 1000,
                },
                {
                    knightUID: 'knight-3',
                    catalogId: 'cat-3',
                    displayName: 'Active 2',
                    isActive: true,
                    isLeader: false,
                    joinedAt: 1000,
                },
            ];

            const result = getActiveMembers(members);
            expect(result).toHaveLength(2);
            expect(result[0].displayName).toBe('Active 1');
            expect(result[1].displayName).toBe('Active 2');
        });
    });

    describe('getBenchedMembers', () => {
        it('returns only benched members', () => {
            const members: CampaignMember[] = [
                {
                    knightUID: 'knight-1',
                    catalogId: 'cat-1',
                    displayName: 'Active 1',
                    isActive: true,
                    isLeader: false,
                    joinedAt: 1000,
                },
                {
                    knightUID: 'knight-2',
                    catalogId: 'cat-2',
                    displayName: 'Benched 1',
                    isActive: false,
                    isLeader: false,
                    joinedAt: 1000,
                },
            ];

            const result = getBenchedMembers(members);
            expect(result).toHaveLength(1);
            expect(result[0].displayName).toBe('Benched 1');
        });
    });

    describe('getPartyLeader', () => {
        it('returns the party leader', () => {
            const members: CampaignMember[] = [
                {
                    knightUID: 'knight-1',
                    catalogId: 'cat-1',
                    displayName: 'Leader',
                    isActive: true,
                    isLeader: true,
                    joinedAt: 1000,
                },
                {
                    knightUID: 'knight-2',
                    catalogId: 'cat-2',
                    displayName: 'Not Leader',
                    isActive: true,
                    isLeader: false,
                    joinedAt: 1000,
                },
            ];

            const result = getPartyLeader(members);
            expect(result?.displayName).toBe('Leader');
        });

        it('returns undefined when no leader exists', () => {
            const members: CampaignMember[] = [
                {
                    knightUID: 'knight-1',
                    catalogId: 'cat-1',
                    displayName: 'Not Leader',
                    isActive: true,
                    isLeader: false,
                    joinedAt: 1000,
                },
            ];

            const result = getPartyLeader(members);
            expect(result).toBeUndefined();
        });
    });

    describe('canBePartyLeader', () => {
        it('returns true for active members', () => {
            const member: CampaignMember = {
                knightUID: 'knight-1',
                catalogId: 'cat-1',
                displayName: 'Sir Test',
                isActive: true,
                isLeader: false,
                joinedAt: 1000,
            };

            expect(canBePartyLeader(member)).toBe(true);
        });

        it('returns false for benched members', () => {
            const member: CampaignMember = {
                knightUID: 'knight-1',
                catalogId: 'cat-1',
                displayName: 'Sir Test',
                isActive: false,
                isLeader: false,
                joinedAt: 1000,
            };

            expect(canBePartyLeader(member)).toBe(false);
        });
    });

    describe('validateMember', () => {
        it('returns valid for correct member data', () => {
            const member: CampaignMember = {
                knightUID: 'knight-1',
                catalogId: 'cat-1',
                displayName: 'Sir Test',
                isActive: true,
                isLeader: false,
                joinedAt: 1000,
            };

            const result = validateMember(member);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('returns errors for invalid member data', () => {
            const invalidMember = {
                knightUID: '',
                catalogId: '',
                displayName: '',
                isActive: 'not boolean',
                isLeader: 'not boolean',
                joinedAt: 'not number',
            } as unknown as CampaignMember;

            const result = validateMember(invalidMember);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });
});
