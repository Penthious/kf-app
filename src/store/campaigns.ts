import type {
  Campaign,
  CampaignsState,
  ExpeditionPhase,
  KnightExpeditionChoice,
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
  completeKnightExpeditionChoice: (campaignId: string, knightUID: string) => void;
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
  };
});

// Initialize store with data from AsyncStorage
storage
  .load(STORAGE_KEYS.CAMPAIGNS, { campaigns: {}, currentCampaignId: undefined })
  .then(state => {
    useCampaigns.setState(state);
  })
  .catch(console.error);
