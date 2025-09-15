import { allKingdomsCatalog } from '@/catalogs/kingdoms';
import { Tier } from '@/catalogs/tier';
import { calculateExpeditionMonsterStage } from '@/features/kingdoms/utils';
import type {
  Campaign,
  CampaignsState,
  ClashResult,
  Clue,
  ExpeditionPhase,
  KnightExpeditionChoice,
  LootCard,
} from '@/models/campaign';
import { createDistrictWheel, rotateDistrictWheel } from '@/models/district';
import { getBestiaryWithExpansions } from '@/models/kingdom';
import { countCompletedInvestigations, ensureChapter, type Knight } from '@/models/knight';
import { DEVOUR_DRAGONS_CARD } from '@/models/special-cards';
import { create } from 'zustand';
import { useMonsters } from './monsters';
import { storage, STORAGE_KEYS } from './storage';

export type CampaignsActions = {
  // Core actions
  addCampaign: (
    campaignId: string,
    name: string,
    expansionSettings?: {
      [key: string]: {
        enabled: boolean;
        devourDragons?: boolean;
      };
    }
  ) => void;
  renameCampaign: (campaignId: string, name: string) => void;
  removeCampaign: (campaignId: string) => void;
  setCurrentCampaignId: (id?: string) => void;
  setFivePlayerMode: (campaignId: string, on: boolean) => void;
  setNotes: (campaignId: string, notes: string) => void;
  setExpansionEnabled: (
    campaignId: string,
    expansion: 'ttsf' | 'tbbh' | 'trkoe' | 'absolute-bastard' | 'ser-gallant',
    enabled: boolean
  ) => void;
  setDevourDragonsEnabled: (campaignId: string, enabled: boolean) => void;
  openCampaign: (campaignId: string) => void;
  closeCampaign: () => void;

  // Member actions
  addKnightToCampaign: (
    campaignId: string,
    knightUID: string,
    meta?: { catalogId: string; displayName: string }
  ) => object | { conflict: string };
  addKnightAsBenched: (
    campaignId: string,
    knightUID: string,
    meta?: { catalogId: string; displayName: string }
  ) => void;
  replaceCatalogKnight: (
    campaignId: string,
    catalogId: string,
    newKnightUID: string,
    meta?: { displayName?: string }
  ) => void;
  benchMember: (campaignId: string, knightUID: string, bench: boolean) => void;
  removeMember: (campaignId: string, knightUID: string) => void;
  setPartyLeader: (campaignId: string, knightUID: string) => void;
  unsetPartyLeader: (campaignId: string) => void;

  // Adventure actions
  setAdventureProgress: (
    campaignId: string,
    kingdomId: string,
    adventureId: string,
    opts?: { singleAttempt?: boolean; delta?: number }
  ) => void;

  // Contract actions
  setContractProgress: (
    campaignId: string,
    kingdomId: string,
    contractId: string,
    opts?: { singleAttempt?: boolean; delta?: number }
  ) => void;
  selectContract: (campaignId: string, kingdomId: string, contractId: string) => void;
  clearSelectedContract: (campaignId: string) => void;

  // Expedition actions
  startExpedition: (campaignId: string) => void;
  setExpeditionPhase: (campaignId: string, phase: ExpeditionPhase) => void;
  setKnightExpeditionChoice: (
    campaignId: string,
    knightUID: string,
    choice: KnightExpeditionChoice['choice'],
    questId?: string,
    investigationId?: string
  ) => void;
  clearKnightExpeditionChoice: (campaignId: string, knightUID: string) => void;
  completeKnightExpeditionChoice: (campaignId: string, knightUID: string) => void;
  setSelectedKingdom: (campaignId: string, kingdomId: string) => void;

  // District wheel actions
  initializeDistrictWheel: (
    campaignId: string,
    kingdomId: string,
    partyLeaderKnight?: Knight
  ) => void;
  updateDistrictWheelForCurrentStage: (
    campaignId: string,
    kingdomId: string,
    partyLeaderKnight?: Knight
  ) => void;
  rotateDistrictWheel: (campaignId: string) => void;
  replaceDistrictMonster: (
    campaignId: string,
    districtId: string,
    newMonsterId: string,
    partyLeaderKnight?: Knight
  ) => void;

  // Delve progress actions
  initializeDelveProgress: (campaignId: string) => void;
  addClue: (campaignId: string, clue: Omit<Clue, 'discoveredAt'>) => void;
  advanceThreatTrack: (campaignId: string, amount?: number) => void;
  advanceTimeTrack: (campaignId: string, amount?: number) => void;
  setThreatTrackPosition: (campaignId: string, position: number) => void;
  setTimeTrackPosition: (campaignId: string, position: number) => void;
  advanceCurseTracker: (campaignId: string, amount?: number) => void;
  setCurseTrackerPosition: (campaignId: string, position: number) => void;

  // Clash phase actions
  startClash: (campaignId: string, type: 'exhibition' | 'full') => void;
  completeClash: (
    campaignId: string,
    outcome: 'victory' | 'defeat',
    woundsDealt: number,
    woundsReceived: number,
    specialEffects?: string[]
  ) => void;

  // Rest phase actions
  startRestPhase: (campaignId: string) => void;
  useRestAbility: (campaignId: string, abilityId: string) => void;
  discardResourceTokens: (campaignId: string, count: number) => void;
  performMonsterRotation: (campaignId: string) => void;
  resolveCampfireTale: (
    campaignId: string,
    taleId: string,
    rapportBonus: number,
    result: string
  ) => void;

  // Scavenge actions
  scavengeCards: (campaignId: string, cards: LootCard[], obtainedBy: string) => void;

  // Spoils phase actions
  startSpoilsPhase: (campaignId: string) => void;
  addLootCard: (
    campaignId: string,
    type: 'kingdom-gear' | 'upgrade' | 'consumable-gear' | 'exhibition-clash' | 'full-clash',
    source: string,
    obtainedBy: string
  ) => void;
  exchangeLootForGold: (campaignId: string, lootCardId: string, goldAmount: number) => void;
  exchangeLootForGear: (campaignId: string, lootCardId: string, gearCardId: string) => void;
  completeQuest: (
    campaignId: string,
    knightUID: string,
    status: 'success' | 'failure',
    details: string,
    rewards?: string[]
  ) => void;
  endExpedition: (campaignId: string) => void;
};

