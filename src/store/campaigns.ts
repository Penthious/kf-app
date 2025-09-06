import type {
  Campaign,
  CampaignsState,
  ClashResult,
  Clue,
  Contract,
  ExpeditionPhase,
  KnightExpeditionChoice,
  LootCard,
  Objective,
} from '@/models/campaign';
import { create } from 'zustand';
import { storage, STORAGE_KEYS } from './storage';

export type CampaignsActions = {
  // Core actions
  addCampaign: (campaignId: string, name: string) => void;
  renameCampaign: (campaignId: string, name: string) => void;
  removeCampaign: (campaignId: string) => void;
  setCurrentCampaignId: (id?: string) => void;
  setFivePlayerMode: (campaignId: string, on: boolean) => void;
  setNotes: (campaignId: string, notes: string) => void;
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

  // Delve progress actions
  initializeDelveProgress: (campaignId: string) => void;
  addClue: (campaignId: string, clue: Omit<Clue, 'discoveredAt'>) => void;
  addObjective: (campaignId: string, objective: Objective) => void;
  completeObjective: (campaignId: string, objectiveId: string, completedBy: string) => void;
  addContract: (campaignId: string, contract: Contract) => void;
  acceptContract: (campaignId: string, contractId: string, acceptedBy: string) => void;
  completeContract: (campaignId: string, contractId: string, completedBy: string) => void;
  exploreLocation: (campaignId: string, locationId: string) => void;
  setCurrentLocation: (campaignId: string, locationId: string) => void;
  advanceThreatTrack: (campaignId: string, amount?: number) => void;
  advanceTimeTrack: (campaignId: string, amount?: number) => void;
  setThreatTrackPosition: (campaignId: string, position: number) => void;
  setTimeTrackPosition: (campaignId: string, position: number) => void;

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

    addCampaign: (campaignId, name) =>
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
                    currentPosition: 1,
                    maxPosition: 16,
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

    addObjective: (campaignId, objective) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  objectives: [...c.expedition.delveProgress.objectives, objective],
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    completeObjective: (campaignId, objectiveId, completedBy) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const updatedObjectives = c.expedition.delveProgress.objectives.map(obj =>
          obj.id === objectiveId
            ? { ...obj, status: 'completed' as const, completedAt: Date.now(), completedBy }
            : obj
        );

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  objectives: updatedObjectives,
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    addContract: (campaignId, contract) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  contracts: [...c.expedition.delveProgress.contracts, contract],
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    acceptContract: (campaignId, contractId, acceptedBy) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const updatedContracts = c.expedition.delveProgress.contracts.map(contract =>
          contract.id === contractId
            ? { ...contract, status: 'accepted' as const, acceptedAt: Date.now(), acceptedBy }
            : contract
        );

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  contracts: updatedContracts,
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    completeContract: (campaignId, contractId, completedBy) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const updatedContracts = c.expedition.delveProgress.contracts.map(contract =>
          contract.id === contractId
            ? { ...contract, status: 'completed' as const, completedAt: Date.now(), completedBy }
            : contract
        );

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  contracts: updatedContracts,
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    exploreLocation: (campaignId, locationId) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const exploredLocations = c.expedition.delveProgress.exploredLocations.includes(locationId)
          ? c.expedition.delveProgress.exploredLocations
          : [...c.expedition.delveProgress.exploredLocations, locationId];

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  exploredLocations,
                },
              },
              updatedAt: Date.now(),
            },
          },
        };
        saveToStorage(newState);
        return newState;
      }),

    setCurrentLocation: (campaignId, locationId) =>
      set(s => {
        const c = s.campaigns[campaignId];
        if (!c?.expedition?.delveProgress) return s;

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                delveProgress: {
                  ...c.expedition.delveProgress,
                  currentLocation: locationId,
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
        const newPosition = Math.max(1, Math.min(position, maxPos));

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

        const clashResult: ClashResult = {
          type: c.expedition.currentPhase === 'clash' ? 'exhibition' : 'full',
          outcome,
          completedAt: Date.now(),
          woundsDealt,
          woundsReceived,
          specialEffects,
        };

        const newState = {
          campaigns: {
            ...s.campaigns,
            [campaignId]: {
              ...c,
              expedition: {
                ...c.expedition,
                clashResults: [...(c.expedition.clashResults || []), clashResult],
                currentPhase: outcome === 'victory' ? 'rest' : ('spoils' as ExpeditionPhase),
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
          id: `loot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        if (!c?.expedition?.spoilsProgress) return s;

        const knightChoice = c.expedition.knightChoices.find(
          choice => choice.knightUID === knightUID
        );
        if (!knightChoice) return s;

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
