import MonsterCard from '@/features/kingdoms/ui/MonsterCard';
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';

// ---- real types from your app ----
import type { KingdomView } from '@/features/kingdoms/kingdomView';
import type { MonsterStats } from '@/models/monster';

// ---- theme mock ----
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

// ---- monsters store mock ----
jest.mock('@/store/monsters', () => {
    const mockMonsters: Record<string, MonsterStats> = {
        'goblin': {
            id: 'goblin',
            name: 'Goblin',
            level: 1,
            toHit: 3,
            wounds: 3,
            exhibitionStartingWounds: 3,
        },
        'orc': {
            id: 'orc',
            name: 'Orc',
            level: 2,
            toHit: 4,
            wounds: 5,
            exhibitionStartingWounds: 5,
        },
        'troll': {
            id: 'troll',
            name: 'Troll',
            level: 3,
            toHit: 5,
            wounds: 8,
            exhibitionStartingWounds: 8,
        },
    };

    return {
        useMonsters: (selector?: (s: any) => any) => {
            const state = {
                all: Object.values(mockMonsters),
                byId: mockMonsters,
            };
            return selector ? selector(state) : state;
        },
    };
});

// ---- fixture data ----
const kingdom: KingdomView = {
    id: 'test-kingdom',
    name: 'Test Kingdom',
    adventures: [],
    bestiary: {
        monsters: [
            { id: 'goblin' },
            { id: 'orc' },
            { id: 'troll' },
        ],
        stages: []
    },
};

const stageRow: Record<string, number | null> = {
    'goblin': 1,
    'orc': 2,
    'troll': 0, // locked
};