export const useCampaigns = create<CampaignsState & CampaignsActions>((set, get) => {
  // Helper function to save state to AsyncStorage
  const saveToStorage = (newState: Partial<CampaignsState>) => {
    const currentState = get();
    const fullState = { ...currentState, ...newState };
    storage.save(STORAGE_KEYS.CAMPAIGNS, fullState).catch(console.error);
  };

  return {
    campaigns: {},
    currentCampaignId: undefined,

    // ---- Core actions ----
    openCampaign: campaignId => set(() => ({ currentCampaignId: campaignId })),
    closeCampaign: () => set(() => ({ currentCampaignId: undefined })),

    addCampaign: (campaignId, name, expansionSettings) =>
      set(s => {
        const now = Date.now();
        const c: Campaign = {
          kingdoms: [],
          campaignId,
          name,
          createdAt: now,
          updatedAt: now,
          members: [],
          settings: {
            fivePlayerMode: false,
            notes: '',
            expansions: {
              ttsf: {
                enabled: expansionSettings?.ttsf?.enabled ?? false,
                devourDragons: expansionSettings?.ttsf?.devourDragons ?? false,
              },
              tbbh: {
                enabled: expansionSettings?.tbbh?.enabled ?? false,
              },
              trkoe: {
                enabled: expansionSettings?.trkoe?.enabled ?? false,
              },
              'absolute-bastard': {
                enabled: expansionSettings?.['absolute-bastard']?.enabled ?? false,
              },
              'ser-gallant': {
                enabled: expansionSettings?.['ser-gallant']?.enabled ?? false,
              },
            },
          },
          partyLeaderUID: undefined,
        };
        const newState = {
          campaigns: { ...s.campaigns, [campaignId]: c },
          currentCampaignId: campaignId,
        };
        // Save to AsyncStorage
        saveToStorage(newState);
        return newState;
      }),

    renameCampaign: (campaignId, name) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;
        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: { ...c, name, updatedAt: Date.now() },
          },
        };
        // Save to AsyncStorage
        saveToStorage(newState);
        return newState;
      }),

    removeCampaign: campaignId =>
      set(s => {
        const { [campaignId]: removed, ...rest } = s.campaigns;
        const newState = {
          campaigns: rest,
          currentCampaignId: s.currentCampaignId === campaignId ? undefined : s.currentCampaignId,
        };
        // Save to AsyncStorage
        saveToStorage(newState);
        return newState;
      }),

    setCurrentCampaignId: id =>
      set(s => {
        const newState = { ...s, currentCampaignId: id };
        // Save to AsyncStorage
        saveToStorage(newState);
        return newState;
      }),

    setFivePlayerMode: (campaignId, on) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;
        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              settings: { ...c.settings, fivePlayerMode: on },
              updatedAt: Date.now(),
            },
          },
        };
        // Save to AsyncStorage
        saveToStorage(newState);
        return newState;
      }),

    setNotes: (campaignId, notes) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;
        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              settings: { ...c.settings, notes },
              updatedAt: Date.now(),
            },
          },
        };
        // Save to AsyncStorage
        saveToStorage(newState);
        return newState;
      }),

    setExpansionEnabled: (campaignId, expansion, enabled) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              settings: {
                ...c.settings,
                expansions: {
                  ...c.settings.expansions,
                  [expansion]: {
                    ...c.settings.expansions?.[expansion],
                    enabled,
                  },
                },
              },
              updatedAt: Date.now(),
            },
          },
        };

        // Save to AsyncStorage
        saveToStorage(newState);
        return newState;
      }),

    setDevourDragonsEnabled: (campaignId, enabled) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              settings: {
                ...c.settings,
                expansions: {
                  ...c.settings.expansions,
                  ttsf: {
                    ...c.settings.expansions?.ttsf,
                    enabled: c.settings.expansions?.ttsf?.enabled ?? false,
                    devourDragons: enabled,
                  },
                },
              },
            },
          },
        };

        // Save to AsyncStorage
        saveToStorage(newState);
        return newState;
      }),

    // ---- Member actions ----
    addKnightToCampaign: (campaignId, knightUID, meta) => {
      const state = get();
      const campaign = state.campaigns[campaignId];
      if (!campaign) return { conflict: 'Campaign not found' };

      // Check if knight already exists
      const existingKnight = campaign.members.find(m => m.knightUID === knightUID);
      if (existingKnight) {
        // Update existing knight to be active
        set(s => {
          const c = s.campaigns[campaignId];
          if (!c) return s;

          const updatedMembers = c.members.map(member =>
            member.knightUID === knightUID ? { ...member, isActive: true } : member
          );

          const newState = {
            campaigns: {
              ...s.campaigns,
              [campaignId]: {
                ...c,
                members: updatedMembers,
                updatedAt: Date.now(),
              },
            },
          };
          // Save to AsyncStorage
          storage.save(STORAGE_KEYS.CAMPAIGNS, newState).catch(console.error);
          return newState;
        });
        return {};
      }

      // Check for catalog conflict (only for new knights)
      if (meta?.catalogId) {
        const existingMember = campaign.members.find(m => m.catalogId === meta.catalogId);
        if (existingMember) {
          return { conflict: { existingUID: existingMember.knightUID } };
        }
      }

      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        const newMember = {
          knightUID,
          displayName: meta?.displayName || 'Unknown Knight',
          catalogId: meta?.catalogId || 'unknown',
          isActive: true,
          joinedAt: Date.now(),
        };

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              members: [...c.members, newMember],
              updatedAt: Date.now(),
            },
          },
        };
        // Save to AsyncStorage
        storage.save(STORAGE_KEYS.CAMPAIGNS, newState).catch(console.error);
        return newState;
      });

      return {};
    },

    addKnightAsBenched: (campaignId, knightUID, meta) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        // Check if knight already exists
        const existingKnight = c.members.find(m => m.knightUID === knightUID);
        if (existingKnight) {
          // Update existing knight to be benched
          const updatedMembers = c.members.map(member =>
            member.knightUID === knightUID ? { ...member, isActive: false } : member
          );

          return {
            campaigns: {
              ...s.campaigns,
              [campaignId]: {
                ...c,
                members: updatedMembers,
                updatedAt: Date.now(),
              },
            },
          };
        }

        // Add new knight as benched
        const newMember = {
          knightUID,
          displayName: meta?.displayName || 'Unknown Knight',
          catalogId: meta?.catalogId || 'unknown',
          isActive: false,
          joinedAt: Date.now(),
        };

        return {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              members: [...c.members, newMember],
              updatedAt: Date.now(),
            },
          },
        };
      }),

    replaceCatalogKnight: (campaignId, catalogId, newKnightUID, meta) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        // Find the existing member with this catalog ID
        const existingMember = c.members.find(m => m.catalogId === catalogId);
        if (!existingMember) return s;

        // Check if the new knight already exists
        const existingNewKnight = c.members.find(m => m.knightUID === newKnightUID);

        let updatedMembers;
        if (existingNewKnight) {
          // Update the existing new knight to be active and replace the catalog
          updatedMembers = c.members.map(member => {
            if (member.knightUID === newKnightUID) {
              return {
                ...member,
                catalogId: catalogId,
                displayName: meta?.displayName || member.displayName,
                isActive: true,
              };
            } else if (member.catalogId === catalogId) {
              return {
                ...member,
                isActive: false,
              };
            }
            return member;
          });
        } else {
          // Add new knight and bench the old one
          updatedMembers = c.members.map(member =>
            member.catalogId === catalogId ? { ...member, isActive: false } : member
          );

          updatedMembers.push({
            knightUID: newKnightUID,
            displayName: meta?.displayName || 'Unknown Knight',
            catalogId: catalogId,
            isActive: true,
            joinedAt: Date.now(),
          });
        }

        // Update party leader if the replaced member was the leader
        let updatedPartyLeaderUID = c.partyLeaderUID;
        if (c.partyLeaderUID === existingMember.knightUID) {
          updatedPartyLeaderUID = newKnightUID;
        }

        return {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              members: updatedMembers,
              partyLeaderUID: updatedPartyLeaderUID,
              updatedAt: Date.now(),
            },
          },
        };
      }),

    benchMember: (campaignId, knightUID, bench) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        const updatedMembers = c.members.map(member =>
          member.knightUID === knightUID ? { ...member, isActive: !bench } : member
        );

        // Clear party leader if the benched member was the leader
        let updatedPartyLeaderUID = c.partyLeaderUID;
        if (bench && c.partyLeaderUID === knightUID) {
          updatedPartyLeaderUID = undefined;
        }

        return {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              members: updatedMembers,
              partyLeaderUID: updatedPartyLeaderUID,
              updatedAt: Date.now(),
            },
          },
        };
      }),

    removeMember: (campaignId, knightUID) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        const updatedMembers = c.members.filter(member => member.knightUID !== knightUID);
        const updatedPartyLeaderUID = c.partyLeaderUID === knightUID ? undefined : c.partyLeaderUID;

        return {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              members: updatedMembers,
              partyLeaderUID: updatedPartyLeaderUID,
              updatedAt: Date.now(),
            },
          },
        };
      }),

    setPartyLeader: (campaignId, knightUID) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        // Check if the knight exists
        let existingKnight = c.members.find(m => m.knightUID === knightUID);

        // If knight doesn't exist, add them as active
        if (!existingKnight) {
          existingKnight = {
            knightUID,
            displayName: 'Unknown Knight',
            catalogId: 'unknown',
            isActive: true,
            joinedAt: Date.now(),
          };
        }

        // Update members to set isLeader flag and ensure knight is active
        const updatedMembers = c.members.map(member => ({
          ...member,
          isLeader: member.knightUID === knightUID,
          isActive: member.knightUID === knightUID ? true : member.isActive,
        }));

        // Add the knight if they didn't exist
        if (!c.members.find(m => m.knightUID === knightUID)) {
          updatedMembers.push({
            ...existingKnight,
            isLeader: true,
            isActive: true,
          });
        }

        return {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              members: updatedMembers,
              partyLeaderUID: knightUID,
              updatedAt: Date.now(),
            },
          },
        };
      }),

    unsetPartyLeader: campaignId =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        // Clear isLeader flag from all members
        const updatedMembers = c.members.map(member => ({
          ...member,
          isLeader: false,
        }));

        return {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              members: updatedMembers,
              partyLeaderUID: undefined,
              updatedAt: Date.now(),
            },
          },
        };
      }),

    // ---- Adventure actions ----
    setAdventureProgress: (campaignId, kingdomId, adventureId, opts) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        // Find or create kingdom
        let kingdom = c.kingdoms.find(k => k.kingdomId === kingdomId);
        if (!kingdom) {
          kingdom = {
            kingdomId,
            name: kingdomId, // Use kingdomId as name for now
            chapter: 1, // Default to chapter 1
            adventures: [],
          };
        }

        const existing = kingdom.adventures.find(a => a.id === adventureId);
        const { singleAttempt = false, delta = 1 } = opts ?? {};

        let newState;
        if (singleAttempt) {
          // Mark as completed (idempotent)
          newState = {
            id: adventureId,
            completedCount: 1,
          };
        } else if (existing) {
          // Increment/decrement count
          newState = {
            ...existing,
            completedCount: existing.completedCount + delta,
          };
        } else {
          // Create new
          newState = {
            id: adventureId,
            completedCount: delta,
          };
        }

        const updatedAdventures = existing
          ? kingdom.adventures.map(a => (a.id === adventureId ? newState : a))
          : [...kingdom.adventures, newState];

        const updatedKingdoms = c.kingdoms.find(k => k.kingdomId === kingdomId)
          ? c.kingdoms.map(k =>
              k.kingdomId === kingdomId ? { ...k, adventures: updatedAdventures } : k
            )
          : [...c.kingdoms, { ...kingdom!, adventures: updatedAdventures }];

        return {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              kingdoms: updatedKingdoms,
              updatedAt: Date.now(),
            },
          },
        };
      }),

    // ---- Contract actions ----
    setContractProgress: (campaignId, kingdomId, contractId, opts) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        // Find or create kingdom
        let kingdom = c.kingdoms.find(k => k.kingdomId === kingdomId);
        if (!kingdom) {
          kingdom = {
            kingdomId,
            name: kingdomId, // Use kingdomId as name for now
            chapter: 1, // Default to chapter 1
            adventures: [],
            contracts: [],
          };
        }

        const existing = kingdom.contracts?.find(contract => contract.id === contractId);
        const { singleAttempt = false, delta = 1 } = opts ?? {};

        let newState;
        if (singleAttempt) {
          // Mark as completed (idempotent)
          newState = {
            id: contractId,
            completedCount: 1,
          };
        } else if (existing) {
          // Increment/decrement count
          newState = {
            ...existing,
            completedCount: existing.completedCount + delta,
          };
        } else {
          // Create new
          newState = {
            id: contractId,
            completedCount: delta,
          };
        }

        const updatedContracts = existing
          ? kingdom.contracts?.map(contract => (contract.id === contractId ? newState : contract))
          : [...(kingdom.contracts || []), newState];

        const updatedKingdoms = c.kingdoms.find(k => k.kingdomId === kingdomId)
          ? c.kingdoms.map(k =>
              k.kingdomId === kingdomId ? { ...k, contracts: updatedContracts } : k
            )
          : [...c.kingdoms, { ...kingdom!, contracts: updatedContracts }];

        return {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              kingdoms: updatedKingdoms,
              updatedAt: Date.now(),
            },
          },
        };
      }),

    // ---- Contract selection actions ----
    selectContract: (campaignId, kingdomId, contractId) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              selectedContract: {
                kingdomId,
                contractId,
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    clearSelectedContract: campaignId =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              selectedContract: undefined,
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    // Expedition actions
    startExpedition: campaignId =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                currentPhase: 'vision' as ExpeditionPhase,
                knightChoices: [],
                phaseStartedAt: Date.now(),
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    setExpeditionPhase: (campaignId, phase) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                currentPhase: phase,
                phaseStartedAt: Date.now(),
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    setKnightExpeditionChoice: (campaignId, knightUID, choice, questId, investigationId) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        // If expedition doesn't exist yet, create it with vision phase
        const expedition = c.expedition || {
          currentPhase: 'vision' as ExpeditionPhase,
          knightChoices: [],
          phaseStartedAt: Date.now(),
        };

        const existingChoiceIndex = expedition.knightChoices.findIndex(
          choice => choice.knightUID === knightUID
        );

        const newChoice: KnightExpeditionChoice = {
          knightUID,
          choice,
          questId,
          investigationId,
          status: 'in-progress',
        };

        const updatedChoices =
          existingChoiceIndex >= 0
            ? expedition.knightChoices.map((choice, index) =>
                index === existingChoiceIndex ? newChoice : choice
              )
            : [...expedition.knightChoices, newChoice];

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...expedition,
                knightChoices: updatedChoices,
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    clearKnightExpeditionChoice: (campaignId, knightUID) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition) return s;

        const updatedChoices = c.expedition.knightChoices.filter(
          choice => choice.knightUID !== knightUID
        );

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                knightChoices: updatedChoices,
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    completeKnightExpeditionChoice: (campaignId, knightUID) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition) return s;

        const updatedChoices = c.expedition.knightChoices.map(choice =>
          choice.knightUID === knightUID ? { ...choice, status: 'completed' as const } : choice
        );

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                knightChoices: updatedChoices,
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    setSelectedKingdom: (campaignId, kingdomId) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              selectedKingdomId: kingdomId,
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    // District wheel actions
    updateDistrictWheelForCurrentStage: (
      campaignId: string,
      kingdomId: string,
      partyLeaderKnight?: Knight
    ) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c || !c.expedition || !c.expedition.districtWheel) return s;

        // Get available monsters for the kingdom
        const kingdomCatalog = allKingdomsCatalog.find(k => k.id === kingdomId);
        if (!kingdomCatalog || !kingdomCatalog.districts) return s;

        const bestiary = getBestiaryWithExpansions(kingdomCatalog, c.settings.expansions);
        if (!bestiary) return s;

        // Get party leader's current progress to determine monster level
        // Use the party leader's actual current chapter, not the kingdom's stored chapter
        const currentChapter = partyLeaderKnight?.sheet.chapter || 1;

        // Get party leader's expedition choice and completed investigations
        const partyLeaderChoice = c.expedition?.knightChoices.find(
          choice => choice.knightUID === c.partyLeaderUID
        );
        const partyLeaderCompletedInvestigations = partyLeaderKnight
          ? countCompletedInvestigations(ensureChapter(partyLeaderKnight.sheet, currentChapter))
          : 0;

        // Calculate the correct stage index based on expedition choices
        const stageIndex = calculateExpeditionMonsterStage(
          partyLeaderChoice,
          currentChapter,
          c.expedition?.knightChoices || [],
          partyLeaderCompletedInvestigations
        );

        // Filter to monsters that have valid stage values for the current stage
        const availableMonsters = bestiary.monsters.filter(m => {
          if (stageIndex < 0 || stageIndex >= bestiary.stages.length) {
            return false;
          }
          const stageValue = bestiary.stages[stageIndex]?.[m.id];
          return stageValue !== null && stageValue !== undefined;
        });

        // Check if we need to update the district wheel
        const currentAssignments = c.expedition.districtWheel.assignments;
        const currentMonsterIds = currentAssignments.map(a => a.monsterId);
        const availableMonsterIds = availableMonsters.map(m => m.id);

        // If any current monsters are not available at the new stage, reinitialize
        const needsUpdate = currentMonsterIds.some(id => !availableMonsterIds.includes(id));

        if (needsUpdate) {
          console.log('District wheel stage changed, reinitializing with new monsters:', {
            oldStage: c.expedition.districtWheel.currentRotation,
            newStage: stageIndex,
            availableMonsters: availableMonsterIds,
            currentMonsters: currentMonsterIds,
          });

          // Check if Devour Dragons is enabled
          const devourDragonsEnabled = c.settings.expansions?.ttsf?.devourDragons ?? false;

          // Create monster pool - include Devour Dragons card if enabled
          let monsterPool = [...availableMonsters];
          if (devourDragonsEnabled) {
            // Add a special marker for the Devour Dragons card
            monsterPool.push({ id: DEVOUR_DRAGONS_CARD.id, type: 'kingdom' as const });
          }

          const shuffledMonsters = [...monsterPool].sort(() => Math.random() - 0.5);
          const assignments = kingdomCatalog.districts.map((districtName, index) => {
            if (index < shuffledMonsters.length) {
              const selectedMonster = shuffledMonsters[index];
              return {
                districtId: `${kingdomId}-${districtName.toLowerCase().replace(/\s+/g, '-')}`,
                monsterId: selectedMonster.id,
              };
            } else {
              const fallbackMonster = shuffledMonsters[0];
              return {
                districtId: `${kingdomId}-${districtName.toLowerCase().replace(/\s+/g, '-')}`,
                monsterId: fallbackMonster?.id || '',
              };
            }
          });

          const districtWheel = createDistrictWheel(
            kingdomId,
            kingdomCatalog.districts,
            assignments
          );

          const newState = {
            campaigns: {
              ...s.campaigns,
              [campaignId]: {
                ...c,
                expedition: {
                  ...c.expedition,
                  districtWheel,
                },
                updatedAt: Date.now(),
              },
            },
          };
          saveToStorage(newState);
          return newState;
        }

        return s;
      }),

    initializeDistrictWheel: (campaignId, kingdomId, partyLeaderKnight) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c || !c.expedition) return s;

        // Get available monsters for the kingdom
        const kingdomCatalog = allKingdomsCatalog.find(k => k.id === kingdomId);
        if (!kingdomCatalog || !kingdomCatalog.districts) return s;

        const bestiary = getBestiaryWithExpansions(kingdomCatalog, c.settings.expansions);
        if (!bestiary) return s;

        // Get party leader's current progress to determine monster level
        // Use the party leader's actual current chapter, not the kingdom's stored chapter
        const currentChapter = partyLeaderKnight?.sheet.chapter || 1;

        // Get party leader's expedition choice and completed investigations
        const partyLeaderChoice = c.expedition?.knightChoices.find(
          choice => choice.knightUID === c.partyLeaderUID
        );
        const partyLeaderCompletedInvestigations = partyLeaderKnight
          ? countCompletedInvestigations(ensureChapter(partyLeaderKnight.sheet, currentChapter))
          : 0;

        // Calculate the correct stage index based on expedition choices
        const stageIndex = calculateExpeditionMonsterStage(
          partyLeaderChoice,
          currentChapter,
          c.expedition?.knightChoices || [],
          partyLeaderCompletedInvestigations
        );

        // Create random monster assignments for each district (no duplicates)
        // Filter to monsters that have valid stage values for the current stage
        // Both kingdom and wandering monsters can be used in the district wheel
        const availableMonsters = bestiary.monsters.filter(m => {
          // Check if the stage index is within bounds
          if (stageIndex < 0 || stageIndex >= bestiary.stages.length) {
            return false;
          }

          // Check if this monster has a valid (non-null) stage value for the current stage
          const stageValue = bestiary.stages[stageIndex]?.[m.id];
          return stageValue !== null && stageValue !== undefined;
        });

        // Check if Devour Dragons is enabled
        const devourDragonsEnabled = c.settings.expansions?.ttsf?.devourDragons ?? false;

        // Create monster pool - include Devour Dragons card if enabled
        let monsterPool = [...availableMonsters];
        if (devourDragonsEnabled) {
          // Add a special marker for the Devour Dragons card
          monsterPool.push({ id: DEVOUR_DRAGONS_CARD.id, type: 'kingdom' as const });
        }

        const shuffledMonsters = [...monsterPool].sort(() => Math.random() - 0.5);

        // Create unique monster assignments for each district
        const assignments = kingdomCatalog.districts.map((districtName, index) => {
          if (index < shuffledMonsters.length) {
            // We have enough unique monsters
            const selectedMonster = shuffledMonsters[index];
            return {
              districtId: `${kingdomId}-${districtName.toLowerCase().replace(/\s+/g, '-')}`,
              monsterId: selectedMonster.id,
            };
          } else {
            // If we don't have enough unique monsters, we need to add more monsters
            // This should not happen in normal gameplay, but let's handle it gracefully
            console.warn(
              `Not enough unique monsters for district ${districtName}. Available: ${shuffledMonsters.length}, Needed: ${kingdomCatalog.districts.length}. This suggests an issue with monster availability.`
            );

            // For now, let's use the first available monster as a fallback
            // In a real scenario, we should investigate why we don't have enough monsters
            const fallbackMonster = shuffledMonsters[0];
            return {
              districtId: `${kingdomId}-${districtName.toLowerCase().replace(/\s+/g, '-')}`,
              monsterId: fallbackMonster?.id || '', // Use fallback or empty string
            };
          }
        });

        // Handle any Devour Dragons cards that were randomly selected during initialization
        let finalAssignments = [...assignments];
        if (devourDragonsEnabled) {
          // Check if any assignments have the Devour Dragons card
          const devourCardAssignments = finalAssignments.filter(
            a => a.monsterId === DEVOUR_DRAGONS_CARD.id
          );

          if (devourCardAssignments.length > 0) {
            // For each Devour Dragons card assignment, replace it with a random available monster
            devourCardAssignments.forEach(devourAssignment => {
              // Get remaining available monsters (excluding already assigned ones)
              const assignedMonsterIds = finalAssignments.map(a => a.monsterId);
              const remainingMonsters = availableMonsters.filter(
                m => !assignedMonsterIds.includes(m.id)
              );

              if (remainingMonsters.length > 0) {
                const randomMonster =
                  remainingMonsters[Math.floor(Math.random() * remainingMonsters.length)];

                // Replace the Devour Dragons card with the random monster
                finalAssignments = finalAssignments.map(assignment => {
                  if (assignment.districtId === devourAssignment.districtId) {
                    return {
                      ...assignment,
                      monsterId: randomMonster.id,
                    };
                  }
                  return assignment;
                });
              }
            });

            // Now assign the Devour Dragons card to an eligible monster
            const monstersState = useMonsters.getState();
            const eligibleAssignments = finalAssignments.filter(assignment => {
              const monsterStats = monstersState.byId[assignment.monsterId];
              if (!monsterStats) return false;

              // If monster has no tier defined, it's eligible
              if (!monsterStats.tier) return true;

              // If monster has a tier, check if it's excluded
              return !DEVOUR_DRAGONS_CARD.assignmentRestrictions?.excludedTiers?.includes(
                monsterStats.tier as Tier
              );
            });

            if (eligibleAssignments.length > 0) {
              const randomEligibleAssignment =
                eligibleAssignments[Math.floor(Math.random() * eligibleAssignments.length)];

              finalAssignments = finalAssignments.map(assignment => {
                if (assignment.districtId === randomEligibleAssignment.districtId) {
                  return {
                    ...assignment,
                    specialCard: DEVOUR_DRAGONS_CARD.id,
                  };
                }
                return assignment;
              });
            }
          }
        }

        const districtWheel = createDistrictWheel(
          kingdomId,
          kingdomCatalog.districts,
          finalAssignments
        );

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                districtWheel,
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    rotateDistrictWheel: campaignId =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c || !c.expedition || !c.expedition.districtWheel) return s;

        const rotatedWheel = rotateDistrictWheel(c.expedition.districtWheel);

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                districtWheel: rotatedWheel,
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    replaceDistrictMonster: (
      campaignId: string,
      districtId: string,
      newMonsterId: string,
      partyLeaderKnight?: Knight
    ) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c || !c.expedition?.districtWheel) return s;

        const currentWheel = c.expedition.districtWheel;

        // Find the current kingdom to get available monsters
        const kingdomCatalog = allKingdomsCatalog.find(k => k.id === currentWheel.kingdomId);
        if (!kingdomCatalog) return s;

        const bestiary = getBestiaryWithExpansions(kingdomCatalog, c.settings.expansions);
        if (!bestiary) return s;

        // Get current progress for monster level
        // Use the party leader's actual current chapter, not the kingdom's stored chapter
        const currentChapter = partyLeaderKnight?.sheet.chapter || 1;

        // Get party leader's expedition choice and completed investigations
        const partyLeaderChoice = c.expedition?.knightChoices.find(
          choice => choice.knightUID === c.partyLeaderUID
        );
        const partyLeaderCompletedInvestigations = partyLeaderKnight
          ? countCompletedInvestigations(ensureChapter(partyLeaderKnight.sheet, currentChapter))
          : 0;

        // Calculate the correct stage index based on expedition choices
        const stageIndex = calculateExpeditionMonsterStage(
          partyLeaderChoice,
          currentChapter,
          c.expedition?.knightChoices || [],
          partyLeaderCompletedInvestigations
        );

        // Filter to monsters that have valid stage values for the current stage
        // Both kingdom and wandering monsters can be used in the district wheel
        const availableMonsters = bestiary.monsters.filter(m => {
          // Check if the stage index is within bounds
          if (stageIndex < 0 || stageIndex >= bestiary.stages.length) {
            return false;
          }

          // Check if this monster has a valid (non-null) stage value for the current stage
          const stageValue = bestiary.stages[stageIndex]?.[m.id];
          return stageValue !== null && stageValue !== undefined;
        });
        // Handle special card selection (like Devour Dragons)
        if (newMonsterId === DEVOUR_DRAGONS_CARD.id) {
          // Replace the special card with a random available monster
          const randomMonster =
            availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
          if (!randomMonster) return s;

          // Update the assignment with the random monster
          const newAssignments = currentWheel.assignments.map(assignment => {
            if (assignment.districtId === districtId) {
              return {
                ...assignment,
                monsterId: randomMonster.id,
              };
            }
            return assignment;
          });

          // Now randomly assign the Devour Dragons card to an eligible monster
          // Find monsters that are not King or Dragon tier (or have no tier defined)
          const monstersState = useMonsters.getState();
          const eligibleAssignments = newAssignments.filter(assignment => {
            const monsterStats = monstersState.byId[assignment.monsterId];
            if (!monsterStats) return false;

            // If monster has no tier defined, it's eligible
            if (!monsterStats.tier) return true;

            // If monster has a tier, check if it's excluded
            return !DEVOUR_DRAGONS_CARD.assignmentRestrictions?.excludedTiers?.includes(
              monsterStats.tier as Tier
            );
          });

          if (eligibleAssignments.length > 0) {
            const randomEligibleAssignment =
              eligibleAssignments[Math.floor(Math.random() * eligibleAssignments.length)];

            const finalAssignments = newAssignments.map(assignment => {
              if (assignment.districtId === randomEligibleAssignment.districtId) {
                return {
                  ...assignment,
                  specialCard: DEVOUR_DRAGONS_CARD.id,
                };
              }
              return assignment;
            });

            const updatedWheel = {
              ...currentWheel,
              assignments: finalAssignments,
            };

            const newState = {
              campaigns: {
                ...s.campaigns,
                [campaignId]: {
                  ...c,
                  expedition: {
                    ...c.expedition,
                    districtWheel: updatedWheel,
                  },
                  updatedAt: Date.now(),
                },
              },
            };

            saveToStorage(newState);
            return newState;
          }

          // If no eligible monsters, just replace with random monster without special card
          const updatedWheel = {
            ...currentWheel,
            assignments: newAssignments,
          };

          const newState = {
            campaigns: {
              ...s.campaigns,
              [campaignId]: {
                ...c,
                expedition: {
                  ...c.expedition,
                  districtWheel: updatedWheel,
                },
                updatedAt: Date.now(),
              },
            },
          };

          saveToStorage(newState);
          return newState;
        }

        const newMonster = availableMonsters.find(m => m.id === newMonsterId);
        if (!newMonster) return s;

        // Create new assignments array
        const newAssignments = currentWheel.assignments.map(assignment => {
          if (assignment.districtId === districtId) {
            // Replace monster in the target district
            return {
              ...assignment,
              monsterId: newMonsterId,
            };
          } else if (assignment.monsterId === newMonsterId) {
            // Remove the new monster from its current district (if any)
            // We'll need to assign a different monster to this district
            const availableForReplacement = availableMonsters.filter(
              m =>
                m.id !== newMonsterId &&
                !currentWheel.assignments.some(
                  a => a.monsterId === m.id && a.districtId !== assignment.districtId
                )
            );

            if (availableForReplacement.length > 0) {
              const replacementMonster = availableForReplacement[0];
              return {
                ...assignment,
                monsterId: replacementMonster.id,
              };
            }
          }
          return assignment;
        });

        const updatedWheel = {
          ...currentWheel,
          assignments: newAssignments,
        };

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                districtWheel: updatedWheel,
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    // Delve progress actions
    initializeDelveProgress: campaignId =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  clues: [],
                  objectives: [],
                  contracts: [],
                  exploredLocations: [],
                  threatTrack: {
                    currentPosition: 0,
                    maxPosition: 9,
                  },
                  timeTrack: {
                    currentPosition: 0,
                    maxPosition: 16,
                  },
                  curseTracker: {
                    currentPosition: 0,
                    maxPosition: 4,
                  },
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    addClue: (campaignId, clue) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const newClue: Clue = {
          ...clue,
          discoveredAt: Date.now(),
        };

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  clues: [...c.expedition.delveProgress.clues, newClue],
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    advanceThreatTrack: (campaignId, amount = 1) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const currentPos = c.expedition.delveProgress.threatTrack.currentPosition;
        const maxPos = c.expedition.delveProgress.threatTrack.maxPosition;
        const newPosition = Math.min(currentPos + amount, maxPos);

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  threatTrack: {
                    ...c.expedition.delveProgress.threatTrack,
                    currentPosition: newPosition,
                  },
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    advanceTimeTrack: (campaignId, amount = 1) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const currentPos = c.expedition.delveProgress.timeTrack.currentPosition;
        const maxPos = c.expedition.delveProgress.timeTrack.maxPosition;
        const newPosition = Math.min(currentPos + amount, maxPos);

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  timeTrack: {
                    ...c.expedition.delveProgress.timeTrack,
                    currentPosition: newPosition,
                  },
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    setThreatTrackPosition: (campaignId, position) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const maxPos = c.expedition.delveProgress.threatTrack.maxPosition;
        const newPosition = Math.max(0, Math.min(position, maxPos));

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  threatTrack: {
                    ...c.expedition.delveProgress.threatTrack,
                    currentPosition: newPosition,
                  },
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    setTimeTrackPosition: (campaignId, position) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const maxPos = c.expedition.delveProgress.timeTrack.maxPosition;
        const newPosition = Math.max(0, Math.min(position, maxPos));

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  timeTrack: {
                    ...c.expedition.delveProgress.timeTrack,
                    currentPosition: newPosition,
                  },
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    advanceCurseTracker: (campaignId, amount = 1) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const currentPos = c.expedition.delveProgress.curseTracker.currentPosition;
        const maxPos = c.expedition.delveProgress.curseTracker.maxPosition;
        const newPosition = Math.min(currentPos + amount, maxPos);

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  curseTracker: {
                    ...c.expedition.delveProgress.curseTracker,
                    currentPosition: newPosition,
                  },
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    setCurseTrackerPosition: (campaignId, position) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const maxPos = c.expedition.delveProgress.curseTracker.maxPosition;
        const newPosition = Math.max(0, Math.min(position, maxPos));

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  curseTracker: {
                    ...c.expedition.delveProgress.curseTracker,
                    currentPosition: newPosition,
                  },
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    // Clash phase actions
    startClash: (campaignId, type) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                currentPhase: 'clash' as ExpeditionPhase,
                phaseStartedAt: Date.now(),
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    completeClash: (campaignId, outcome, woundsDealt, woundsReceived, specialEffects) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition) return s;

        const isFirstClash = c.expedition.currentPhase === 'clash';
        const clashResult: ClashResult = {
          type: isFirstClash ? 'exhibition' : 'full',
          outcome,
          completedAt: Date.now(),
          woundsDealt,
          woundsReceived,
          specialEffects,
        };

        // Determine next phase based on clash type
        let nextPhase: ExpeditionPhase;
        if (isFirstClash) {
          // First clash (exhibition): victory → rest, defeat → spoils
          nextPhase = outcome === 'victory' ? 'rest' : 'spoils';
        } else {
          // Second clash (full): always go to spoils regardless of outcome
          nextPhase = 'spoils';
        }

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                clashResults: [...(c.expedition.clashResults || []), clashResult],
                currentPhase: nextPhase,
                phaseStartedAt: Date.now(),
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    // Rest phase actions
    startRestPhase: campaignId =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                currentPhase: 'rest' as ExpeditionPhase,
                phaseStartedAt: Date.now(),
                restProgress: {
                  restAbilitiesUsed: [],
                  resourceTokensDiscarded: 0,
                  monsterRotationPerformed: false,
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    useRestAbility: (campaignId, abilityId) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.restProgress) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                restProgress: {
                  ...c.expedition.restProgress,
                  restAbilitiesUsed: [...c.expedition.restProgress.restAbilitiesUsed, abilityId],
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    discardResourceTokens: (campaignId, count) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.restProgress) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                restProgress: {
                  ...c.expedition.restProgress,
                  resourceTokensDiscarded:
                    c.expedition.restProgress.resourceTokensDiscarded + count,
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    performMonsterRotation: campaignId =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.restProgress) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                restProgress: {
                  ...c.expedition.restProgress,
                  monsterRotationPerformed: true,
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    resolveCampfireTale: (campaignId, taleId, rapportBonus, result) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.restProgress) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                restProgress: {
                  ...c.expedition.restProgress,
                  campfireTaleResolved: {
                    taleId,
                    rapportBonus,
                    result,
                  },
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    // ---- Scavenge actions ----
    scavengeCards: (campaignId, cards, obtainedBy) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition) return s;

        // Initialize spoilsProgress if it doesn't exist
        if (!c.expedition.spoilsProgress) {
          c.expedition.spoilsProgress = {
            lootDeck: [],
            goldEarned: 0,
            gearAcquired: [],
            questCompletions: [],
          };
        }

        // Add obtainedBy to each card
        const cardsWithObtainer = cards.map(card => ({
          ...card,
          obtainedBy,
        }));

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                spoilsProgress: {
                  ...c.expedition.spoilsProgress,
                  lootDeck: [...c.expedition.spoilsProgress.lootDeck, ...cardsWithObtainer],
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    // Spoils phase actions
    startSpoilsPhase: campaignId =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                currentPhase: 'spoils' as ExpeditionPhase,
                phaseStartedAt: Date.now(),
                spoilsProgress: {
                  lootDeck: [],
                  goldEarned: 0,
                  gearAcquired: [],
                  questCompletions: [],
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    addLootCard: (campaignId, type, source, obtainedBy) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.spoilsProgress) return s;

        const lootCard: LootCard = {
          id: `loot-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          type,
          source,
          obtainedAt: Date.now(),
          obtainedBy,
        };

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                spoilsProgress: {
                  ...c.expedition.spoilsProgress,
                  lootDeck: [...c.expedition.spoilsProgress.lootDeck, lootCard],
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    exchangeLootForGold: (campaignId, lootCardId, goldAmount) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.spoilsProgress) return s;

        const updatedLootDeck = c.expedition.spoilsProgress.lootDeck.map(loot =>
          loot.id === lootCardId
            ? { ...loot, exchangedFor: 'gold' as const, exchangedAt: Date.now() }
            : loot
        );

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                spoilsProgress: {
                  ...c.expedition.spoilsProgress,
                  lootDeck: updatedLootDeck,
                  goldEarned: c.expedition.spoilsProgress.goldEarned + goldAmount,
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    exchangeLootForGear: (campaignId, lootCardId, gearCardId) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.spoilsProgress) return s;

        const updatedLootDeck = c.expedition.spoilsProgress.lootDeck.map(loot =>
          loot.id === lootCardId
            ? { ...loot, exchangedFor: 'gear' as const, exchangedAt: Date.now(), gearCardId }
            : loot
        );

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                spoilsProgress: {
                  ...c.expedition.spoilsProgress,
                  lootDeck: updatedLootDeck,
                  gearAcquired: [...c.expedition.spoilsProgress.gearAcquired, gearCardId],
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    completeQuest: (campaignId, knightUID, status, details, rewards) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition) {
          return s;
        }

        // Initialize spoilsProgress if it doesn't exist
        if (!c.expedition.spoilsProgress) {
          c.expedition.spoilsProgress = {
            lootDeck: [],
            goldEarned: 0,
            gearAcquired: [],
            questCompletions: [],
          };
        }

        const knightChoice = c.expedition.knightChoices.find(
          choice => choice.knightUID === knightUID
        );
        if (!knightChoice) return s;

        // Note: Knight data updates will be handled by the UI components
        // to avoid circular dependencies between stores

        const questCompletion = {
          knightUID,
          choice: knightChoice,
          completionStatus: status,
          rewards,
        };

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                spoilsProgress: {
                  ...c.expedition.spoilsProgress,
                  questCompletions: [
                    ...c.expedition.spoilsProgress.questCompletions,
                    questCompletion,
                  ],
                },
                knightChoices: c.expedition.knightChoices.map(choice =>
                  choice.knightUID === knightUID
                    ? {
                        ...choice,
                        status: status === 'success' ? ('completed' as const) : ('failed' as const),
                        completedAt: status === 'success' ? Date.now() : undefined,
                        failedAt: status === 'failure' ? Date.now() : undefined,
                        successDetails: status === 'success' ? details : undefined,
                        failureDetails: status === 'failure' ? details : undefined,
                      }
                    : choice
                ),
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    endExpedition: campaignId =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: undefined, // Remove all expedition data
              selectedKingdomId: undefined, // Clear kingdom selection
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),
  };
});

// Initialize store with data from AsyncStorage
storage
  .load(STORAGE_KEYS.CAMPAIGNS, { campaigns: {}, currentCampaignId: undefined })
  .then(state => {
    useCampaigns.setState(state);
  })
  .catch(console.error);
