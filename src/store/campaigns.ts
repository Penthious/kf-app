import type { Campaign, CampaignsState } from '@/models/campaign';
import { create } from 'zustand';

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
};

export const useCampaigns = create<CampaignsState & CampaignsActions>((set, get) => ({
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
      return {
        campaigns: { ...s.campaigns, [campaignId]: c },
        currentCampaignId: campaignId,
      };
    }),

  renameCampaign: (campaignId, name) =>
    set(s => {
      const c = s.campaigns[campaignId];
      if (!c) return s;
      return {
        campaigns: {
          ...s.campaigns,
          [campaignId]: { ...c, name, updatedAt: Date.now() },
        },
      };
    }),

  removeCampaign: campaignId =>
    set(s => {
      const { [campaignId]: removed, ...rest } = s.campaigns;
      return {
        campaigns: rest,
        currentCampaignId: s.currentCampaignId === campaignId ? undefined : s.currentCampaignId,
      };
    }),

  setCurrentCampaignId: id => set(() => ({ currentCampaignId: id })),

  setFivePlayerMode: (campaignId, on) =>
    set(s => {
      const c = s.campaigns[campaignId];
      if (!c) return s;
      return {
        campaigns: {
          ...s.campaigns,
          [campaignId]: {
            ...c,
            settings: { ...c.settings, fivePlayerMode: on },
            updatedAt: Date.now(),
          },
        },
      };
    }),

  setNotes: (campaignId, notes) =>
    set(s => {
      const c = s.campaigns[campaignId];
      if (!c) return s;
      return {
        campaigns: {
          ...s.campaigns,
          [campaignId]: {
            ...c,
            settings: { ...c.settings, notes },
            updatedAt: Date.now(),
          },
        },
      };
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
}));