describe('MonsterCard', () => {
    it('renders kingdom name and monsters title', () => {
        const { getByTestId } = render(
            <MonsterCard kingdom={kingdom} stageRow={stageRow} />
        );
        
        expect(getByTestId('monster-card-title')).toBeTruthy();
        expect(getByTestId('monster-card-title').props.children).toBe('Test Kingdom • Monsters');
    });

    it('shows "Kingdom • Monsters" when no kingdom name provided', () => {
        const { getByTestId } = render(
            <MonsterCard kingdom={undefined} stageRow={stageRow} />
        );
        
        expect(getByTestId('monster-card-title').props.children).toBe('Kingdom • Monsters');
    });

    it('shows "Kingdom • Monsters" when kingdom name is empty string', () => {
        const kingdomWithEmptyName = { ...kingdom, name: '' };
        const { getByTestId } = render(
            <MonsterCard kingdom={kingdomWithEmptyName} stageRow={stageRow} />
        );
        
        expect(getByTestId('monster-card-title').props.children).toBe('Kingdom • Monsters');
    });

    it('shows "Kingdom • Monsters" when kingdom name is only whitespace', () => {
        const kingdomWithWhitespaceName = { ...kingdom, name: '   ' };
        const { getByTestId } = render(
            <MonsterCard kingdom={kingdomWithWhitespaceName} stageRow={stageRow} />
        );
        
        expect(getByTestId('monster-card-title').props.children).toBe('Kingdom • Monsters');
    });

    it('displays available monsters with their names and stages', () => {
        const { getByTestId } = render(
            <MonsterCard kingdom={kingdom} stageRow={stageRow} />
        );
        
        // Should show available monsters (stage > 0)
        expect(getByTestId('monster-name-text-goblin').props.children).toBe('Goblin');
        expect(getByTestId('monster-name-text-orc').props.children).toBe('Orc');
        
        // Should show stage badges
        expect(getByTestId('monster-stage-goblin-text').props.children).toBe('Stage 1');
        expect(getByTestId('monster-stage-orc-text').props.children).toBe('Stage 2');
    });

    it('filters out locked monsters when availableOnly is true (default)', () => {
        const { queryByTestId } = render(
            <MonsterCard kingdom={kingdom} stageRow={stageRow} />
        );
        
        // Troll should not be shown (stage 0 = locked)
        expect(queryByTestId('monster-item-troll')).toBeNull();
    });

    it('shows all monsters including locked ones when availableOnly is false', () => {
        const { getByTestId } = render(
            <MonsterCard kingdom={kingdom} stageRow={stageRow} availableOnly={false} />
        );
        
        // Should show all monsters including locked ones
        expect(getByTestId('monster-name-text-goblin').props.children).toBe('Goblin');
        expect(getByTestId('monster-name-text-orc').props.children).toBe('Orc');
        expect(getByTestId('monster-name-text-troll').props.children).toBe('Troll');
        
        // Should show stage badges including "Locked"
        expect(getByTestId('monster-stage-goblin-text').props.children).toBe('Stage 1');
        expect(getByTestId('monster-stage-orc-text').props.children).toBe('Stage 2');
        expect(getByTestId('monster-stage-troll-text').props.children).toBe('Locked');
    });

    it('shows "No monsters currently available" when no available monsters', () => {
        const emptyStageRow: Record<string, number | null> = {
            'goblin': 0,
            'orc': 0,
            'troll': 0,
        };
        
        const { getByTestId } = render(
            <MonsterCard kingdom={kingdom} stageRow={emptyStageRow} />
        );
        
        expect(getByTestId('no-monsters-message')).toBeTruthy();
        expect(getByTestId('no-monsters-message').props.children).toBe('No monsters currently available.');
    });

    it('shows "No monsters currently available" when no monsters in kingdom', () => {
        const kingdomWithoutMonsters = { ...kingdom, bestiary: { monsters: [], stages: [] } };
        
        const { getByTestId } = render(
            <MonsterCard kingdom={kingdomWithoutMonsters} stageRow={stageRow} />
        );
        
        expect(getByTestId('no-monsters-message')).toBeTruthy();
    });

    it('handles missing monster data gracefully', () => {
        const kingdomWithUnknownMonster = {
            ...kingdom,
            bestiary: {
                monsters: [{ id: 'unknown-monster' }],
                stages: []
            }
        };
        
        const stageRowWithUnknown = { 'unknown-monster': 1 };
        
        const { getByTestId } = render(
            <MonsterCard kingdom={kingdomWithUnknownMonster} stageRow={stageRowWithUnknown} />
        );
        
        // Should show the monster ID as fallback name
        expect(getByTestId('monster-name-text-unknown-monster').props.children).toBe('unknown-monster');
        expect(getByTestId('monster-stage-unknown-monster-text').props.children).toBe('Stage 1');
    });

    it('handles undefined kingdom gracefully', () => {
        const { getByTestId } = render(
            <MonsterCard kingdom={undefined} stageRow={stageRow} />
        );
        
        expect(getByTestId('monster-card-title').props.children).toBe('Kingdom • Monsters');
        expect(getByTestId('no-monsters-message')).toBeTruthy();
    });

    it('handles null stage values correctly', () => {
        const stageRowWithNulls: Record<string, number | null> = {
            'goblin': null,
            'orc': 2,
            'troll': 0,
        };
        
        const { getByTestId, queryByTestId } = render(
            <MonsterCard kingdom={kingdom} stageRow={stageRowWithNulls} />
        );
        
        // Goblin should not be shown (null stage = 0 = locked)
        expect(queryByTestId('monster-item-goblin')).toBeNull();
        
        // Orc should be shown
        expect(getByTestId('monster-name-text-orc')).toBeTruthy();
        expect(getByTestId('monster-stage-orc-text').props.children).toBe('Stage 2');
    });

    it('handles undefined stage values correctly', () => {
        const stageRowWithUndefineds: Record<string, number | null> = {
            'goblin': undefined as any,
            'orc': 2,
            'troll': 0,
        };
        
        const { getByTestId, queryByTestId } = render(
            <MonsterCard kingdom={kingdom} stageRow={stageRowWithUndefineds} />
        );
        
        // Goblin should not be shown (undefined stage = 0 = locked)
        expect(queryByTestId('monster-item-goblin')).toBeNull();
        
        // Orc should be shown
        expect(getByTestId('monster-name-text-orc')).toBeTruthy();
    });

    it('handles empty stageRow object', () => {
        const emptyStageRow: Record<string, number | null> = {};
        
        const { getByTestId } = render(
            <MonsterCard kingdom={kingdom} stageRow={emptyStageRow} />
        );
        
        expect(getByTestId('no-monsters-message')).toBeTruthy();
    });
});
