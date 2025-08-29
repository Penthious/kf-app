// src/store/campaigns.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCampaigns } from './campaigns';

const resetStore = () => {
  useCampaigns.setState({ campaigns: {}, currentCampaignId: undefined });
};

const mockNow = (value: number) => {
  vi.setSystemTime(value);
};

describe('campaigns store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    vi.restoreAllMocks();
    resetStore();
  });

  it('adds a campaign and sets it as current', () => {
    const now = 1_700_000_000_000;
    mockNow(now);

    useCampaigns.getState().addCampaign('c1', 'First Campaign');
    const { campaigns, currentCampaignId } = useCampaigns.getState();

    expect(currentCampaignId).toBe('c1');
    expect(campaigns['c1']).toBeTruthy();
    expect(campaigns['c1'].name).toBe('First Campaign');
    expect(campaigns['c1'].createdAt).toBe(now);
    expect(campaigns['c1'].updatedAt).toBe(now);
    expect(campaigns['c1'].members).toEqual([]);
    expect(campaigns['c1'].settings.fivePlayerMode).toBe(false);
  });

  it('renames an existing campaign and updates updatedAt', () => {
    const t1 = 1_700_000_000_000;
    const t2 = 1_700_000_000_500;
    mockNow(t1);
    useCampaigns.getState().addCampaign('c1', 'Before');
    mockNow(t2);

    useCampaigns.getState().renameCampaign('c1', 'After');
    const c = useCampaigns.getState().campaigns['c1'];

    expect(c.name).toBe('After');
    expect(c.updatedAt).toBe(t2);
  });

  it('removeCampaign deletes and clears current if it matches', () => {
    useCampaigns.getState().addCampaign('c1', 'A');
    useCampaigns.getState().addCampaign('c2', 'B');

    expect(useCampaigns.getState().currentCampaignId).toBe('c2');

    useCampaigns.getState().removeCampaign('c2');
    const state = useCampaigns.getState();
    expect(state.campaigns['c2']).toBeUndefined();
    expect(state.currentCampaignId).toBeUndefined();

    state.addCampaign('c3', 'C');
    state.setCurrentCampaignId('c3');
    state.removeCampaign('c1');
    expect(useCampaigns.getState().currentCampaignId).toBe('c3');
  });

  it('setCurrentCampaignId sets the active id', () => {
    useCampaigns.getState().addCampaign('c1', 'A');
    useCampaigns.getState().setCurrentCampaignId('c1');
    expect(useCampaigns.getState().currentCampaignId).toBe('c1');
  });

  it('setFivePlayerMode toggles the flag and updates updatedAt', () => {
    const t1 = 1_700_000_000_000;
    const t2 = 1_700_000_001_000;
    mockNow(t1);
    useCampaigns.getState().addCampaign('c1', 'A');

    mockNow(t2);
    useCampaigns.getState().setFivePlayerMode('c1', true);
    const c = useCampaigns.getState().campaigns['c1'];
    expect(c.settings.fivePlayerMode).toBe(true);
    expect(c.updatedAt).toBe(t2);
  });

  it('setNotes stores notes and updates updatedAt', () => {
    const t1 = 1_700_000_000_000;
    const t2 = 1_700_000_002_000;
    mockNow(t1);
    useCampaigns.getState().addCampaign('c1', 'A');

    mockNow(t2);
    useCampaigns.getState().setNotes('c1', 'Some notes');
    const c = useCampaigns.getState().campaigns['c1'];
    expect(c.settings.notes).toBe('Some notes');
    expect(c.updatedAt).toBe(t2);
  });

  it('addKnightToCampaign adds active member; idempotent by UID; conflicts by active catalog', () => {
    useCampaigns.getState().addCampaign('c1', 'A');

    const r1 = useCampaigns
      .getState()
      .addKnightToCampaign('c1', 'uid-1', { catalogId: 'k-cat-1', displayName: 'K1' });
    expect(r1).toEqual({});
    let members = useCampaigns.getState().campaigns['c1'].members;
    expect(members).toHaveLength(1);
    expect(members[0]).toMatchObject({
      knightUID: 'uid-1',
      catalogId: 'k-cat-1',
      displayName: 'K1',
      isActive: true,
    });

    const r2 = useCampaigns
      .getState()
      .addKnightToCampaign('c1', 'uid-1', { catalogId: 'k-cat-1', displayName: 'K1' });
    expect(r2).toEqual({});
    members = useCampaigns.getState().campaigns['c1'].members;
    expect(members).toHaveLength(1);
    expect(members[0].isActive).toBe(true);

    const r3 = useCampaigns
      .getState()
      .addKnightToCampaign('c1', 'uid-2', { catalogId: 'k-cat-1', displayName: 'K2' });
    expect(r3).toEqual({ conflict: { existingUID: 'uid-1' } });
    members = useCampaigns.getState().campaigns['c1'].members;
    expect(members).toHaveLength(1);
  });

  it('addKnightAsBenched adds or updates as benched without duplicating', () => {
    useCampaigns.getState().addCampaign('c1', 'A');

    useCampaigns.getState().addKnightAsBenched('c1', 'uid-1', {
      catalogId: 'k-cat-1',
      displayName: 'K1',
    });
    let members = useCampaigns.getState().campaigns['c1'].members;
    expect(members).toHaveLength(1);
    expect(members[0]).toMatchObject({
      knightUID: 'uid-1',
      catalogId: 'k-cat-1',
      isActive: false,
    });

    useCampaigns
      .getState()
      .addKnightToCampaign('c1', 'uid-1', { catalogId: 'k-cat-1', displayName: 'K1' });
    expect(useCampaigns.getState().campaigns['c1'].members[0].isActive).toBe(true);

    useCampaigns.getState().addKnightAsBenched('c1', 'uid-1');
    expect(useCampaigns.getState().campaigns['c1'].members[0].isActive).toBe(false);
  });

  it('replaceCatalogKnight swaps the active by catalog and benches the previous', () => {
    useCampaigns.getState().addCampaign('c1', 'A');

    useCampaigns
      .getState()
      .addKnightToCampaign('c1', 'uid-1', { catalogId: 'cat-A', displayName: 'K1' });

    useCampaigns.getState().replaceCatalogKnight('c1', 'cat-A', 'uid-2', { displayName: 'K2' });

    const members = useCampaigns.getState().campaigns['c1'].members;
    const m1 = members.find(m => m.knightUID === 'uid-1')!;
    const m2 = members.find(m => m.knightUID === 'uid-2')!;
    expect(m1.isActive).toBe(false);
    expect(m2.isActive).toBe(true);
    expect(m2.catalogId).toBe('cat-A');
  });

  it('replaceCatalogKnight preserves leader by re-pointing to new active if leader was replaced', () => {
    useCampaigns.getState().addCampaign('c1', 'A');
    useCampaigns
      .getState()
      .addKnightToCampaign('c1', 'uid-1', { catalogId: 'cat-A', displayName: 'K1' });

    useCampaigns.getState().setPartyLeader('c1', 'uid-1');
    expect(useCampaigns.getState().campaigns['c1'].partyLeaderUID).toBe('uid-1');

    useCampaigns.getState().replaceCatalogKnight('c1', 'cat-A', 'uid-2', { displayName: 'K2' });

    const c = useCampaigns.getState().campaigns['c1'];
    expect(c.partyLeaderUID).toBe('uid-2');
    const m2 = c.members.find(m => m.knightUID === 'uid-2')!;
    expect(m2.isActive).toBe(true);
  });

  it('benchMember benches or re-activates; benches leader clears leader', () => {
    useCampaigns.getState().addCampaign('c1', 'A');
    useCampaigns
      .getState()
      .addKnightToCampaign('c1', 'uid-1', { catalogId: 'cat-A', displayName: 'K1' });

    useCampaigns.getState().setPartyLeader('c1', 'uid-1');
    expect(useCampaigns.getState().campaigns['c1'].partyLeaderUID).toBe('uid-1');

    useCampaigns.getState().benchMember('c1', 'uid-1', true);
    const c = useCampaigns.getState().campaigns['c1'];
    const m1 = c.members.find(m => m.knightUID === 'uid-1')!;
    expect(m1.isActive).toBe(false);
    expect(c.partyLeaderUID).toBeUndefined();

    useCampaigns.getState().benchMember('c1', 'uid-1', false);
    expect(useCampaigns.getState().campaigns['c1'].members[0].isActive).toBe(true);
  });

  it('removeMember removes and clears leader if removed member was leader', () => {
    useCampaigns.getState().addCampaign('c1', 'A');
    useCampaigns
      .getState()
      .addKnightToCampaign('c1', 'uid-1', { catalogId: 'cat-A', displayName: 'K1' });

    useCampaigns.getState().setPartyLeader('c1', 'uid-1');
    expect(useCampaigns.getState().campaigns['c1'].partyLeaderUID).toBe('uid-1');

    useCampaigns.getState().removeMember('c1', 'uid-1');
    const c = useCampaigns.getState().campaigns['c1'];
    expect(c.members.find(m => m.knightUID === 'uid-1')).toBeUndefined();
    expect(c.partyLeaderUID).toBeUndefined();
  });

  it('setPartyLeader ensures membership, activates leader, and sets unique isLeader flag', () => {
    useCampaigns.getState().addCampaign('c1', 'A');

    useCampaigns.getState().setPartyLeader('c1', 'uid-1');
    let c = useCampaigns.getState().campaigns['c1'];
    let m1 = c.members.find(m => m.knightUID === 'uid-1')!;
    expect(m1).toBeTruthy();
    expect(m1.isActive).toBe(true);
    expect(m1.isLeader).toBe(true);
    expect(c.partyLeaderUID).toBe('uid-1');
    expect(m1.catalogId).toBeDefined();

    useCampaigns
      .getState()
      .addKnightToCampaign('c1', 'uid-2', { catalogId: 'cat-B', displayName: 'K2' });
    useCampaigns.getState().setPartyLeader('c1', 'uid-2');

    c = useCampaigns.getState().campaigns['c1'];
    m1 = c.members.find(m => m.knightUID === 'uid-1')!;
    const m2 = c.members.find(m => m.knightUID === 'uid-2')!;
    expect(m2.isLeader).toBe(true);
    expect(m2.isActive).toBe(true);
    expect(m1.isLeader).toBe(false);
    expect(c.partyLeaderUID).toBe('uid-2');
  });

  it('unsetPartyLeader clears leader flag across members and unsets partyLeaderUID', () => {
    useCampaigns.getState().addCampaign('c1', 'A');
    useCampaigns
      .getState()
      .addKnightToCampaign('c1', 'uid-1', { catalogId: 'cat-A', displayName: 'K1' });
    useCampaigns.getState().setPartyLeader('c1', 'uid-1');
    expect(useCampaigns.getState().campaigns['c1'].partyLeaderUID).toBe('uid-1');

    useCampaigns.getState().unsetPartyLeader('c1');
    const c = useCampaigns.getState().campaigns['c1'];
    expect(c.partyLeaderUID).toBeUndefined();
    expect(c.members.every(m => m.isLeader === false)).toBe(true);
  });

  it('marks single-attempt adventure as completed (idempotent) and creates kingdom state', () => {
    // Arrange
    const t1 = 1_700_000_000_000;
    vi.setSystemTime(t1);
    useCampaigns.getState().addCampaign('cmp-1', 'Campaign One');

    const advId = 'principality-of-stone:secret-hall';
    const kingdomId = 'principality-of-stone';

    // Act: mark complete once
    useCampaigns
      .getState()
      .setAdventureProgress('cmp-1', kingdomId, advId, { singleAttempt: true });

    // Assert: kingdom and adventure state created with count = 1
    let c = useCampaigns.getState().campaigns['cmp-1'];
    let k = c.kingdoms.find(k => k.kingdomId === kingdomId);
    expect(k).toBeTruthy();
    expect(Array.isArray(k!.adventures)).toBe(true);
    let a = (k!.adventures as Array<{ id: string; completedCount?: number }>).find(
      x => x.id === advId
    );
    expect(a).toBeTruthy();
    expect(a!.completedCount).toBe(1);

    // Act: calling again should remain at 1 (idempotent)
    useCampaigns
      .getState()
      .setAdventureProgress('cmp-1', kingdomId, advId, { singleAttempt: true });
    c = useCampaigns.getState().campaigns['cmp-1'];
    k = c.kingdoms.find(k => k.kingdomId === kingdomId);
    a = (k!.adventures as Array<{ id: string; completedCount?: number }>).find(x => x.id === advId);
    expect(a!.completedCount).toBe(1);

    // updatedAt should be set
    expect(c.updatedAt).toBe(t1);
  });

  it('increments repeatable adventure by delta and does not affect others', () => {
    useCampaigns.getState().addCampaign('cmp-2', 'Campaign Two');

    const kingdomId = 'principality-of-stone';
    const advA = `${kingdomId}:scout-the-ravine`;
    const advB = `${kingdomId}:resupply-at-fort`;

    // A: +1, +1, +2 => 4
    useCampaigns.getState().setAdventureProgress('cmp-2', kingdomId, advA, { delta: 1 });
    useCampaigns.getState().setAdventureProgress('cmp-2', kingdomId, advA, { delta: 1 });
    useCampaigns.getState().setAdventureProgress('cmp-2', kingdomId, advA, { delta: 2 });

    // B: +1 => 1 (independent)
    useCampaigns.getState().setAdventureProgress('cmp-2', kingdomId, advB, { delta: 1 });

    const c = useCampaigns.getState().campaigns['cmp-2'];
    const k = c.kingdoms.find(k => k.kingdomId === kingdomId)!;
    const aA = (k.adventures as Array<{ id: string; completedCount?: number }>).find(
      x => x.id === advA
    );
    const aB = (k.adventures as Array<{ id: string; completedCount?: number }>).find(
      x => x.id === advB
    );

    expect(aA?.completedCount).toBe(4);
    expect(aB?.completedCount).toBe(1);
  });
});
