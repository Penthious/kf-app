import AdventuresCard from '@/features/kingdoms/AdventuresCard';
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';

// ---- real types from your app ----
import type { KingdomView } from '@/features/kingdoms/kingdomView';
import type { Campaign } from '@/models/campaign';
import type { KingdomState } from '@/models/kingdom';

// ---- theme mock (unchanged) ----
jest.mock('@/theme/ThemeProvider', () => ({
    useThemeTokens: () => ({
        tokens: {
            bg: '#000',
            surface: '#111',
            card: '#222',
            textPrimary: '#fff',
            textMuted: '#aaa',
            accent: '#4ade80',
        },
    }),
}));

// ---- typed store slice shape used by AdventuresCard ----
type CampaignsSlice = {
    campaigns: Record<string, Campaign>;
    currentCampaignId?: string;
    setAdventureProgress: (
        campaignId: string,
        kingdomId: string,
        adventureId: string,
        opts?: { singleAttempt?: boolean; delta?: number }
    ) => void;
};

// helper to build a minimal valid Campaign with types enforced
function mockMakeCampaign(overrides?: Partial<Campaign>): Campaign {
    const base: Campaign = {
        campaignId: 'cmp-1',
        name: 'Test Campaign',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        settings: { fivePlayerMode: false },
        members: [],
        partyLeaderUID: undefined,
        selectedKingdomId: undefined,
        kingdoms: [],        // we'll inject a kingdom below
    };
    return { ...base, ...overrides };
}

function mockMakeKingdomState(overrides?: Partial<KingdomState>): KingdomState {
    const base: KingdomState = {
        kingdomId: 'principality-of-stone',
        name: 'Principality of Stone',
        chapter: 1,
        adventures: [],
    } as KingdomState;
    return { ...base, ...overrides };
}

// ---- typed campaigns store mock ----
jest.mock('@/store/campaigns', () => {
    // build a fully-typed state
    const kingdomState = mockMakeKingdomState({
        adventures: [{ id: 'principality-of-stone:stone-puzzle', completedCount: 1 }],
    });

    const campaign = mockMakeCampaign({
        kingdoms: [kingdomState],
    });

    const state: CampaignsSlice = {
        campaigns: { [campaign.campaignId]: campaign },
        currentCampaignId: campaign.campaignId,
        setAdventureProgress: () => {},
    };

    const useCampaigns = (selector?: (s: CampaignsSlice) => any) =>
        selector ? selector(state) : state;

    return { useCampaigns };
});

// ---- (optional) Stepper mock if your real one lacks testIDs ----
jest.mock('@/components/Stepper', () => {
    const React = require('react');
    const { Pressable, Text } = require('react-native');

    return ({ value, onChange, testID }: any) => (
        <>
            <Pressable
                testID={testID ? `${testID}-dec` : undefined}
                onPress={() => onChange((value ?? 0) - 1)}
            >
                <Text>dec</Text>
            </Pressable>
            <Pressable
                testID={testID ? `${testID}-inc` : undefined}
                onPress={() => onChange((value ?? 0) + 1)}
            >
                <Text>inc</Text>
            </Pressable>
            <Text accessibilityRole="text">{String(value ?? 0)}</Text>
        </>
    );
});

// ---- fixture prop for the component ----
const kingdom: KingdomView = {
    id: 'principality-of-stone',
    name: 'Principality of Stone',
    adventures: [
        { id: 'principality-of-stone:stone-puzzle', name: 'Stone Puzzle', singleAttempt: true, roll: { min: 2, max: 10 }, completedCount: 0, completed: false },
        { id: 'principality-of-stone:scavenge-supplies', name: 'Scavenge Supplies', singleAttempt: false, roll: { min: 3, max: 9 }, completedCount: 0, completed: false },
    ],
    bestiary: {
        monsters: [],
        stages: []
    },
};

describe('AdventuresCard (typed store mock)', () => {
    it('should pass a basic test', () => {
        expect(1 + 1).toBe(2);
    });

    it('shows "No adventures" when empty', () => {
        const emptyK = { ...kingdom, adventures: [] };
        const { getByText } = render(<AdventuresCard kingdom={emptyK} />);
        expect(getByText('No adventures available.')).toBeTruthy();
    });

    it('renders adventures correctly', () => {
        const { getByText } = render(<AdventuresCard kingdom={kingdom} />);
        expect(getByText('Stone Puzzle')).toBeTruthy();
        expect(getByText('Roll: 2–10')).toBeTruthy();
        expect(getByText('Scavenge Supplies')).toBeTruthy();
        expect(getByText('Roll: 3–9')).toBeTruthy();
    });
});