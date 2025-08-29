// Mock theme provider
jest.mock('@/theme/ThemeProvider', () => ({
    useThemeTokens: () => ({
        tokens: {
            textPrimary: '#fff',
            textMuted: '#aaa',
            surface: '#222',
            accent: '#4ade80',
        },
    }),
}));

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import BenchedList from '../BenchedList';

describe('BenchedList', () => {
    const mockOnActivate = jest.fn();
    const mockOnRemove = jest.fn();
    const mockOnEdit = jest.fn();

    const mockList = [
        { knightUID: 'knight-1', name: 'Sir Galahad', catalogId: 'galahad' },
        { knightUID: 'knight-2', name: 'Sir Lancelot', catalogId: 'lancelot' },
        { knightUID: 'knight-3', name: 'Sir Gawain', catalogId: 'gawain' },
    ];

    const mockActiveCatalogIds = new Set(['lancelot']); // Lancelot is already active

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders empty state when no knights', () => {
        const { getByText } = render(
            <BenchedList
                list={[]}
                activeCatalogIds={new Set()}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        expect(getByText('No benched knights.')).toBeTruthy();
    });

    it('renders empty state when list is null', () => {
        const { getByText } = render(
            <BenchedList
                list={null as any}
                activeCatalogIds={new Set()}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        expect(getByText('No benched knights.')).toBeTruthy();
    });

    it('renders all knights in the list', () => {
        const { getByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        expect(getByText('Sir Galahad')).toBeTruthy();
        expect(getByText('galahad')).toBeTruthy();
        expect(getByText('Sir Lancelot')).toBeTruthy();
        expect(getByText('lancelot')).toBeTruthy();
        expect(getByText('Sir Gawain')).toBeTruthy();
        expect(getByText('gawain')).toBeTruthy();
    });

    it('shows activate button for knights not in active catalog', () => {
        const { getAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        // Should have 3 Activate buttons (one for each knight)
        const activateButtons = getAllByText('Activate');
        expect(activateButtons).toHaveLength(2); // Galahad and Gawain can be activated

        // Should have 1 "Active Exists" button (Lancelot is already active)
        const activeExistsButtons = getAllByText('Active Exists');
        expect(activeExistsButtons).toHaveLength(1);
    });

    it('shows "Active Exists" for knights already in active catalog', () => {
        const { getByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        // Lancelot should show "Active Exists" since he's already active
        expect(getByText('Active Exists')).toBeTruthy();
    });

    it('calls onActivate when activate button is pressed', () => {
        const { getAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        const activateButtons = getAllByText('Activate');
        fireEvent.press(activateButtons[0]); // Press Sir Galahad's activate button

        expect(mockOnActivate).toHaveBeenCalledWith('knight-1');
    });

    it('calls onEdit when edit button is pressed', () => {
        const { getAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        const editButtons = getAllByText('Edit');
        fireEvent.press(editButtons[0]); // Press Sir Galahad's edit button

        expect(mockOnEdit).toHaveBeenCalledWith('knight-1');
    });

    it('calls onRemove when remove button is pressed', () => {
        const { getAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        const removeButtons = getAllByText('Remove');
        fireEvent.press(removeButtons[2]); // Press Sir Gawain's remove button

        expect(mockOnRemove).toHaveBeenCalledWith('knight-3');
    });

    it('renders correct number of action buttons per knight', () => {
        const { getAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        // Each knight should have 3 action buttons
        expect(getAllByText('Edit')).toHaveLength(3);
        expect(getAllByText('Remove')).toHaveLength(3);
    });

    it('handles single knight correctly', () => {
        const singleKnight = [{ knightUID: 'knight-1', name: 'Sir Galahad', catalogId: 'galahad' }];

        const { getByText, getAllByText } = render(
            <BenchedList
                list={singleKnight}
                activeCatalogIds={new Set()}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        expect(getByText('Sir Galahad')).toBeTruthy();
        expect(getByText('galahad')).toBeTruthy();
        expect(getAllByText('Edit')).toHaveLength(1);
        expect(getAllByText('Activate')).toHaveLength(1);
        expect(getAllByText('Remove')).toHaveLength(1);
    });

    it('handles all knights being active', () => {
        const allActiveCatalogIds = new Set(['galahad', 'lancelot', 'gawain']);

        const { getAllByText, queryAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={allActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        // All knights should show "Active Exists"
        expect(getAllByText('Active Exists')).toHaveLength(3);
        expect(queryAllByText('Activate')).toHaveLength(0);
    });

    it('handles no active knights', () => {
        const { getAllByText, queryAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={new Set()}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        // All knights should show "Activate"
        expect(getAllByText('Activate')).toHaveLength(3);
        expect(queryAllByText('Active Exists')).toHaveLength(0);
    });

    it('applies correct styling to knight cards', () => {
        const { getByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        // Get the container of the first knight
        const knightName = getByText('Sir Galahad');
        const knightCard = knightName.parent?.parent;

        expect(knightCard?.props.style).toMatchObject({
            padding: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#0006',
            backgroundColor: '#222',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        });
    });

    it('applies correct styling to action buttons', () => {
        const { getAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        const editButton = getAllByText('Edit')[0];
        const activateButton = getAllByText('Activate')[0];
        const removeButton = getAllByText('Remove')[0];

        // All buttons should have the same base styling
        const expectedButtonStyle = {
            paddingHorizontal: 12,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#0006',
        };

        expect(editButton.parent?.props.style).toMatchObject(expectedButtonStyle);
        expect(activateButton.parent?.props.style).toMatchObject(expectedButtonStyle);
        expect(removeButton.parent?.props.style).toMatchObject(expectedButtonStyle);
    });

    it('applies correct styling to activate button when not active', () => {
        const { getAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        const activateButton = getAllByText('Activate')[0];
        const activateButtonContainer = activateButton.parent;

        expect(activateButtonContainer?.props.style.backgroundColor).toBe('#4ade80');
        expect(activateButton.props.style.color).toBe('#0B0B0B');
    });

    it('applies correct styling to activate button when already active', () => {
        const { getByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        const activeExistsButton = getByText('Active Exists');
        const activeExistsButtonContainer = activeExistsButton.parent;

        expect(activeExistsButtonContainer?.props.style.backgroundColor).toBe('#555');
        expect(activeExistsButton.props.style.color).toBe('#aaa');
    });

    it('applies correct styling to remove button', () => {
        const { getAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        const removeButton = getAllByText('Remove')[0];
        const removeButtonContainer = removeButton.parent;

        expect(removeButtonContainer?.props.style.backgroundColor).toBe('#2a1313');
        expect(removeButton.props.style.color).toBe('#F9DADA');
    });

    it('applies correct text styling to knight names', () => {
        const { getByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        const knightName = getByText('Sir Galahad');

        expect(knightName.props.style).toMatchObject({
            color: '#fff',
            fontWeight: '700',
        });
    });

    it('applies correct text styling to catalog IDs', () => {
        const { getByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        const catalogId = getByText('galahad');

        expect(catalogId.props.style).toMatchObject({
            color: '#aaa',
            fontSize: 12,
        });
    });

    it('applies correct text styling to edit button text', () => {
        const { getAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={mockActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        const editButtonText = getAllByText('Edit')[0];

        expect(editButtonText.props.style).toMatchObject({
            color: '#fff',
            fontWeight: '700',
        });
    });

    it('handles empty activeCatalogIds set', () => {
        const { getAllByText, queryAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={new Set()}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        // All knights should be activatable
        expect(getAllByText('Activate')).toHaveLength(3);
        expect(queryAllByText('Active Exists')).toHaveLength(0);
    });

    it('handles large activeCatalogIds set', () => {
        const largeActiveCatalogIds = new Set(['galahad', 'lancelot', 'gawain', 'percival', 'tristan']);

        const { getAllByText, queryAllByText } = render(
            <BenchedList
                list={mockList}
                activeCatalogIds={largeActiveCatalogIds}
                onActivate={mockOnActivate}
                onRemove={mockOnRemove}
                onEdit={mockOnEdit}
            />
        );

        // All knights should show "Active Exists"
        expect(getAllByText('Active Exists')).toHaveLength(3);
        expect(queryAllByText('Activate')).toHaveLength(0);
    });
});
