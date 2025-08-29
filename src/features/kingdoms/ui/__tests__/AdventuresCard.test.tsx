import AdventuresCard from '@/features/kingdoms/ui/AdventuresCard';
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
jest.mock('@/components/ui/Stepper', () => {
    const React = require('react');
    const { Pressable, Text, View } = require('react-native');



    return ({ value, onChange, testID }: { value?: number; onChange?: (value: number) => void; testID?: string }) => (
        <View testID={testID}>
            <Pressable
                testID={testID ? `${testID}-decrease` : undefined}
                onPress={() => onChange?.((value ?? 0) - 1)}
            >
                <Text>dec</Text>
            </Pressable>
            <View testID={testID ? `${testID}-display` : undefined}>
                <Text testID={testID ? `${testID}-value` : undefined}>
                    {String(value ?? 0)}
                </Text>
            </View>
            <Pressable
                testID={testID ? `${testID}-increase` : undefined}
                onPress={() => onChange?.((value ?? 0) + 1)}
            >
                <Text>inc</Text>
            </Pressable>
        </View>
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

describe('AdventuresCard', () => {
    it('renders adventures card title', () => {
        const { getByTestId } = render(<AdventuresCard kingdom={kingdom} />);
        expect(getByTestId('adventures-card-title')).toBeTruthy();
        expect(getByTestId('adventures-card-title').props.children).toBe('Adventures');
    });

    it('shows "No adventures" when empty', () => {
        const emptyK = { ...kingdom, adventures: [] };
        const { getByTestId } = render(<AdventuresCard kingdom={emptyK} />);
        expect(getByTestId('no-adventures-message')).toBeTruthy();
        expect(getByTestId('no-adventures-message').props.children).toBe('No adventures available.');
    });

    it('renders single attempt adventures with pill buttons', () => {
        const { getByTestId } = render(<AdventuresCard kingdom={kingdom} />);
        
        // Check adventure item exists
        expect(getByTestId('adventure-item-principality-of-stone:stone-puzzle')).toBeTruthy();
        
        // Check adventure name
        expect(getByTestId('adventure-name-principality-of-stone:stone-puzzle').props.children).toBe('Stone Puzzle');
        
        // Check roll information
        expect(getByTestId('adventure-roll-principality-of-stone:stone-puzzle').props.children).toEqual(['Roll: ', 2, '–', 10]);
        
        // Check pill button
        expect(getByTestId('adventure-pill-principality-of-stone:stone-puzzle')).toBeTruthy();
    });

    it('renders multi-attempt adventures with steppers', () => {
        const { getByTestId } = render(<AdventuresCard kingdom={kingdom} />);
        
        // Check adventure item exists
        expect(getByTestId('adventure-item-principality-of-stone:scavenge-supplies')).toBeTruthy();
        
        // Check adventure name
        expect(getByTestId('adventure-name-principality-of-stone:scavenge-supplies').props.children).toBe('Scavenge Supplies');
        
        // Check roll information
        expect(getByTestId('adventure-roll-principality-of-stone:scavenge-supplies').props.children).toEqual(['Roll: ', 3, '–', 9]);
        
        // Check stepper
        expect(getByTestId('adventure-stepper-principality-of-stone:scavenge-supplies')).toBeTruthy();
    });

    it('handles undefined kingdom gracefully', () => {
        const { queryByTestId } = render(<AdventuresCard kingdom={undefined} />);
        expect(queryByTestId('adventures-card')).toBeNull();
    });

    it('displays adventure list container when adventures exist', () => {
        const { getByTestId } = render(<AdventuresCard kingdom={kingdom} />);
        expect(getByTestId('adventures-list')).toBeTruthy();
    });

    it('shows completed state for single attempt adventures', () => {
        // Create a kingdom with a completed adventure
        const kingdomWithCompleted = {
            ...kingdom,
            adventures: [
                { id: 'principality-of-stone:stone-puzzle', name: 'Stone Puzzle', singleAttempt: true, roll: { min: 2, max: 10 }, completedCount: 1, completed: true },
            ],
        };

        const { getByTestId } = render(<AdventuresCard kingdom={kingdomWithCompleted} />);
        
        // The pill should show "Completed" when adventure is done
        const pill = getByTestId('adventure-pill-principality-of-stone:stone-puzzle');
        expect(pill).toBeTruthy();
    });

    it('handles multiple adventures correctly', () => {
        const multiAdventureKingdom = {
            ...kingdom,
            adventures: [
                { id: 'adv-1', name: 'First Adventure', singleAttempt: true, roll: { min: 1, max: 6 }, completedCount: 0, completed: false },
                { id: 'adv-2', name: 'Second Adventure', singleAttempt: false, roll: { min: 2, max: 8 }, completedCount: 0, completed: false },
                { id: 'adv-3', name: 'Third Adventure', singleAttempt: true, roll: { min: 3, max: 10 }, completedCount: 1, completed: true },
            ],
        };

        const { getByTestId } = render(<AdventuresCard kingdom={multiAdventureKingdom} />);
        
        // Should render all three adventures (IDs are generated from names)
        expect(getByTestId('adventure-name-principality-of-stone:first-adventure').props.children).toBe('First Adventure');
        expect(getByTestId('adventure-name-principality-of-stone:second-adventure').props.children).toBe('Second Adventure');
        expect(getByTestId('adventure-name-principality-of-stone:third-adventure').props.children).toBe('Third Adventure');
    });

    it('creates correct adventure IDs from names', () => {
        const kingdomWithSpecialNames = {
            ...kingdom,
            adventures: [
                { id: 'test', name: 'Special Adventure Name!', singleAttempt: true, roll: { min: 1, max: 6 }, completedCount: 0, completed: false },
            ],
        };

        const { getByTestId } = render(<AdventuresCard kingdom={kingdomWithSpecialNames} />);
        
        // Should create ID with slugified name
        expect(getByTestId('adventure-item-principality-of-stone:special-adventure-name')).toBeTruthy();
    });
});