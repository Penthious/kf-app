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

  describe('expedition actions', () => {
    it('starts expedition and sets initial state', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('exp-1', 'Expedition Campaign');

      useCampaigns.getState().startExpedition('exp-1');

      const campaign = useCampaigns.getState().campaigns['exp-1'];
      expect(campaign.expedition).toBeTruthy();
      expect(campaign.expedition!.currentPhase).toBe('vision');
      expect(campaign.expedition!.knightChoices).toEqual([]);
      expect(campaign.expedition!.phaseStartedAt).toBe(now);
      expect(campaign.updatedAt).toBe(now);
    });

    it('sets expedition phase', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('exp-2', 'Expedition Campaign');
      useCampaigns.getState().startExpedition('exp-2');

      useCampaigns.getState().setExpeditionPhase('exp-2', 'outpost');

      const campaign = useCampaigns.getState().campaigns['exp-2'];
      expect(campaign.expedition!.currentPhase).toBe('outpost');
      expect(campaign.updatedAt).toBe(now);
    });

    it('sets knight expedition choice', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('exp-3', 'Expedition Campaign');

      // Should create expedition if it doesn't exist
      useCampaigns.getState().setKnightExpeditionChoice('exp-3', 'knight-1', 'quest');

      const campaign = useCampaigns.getState().campaigns['exp-3'];
      expect(campaign.expedition).toBeTruthy();
      expect(campaign.expedition!.knightChoices).toHaveLength(1);
      expect(campaign.expedition!.knightChoices[0]).toEqual({
        knightUID: 'knight-1',
        choice: 'quest',
        status: 'in-progress',
      });
      expect(campaign.updatedAt).toBe(now);
    });

    it('updates existing knight expedition choice', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('exp-4', 'Expedition Campaign');
      useCampaigns.getState().setKnightExpeditionChoice('exp-4', 'knight-1', 'quest');

      // Update the choice
      useCampaigns.getState().setKnightExpeditionChoice('exp-4', 'knight-1', 'investigation');

      const campaign = useCampaigns.getState().campaigns['exp-4'];
      expect(campaign.expedition!.knightChoices).toHaveLength(1);
      expect(campaign.expedition!.knightChoices[0]).toEqual({
        knightUID: 'knight-1',
        choice: 'investigation',
        status: 'in-progress',
      });
    });

    it('clears knight expedition choice', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('exp-5', 'Expedition Campaign');
      useCampaigns.getState().setKnightExpeditionChoice('exp-5', 'knight-1', 'quest');
      useCampaigns.getState().setKnightExpeditionChoice('exp-5', 'knight-2', 'investigation');

      useCampaigns.getState().clearKnightExpeditionChoice('exp-5', 'knight-1');

      const campaign = useCampaigns.getState().campaigns['exp-5'];
      expect(campaign.expedition!.knightChoices).toHaveLength(1);
      expect(campaign.expedition!.knightChoices[0].knightUID).toBe('knight-2');
    });

    it('completes knight expedition choice', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('exp-6', 'Expedition Campaign');
      useCampaigns.getState().setKnightExpeditionChoice('exp-6', 'knight-1', 'quest');

      useCampaigns.getState().completeKnightExpeditionChoice('exp-6', 'knight-1');

      const campaign = useCampaigns.getState().campaigns['exp-6'];
      expect(campaign.expedition!.knightChoices[0].status).toBe('completed');
    });

    it('sets party leader', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('exp-7', 'Expedition Campaign');

      useCampaigns.getState().setPartyLeader('exp-7', 'knight-1');

      const campaign = useCampaigns.getState().campaigns['exp-7'];
      expect(campaign.partyLeaderUID).toBe('knight-1');
      expect(campaign.updatedAt).toBe(now);
    });

    it('handles multiple knight choices correctly', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('exp-8', 'Expedition Campaign');

      useCampaigns.getState().setKnightExpeditionChoice('exp-8', 'knight-1', 'quest');
      useCampaigns.getState().setKnightExpeditionChoice('exp-8', 'knight-2', 'investigation');
      useCampaigns.getState().setKnightExpeditionChoice('exp-8', 'knight-3', 'free-roam');

      const campaign = useCampaigns.getState().campaigns['exp-8'];
      expect(campaign.expedition!.knightChoices).toHaveLength(3);

      const choices = campaign.expedition!.knightChoices;
      expect(choices.find(c => c.knightUID === 'knight-1')?.choice).toBe('quest');
      expect(choices.find(c => c.knightUID === 'knight-2')?.choice).toBe('investigation');
      expect(choices.find(c => c.knightUID === 'knight-3')?.choice).toBe('free-roam');
    });

    it('sets selected kingdom', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('exp-9', 'Expedition Campaign');

      useCampaigns.getState().setSelectedKingdom('exp-9', 'sunken-kingdom');

      const campaign = useCampaigns.getState().campaigns['exp-9'];
      expect(campaign.selectedKingdomId).toBe('sunken-kingdom');
      expect(campaign.updatedAt).toBe(now);
    });
  });

  describe('delve progress actions', () => {
    it('initializeDelveProgress creates delve progress state', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-1', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-1');
      useCampaigns.getState().initializeDelveProgress('delve-1');

      const campaign = useCampaigns.getState().campaigns['delve-1'];
      expect(campaign.expedition?.delveProgress).toEqual({
        clues: [],
        objectives: [],
        contracts: [],
        exploredLocations: [],
        threatTrack: {
          currentPosition: 0,
          maxPosition: 9,
        },
        timeTrack: {
          currentPosition: 1,
          maxPosition: 16,
        },
      });
      expect(campaign.updatedAt).toBe(now);
    });

    it('addClue adds a clue to delve progress', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-2', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-2');
      useCampaigns.getState().initializeDelveProgress('delve-2');
      useCampaigns.getState().addClue('delve-2', {
        id: 'clue-1',
        type: 'swords',
        discoveredBy: 'knight-1',
      });

      const campaign = useCampaigns.getState().campaigns['delve-2'];
      const clues = campaign.expedition?.delveProgress?.clues;
      expect(clues).toHaveLength(1);
      expect(clues?.[0]).toEqual({
        id: 'clue-1',
        type: 'swords',
        discoveredBy: 'knight-1',
        discoveredAt: now,
      });
    });

    it('addObjective adds an objective to delve progress', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-3', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-3');
      useCampaigns.getState().initializeDelveProgress('delve-3');
      useCampaigns.getState().addObjective('delve-3', {
        id: 'obj-1',
        name: 'Test Objective',
        description: 'A test objective',
        status: 'active',
      });

      const campaign = useCampaigns.getState().campaigns['delve-3'];
      const objectives = campaign.expedition?.delveProgress?.objectives;
      expect(objectives).toHaveLength(1);
      expect(objectives?.[0]).toEqual({
        id: 'obj-1',
        name: 'Test Objective',
        description: 'A test objective',
        status: 'active',
      });
    });

    it('completeObjective marks objective as completed', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-4', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-4');
      useCampaigns.getState().initializeDelveProgress('delve-4');
      useCampaigns.getState().addObjective('delve-4', {
        id: 'obj-1',
        name: 'Test Objective',
        description: 'A test objective',
        status: 'active',
      });
      useCampaigns.getState().completeObjective('delve-4', 'obj-1', 'knight-1');

      const campaign = useCampaigns.getState().campaigns['delve-4'];
      const objective = campaign.expedition?.delveProgress?.objectives[0];
      expect(objective?.status).toBe('completed');
      expect(objective?.completedAt).toBe(now);
      expect(objective?.completedBy).toBe('knight-1');
    });

    it('addContract adds a contract to delve progress', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-5', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-5');
      useCampaigns.getState().initializeDelveProgress('delve-5');
      useCampaigns.getState().addContract('delve-5', {
        id: 'contract-1',
        name: 'Test Contract',
        description: 'A test contract',
        status: 'available',
      });

      const campaign = useCampaigns.getState().campaigns['delve-5'];
      const contracts = campaign.expedition?.delveProgress?.contracts;
      expect(contracts).toHaveLength(1);
      expect(contracts?.[0]).toEqual({
        id: 'contract-1',
        name: 'Test Contract',
        description: 'A test contract',
        status: 'available',
      });
    });

    it('acceptContract marks contract as accepted', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-6', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-6');
      useCampaigns.getState().initializeDelveProgress('delve-6');
      useCampaigns.getState().addContract('delve-6', {
        id: 'contract-1',
        name: 'Test Contract',
        description: 'A test contract',
        status: 'available',
      });
      useCampaigns.getState().acceptContract('delve-6', 'contract-1', 'knight-1');

      const campaign = useCampaigns.getState().campaigns['delve-6'];
      const contract = campaign.expedition?.delveProgress?.contracts[0];
      expect(contract?.status).toBe('accepted');
      expect(contract?.acceptedAt).toBe(now);
      expect(contract?.acceptedBy).toBe('knight-1');
    });

    it('completeContract marks contract as completed', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-7', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-7');
      useCampaigns.getState().initializeDelveProgress('delve-7');
      useCampaigns.getState().addContract('delve-7', {
        id: 'contract-1',
        name: 'Test Contract',
        description: 'A test contract',
        status: 'available',
      });
      useCampaigns.getState().completeContract('delve-7', 'contract-1', 'knight-1');

      const campaign = useCampaigns.getState().campaigns['delve-7'];
      const contract = campaign.expedition?.delveProgress?.contracts[0];
      expect(contract?.status).toBe('completed');
      expect(contract?.completedAt).toBe(now);
      expect(contract?.completedBy).toBe('knight-1');
    });

    it('exploreLocation adds location to explored locations', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-8', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-8');
      useCampaigns.getState().initializeDelveProgress('delve-8');
      useCampaigns.getState().exploreLocation('delve-8', 'location-1');

      const campaign = useCampaigns.getState().campaigns['delve-8'];
      const exploredLocations = campaign.expedition?.delveProgress?.exploredLocations;
      expect(exploredLocations).toContain('location-1');
    });

    it('exploreLocation does not add duplicate locations', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-9', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-9');
      useCampaigns.getState().initializeDelveProgress('delve-9');
      useCampaigns.getState().exploreLocation('delve-9', 'location-1');
      useCampaigns.getState().exploreLocation('delve-9', 'location-1');

      const campaign = useCampaigns.getState().campaigns['delve-9'];
      const exploredLocations = campaign.expedition?.delveProgress?.exploredLocations;
      expect(exploredLocations).toHaveLength(1);
      expect(exploredLocations).toContain('location-1');
    });

    it('setCurrentLocation sets the current location', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-10', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-10');
      useCampaigns.getState().initializeDelveProgress('delve-10');
      useCampaigns.getState().setCurrentLocation('delve-10', 'location-1');

      const campaign = useCampaigns.getState().campaigns['delve-10'];
      const currentLocation = campaign.expedition?.delveProgress?.currentLocation;
      expect(currentLocation).toBe('location-1');
    });

    it('advanceThreatTrack advances threat position', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-11', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-11');
      useCampaigns.getState().initializeDelveProgress('delve-11');
      useCampaigns.getState().advanceThreatTrack('delve-11', 2);

      const campaign = useCampaigns.getState().campaigns['delve-11'];
      const threatTrack = campaign.expedition?.delveProgress?.threatTrack;
      expect(threatTrack?.currentPosition).toBe(2);
    });

    it('advanceThreatTrack respects max position', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-12', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-12');
      useCampaigns.getState().initializeDelveProgress('delve-12');
      useCampaigns.getState().advanceThreatTrack('delve-12', 15); // More than max

      const campaign = useCampaigns.getState().campaigns['delve-12'];
      const threatTrack = campaign.expedition?.delveProgress?.threatTrack;
      expect(threatTrack?.currentPosition).toBe(9); // Max position
    });

    it('advanceTimeTrack advances time position', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-13', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-13');
      useCampaigns.getState().initializeDelveProgress('delve-13');
      useCampaigns.getState().advanceTimeTrack('delve-13', 3);

      const campaign = useCampaigns.getState().campaigns['delve-13'];
      const timeTrack = campaign.expedition?.delveProgress?.timeTrack;
      expect(timeTrack?.currentPosition).toBe(4); // Started at 1, advanced by 3
    });

    it('advanceTimeTrack respects max position', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-14', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-14');
      useCampaigns.getState().initializeDelveProgress('delve-14');
      useCampaigns.getState().advanceTimeTrack('delve-14', 20); // More than max

      const campaign = useCampaigns.getState().campaigns['delve-14'];
      const timeTrack = campaign.expedition?.delveProgress?.timeTrack;
      expect(timeTrack?.currentPosition).toBe(16); // Max position
    });

    it('setThreatTrackPosition sets specific position', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-15', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-15');
      useCampaigns.getState().initializeDelveProgress('delve-15');
      useCampaigns.getState().setThreatTrackPosition('delve-15', 5);

      const campaign = useCampaigns.getState().campaigns['delve-15'];
      const threatTrack = campaign.expedition?.delveProgress?.threatTrack;
      expect(threatTrack?.currentPosition).toBe(5);
    });

    it('setTimeTrackPosition sets specific position', () => {
      const now = 1_700_000_000_000;
      mockNow(now);

      useCampaigns.getState().addCampaign('delve-16', 'Delve Campaign');
      useCampaigns.getState().startExpedition('delve-16');
      useCampaigns.getState().initializeDelveProgress('delve-16');
      useCampaigns.getState().setTimeTrackPosition('delve-16', 8);

      const campaign = useCampaigns.getState().campaigns['delve-16'];
      const timeTrack = campaign.expedition?.delveProgress?.timeTrack;
      expect(timeTrack?.currentPosition).toBe(8);
    });
  });
});
