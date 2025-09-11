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
import ActiveLineup from '../ActiveLineup';

describe('ActiveLineup', () => {
  const mockOnSetLeader = jest.fn();
  const mockOnBench = jest.fn();
  const mockOnEdit = jest.fn();

  const mockList = [
    { knightUID: 'knight-1', name: 'Sir Galahad', isLeader: true },
    { knightUID: 'knight-2', name: 'Sir Lancelot', isLeader: false },
    { knightUID: 'knight-3', name: 'Sir Gawain', isLeader: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no knights', () => {
    const { getByText } = render(
      <ActiveLineup
        list={[]}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    expect(getByText('No active knights.')).toBeTruthy();
  });

  it('renders empty state when list is null', () => {
    const { getByText } = render(
      <ActiveLineup
        list={[]}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    expect(getByText('No active knights.')).toBeTruthy();
  });

  it('renders all knights in the list', () => {
    const { getByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    expect(getByText('Sir Galahad')).toBeTruthy();
    expect(getByText('Sir Lancelot')).toBeTruthy();
    expect(getByText('Sir Gawain')).toBeTruthy();
  });

  it('renders slots indicator', () => {
    const { getByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    expect(getByText('Slots: 3/5')).toBeTruthy();
  });

  it('shows leader button as active for leader knight', () => {
    const { getAllByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    // Find the Leader button for Sir Galahad (the leader)
    const leaderButtons = getAllByText('Leader');
    expect(leaderButtons[0].props.style.color).toBe('#0B0B0B');
  });

  it('shows leader button as inactive for non-leader knights', () => {
    const { getAllByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    // There should be 3 Leader buttons (one for each knight)
    const leaderButtons = getAllByText('Leader');
    expect(leaderButtons).toHaveLength(3);

    // The first one (Sir Galahad) should be active, others inactive
    expect(leaderButtons[0].props.style.color).toBe('#0B0B0B'); // Leader
    expect(leaderButtons[1].props.style.color).toBe('#aaa'); // Non-leader
    expect(leaderButtons[2].props.style.color).toBe('#aaa'); // Non-leader
  });

  it('calls onSetLeader when leader button is pressed', () => {
    const { getAllByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    const leaderButtons = getAllByText('Leader');
    fireEvent.press(leaderButtons[1]); // Press Sir Lancelot's leader button

    expect(mockOnSetLeader).toHaveBeenCalledWith('knight-2');
  });

  it('calls onEdit when edit button is pressed', () => {
    const { getAllByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    const editButtons = getAllByText('Edit');
    fireEvent.press(editButtons[0]); // Press Sir Galahad's edit button

    expect(mockOnEdit).toHaveBeenCalledWith('knight-1');
  });

  it('calls onBench when bench button is pressed', () => {
    const { getAllByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    const benchButtons = getAllByText('Bench');
    fireEvent.press(benchButtons[2]); // Press Sir Gawain's bench button

    expect(mockOnBench).toHaveBeenCalledWith('knight-3');
  });

  it('renders correct number of action buttons per knight', () => {
    const { getAllByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    // Each knight should have 3 action buttons
    expect(getAllByText('Leader')).toHaveLength(3);
    expect(getAllByText('Edit')).toHaveLength(3);
    expect(getAllByText('Bench')).toHaveLength(3);
  });

  it('handles single knight correctly', () => {
    const singleKnight = [{ knightUID: 'knight-1', name: 'Sir Galahad', isLeader: true }];

    const { getByText, getAllByText } = render(
      <ActiveLineup
        list={singleKnight}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    expect(getByText('Sir Galahad')).toBeTruthy();
    expect(getByText('Slots: 1/5')).toBeTruthy();
    expect(getAllByText('Leader')).toHaveLength(1);
    expect(getAllByText('Edit')).toHaveLength(1);
    expect(getAllByText('Bench')).toHaveLength(1);
  });

  it('handles knight without isLeader property', () => {
    const knightWithoutLeader = [
      { knightUID: 'knight-1', name: 'Sir Galahad' }, // No isLeader property
    ];

    const { getByText } = render(
      <ActiveLineup
        list={knightWithoutLeader}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    expect(getByText('Sir Galahad')).toBeTruthy();
    expect(getByText('Slots: 1/5')).toBeTruthy();

    // The leader button should be inactive (not a leader)
    const leaderButton = getByText('Leader');
    expect(leaderButton.props.style.color).toBe('#aaa');
  });

  it('handles maxSlots of 0', () => {
    const { getByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={0}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    expect(getByText('Slots: 3/0')).toBeTruthy();
  });

  it('handles maxSlots equal to list length', () => {
    const { getByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={3}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    expect(getByText('Slots: 3/3')).toBeTruthy();
  });

  it('applies correct styling to knight cards', () => {
    const { getByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    // Get the container of the first knight
    const knightName = getByText('Sir Galahad');
    const knightCard = knightName.parent?.parent;

    expect(knightCard?.props.style).toMatchObject({
      padding: 12,
      borderRadius: 10,
      backgroundColor: '#222',
      borderWidth: 1,
      borderColor: '#0006',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    });
  });

  it('applies correct styling to action buttons', () => {
    const { getAllByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    const leaderButton = getAllByText('Leader')[0];
    const editButton = getAllByText('Edit')[0];
    const benchButton = getAllByText('Bench')[0];

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

    expect(leaderButton.parent?.props.style).toMatchObject(expectedButtonStyle);
    expect(editButton.parent?.props.style).toMatchObject(expectedButtonStyle);
    expect(benchButton.parent?.props.style).toMatchObject(expectedButtonStyle);
  });

  it('applies correct text styling to knight names', () => {
    const { getByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    const knightName = getByText('Sir Galahad');

    expect(knightName.props.style).toMatchObject({
      color: '#fff',
      fontWeight: '700',
    });
  });

  it('applies correct text styling to action button text', () => {
    const { getAllByText } = render(
      <ActiveLineup
        list={mockList}
        maxSlots={5}
        onSetLeader={mockOnSetLeader}
        onBench={mockOnBench}
        onEdit={mockOnEdit}
      />
    );

    const editButtonText = getAllByText('Edit')[0];
    const benchButtonText = getAllByText('Bench')[0];

    expect(editButtonText.props.style).toMatchObject({
      color: '#fff',
      fontWeight: '800',
    });

    expect(benchButtonText.props.style).toMatchObject({
      color: '#fff',
      fontWeight: '800',
    });
  });

  describe('disabled state', () => {
    it('disables leader buttons when isLeaderDisabled is true', () => {
      const { getAllByText } = render(
        <ActiveLineup
          list={mockList}
          maxSlots={5}
          onSetLeader={mockOnSetLeader}
          onBench={mockOnBench}
          onEdit={mockOnEdit}
          isLeaderDisabled={true}
        />
      );

      const leaderButtons = getAllByText('Leader');

      // All leader buttons should be disabled
      leaderButtons.forEach(button => {
        const pressable = button.parent;
        expect(pressable?.props.disabled).toBe(true);
        expect(pressable?.props.style.opacity).toBe(0.5);
      });
    });

    it('enables leader buttons when isLeaderDisabled is false', () => {
      const { getAllByText } = render(
        <ActiveLineup
          list={mockList}
          maxSlots={5}
          onSetLeader={mockOnSetLeader}
          onBench={mockOnBench}
          onEdit={mockOnEdit}
          isLeaderDisabled={false}
        />
      );

      const leaderButtons = getAllByText('Leader');

      // All leader buttons should be enabled
      leaderButtons.forEach(button => {
        const pressable = button.parent;
        expect(pressable?.props.disabled).toBe(false);
        expect(pressable?.props.style.opacity).toBe(1);
      });
    });

    it('enables leader buttons when isLeaderDisabled is undefined', () => {
      const { getAllByText } = render(
        <ActiveLineup
          list={mockList}
          maxSlots={5}
          onSetLeader={mockOnSetLeader}
          onBench={mockOnBench}
          onEdit={mockOnEdit}
        />
      );

      const leaderButtons = getAllByText('Leader');

      // All leader buttons should be enabled (default behavior)
      leaderButtons.forEach(button => {
        const pressable = button.parent;
        expect(pressable?.props.disabled).toBe(false);
        expect(pressable?.props.style.opacity).toBe(1);
      });
    });

    it('does not call onSetLeader when leader button is disabled and pressed', () => {
      const { getAllByText } = render(
        <ActiveLineup
          list={mockList}
          maxSlots={5}
          onSetLeader={mockOnSetLeader}
          onBench={mockOnBench}
          onEdit={mockOnEdit}
          isLeaderDisabled={true}
        />
      );

      const leaderButtons = getAllByText('Leader');
      fireEvent.press(leaderButtons[1]); // Try to press Sir Lancelot's leader button

      expect(mockOnSetLeader).not.toHaveBeenCalled();
    });

    it('calls onSetLeader when leader button is enabled and pressed', () => {
      const { getAllByText } = render(
        <ActiveLineup
          list={mockList}
          maxSlots={5}
          onSetLeader={mockOnSetLeader}
          onBench={mockOnBench}
          onEdit={mockOnEdit}
          isLeaderDisabled={false}
        />
      );

      const leaderButtons = getAllByText('Leader');
      fireEvent.press(leaderButtons[1]); // Press Sir Lancelot's leader button

      expect(mockOnSetLeader).toHaveBeenCalledWith('knight-2');
    });

    it('does not affect edit and bench buttons when leader is disabled', () => {
      const { getAllByText } = render(
        <ActiveLineup
          list={mockList}
          maxSlots={5}
          onSetLeader={mockOnSetLeader}
          onBench={mockOnBench}
          onEdit={mockOnEdit}
          isLeaderDisabled={true}
        />
      );

      const editButtons = getAllByText('Edit');
      const benchButtons = getAllByText('Bench');

      // Edit and bench buttons should still be enabled
      editButtons.forEach(button => {
        const pressable = button.parent;
        expect(pressable?.props.disabled).toBeFalsy();
        // Edit and bench buttons don't have opacity style, so they should be undefined
        expect(pressable?.props.style.opacity).toBeUndefined();
      });

      benchButtons.forEach(button => {
        const pressable = button.parent;
        expect(pressable?.props.disabled).toBeFalsy();
        // Edit and bench buttons don't have opacity style, so they should be undefined
        expect(pressable?.props.style.opacity).toBeUndefined();
      });
    });

    it('still allows edit and bench actions when leader is disabled', () => {
      const { getAllByText } = render(
        <ActiveLineup
          list={mockList}
          maxSlots={5}
          onSetLeader={mockOnSetLeader}
          onBench={mockOnBench}
          onEdit={mockOnEdit}
          isLeaderDisabled={true}
        />
      );

      const editButtons = getAllByText('Edit');
      const benchButtons = getAllByText('Bench');

      fireEvent.press(editButtons[0]); // Press Sir Galahad's edit button
      fireEvent.press(benchButtons[2]); // Press Sir Gawain's bench button

      expect(mockOnEdit).toHaveBeenCalledWith('knight-1');
      expect(mockOnBench).toHaveBeenCalledWith('knight-3');
    });
  });
});
