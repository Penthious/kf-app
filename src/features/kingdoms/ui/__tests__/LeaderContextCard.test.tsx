import LeaderContextCard from '@/features/kingdoms/ui/LeaderContextCard';
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';

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

describe('LeaderContextCard', () => {
  it('renders "Party Leader" title', () => {
    const { getByTestId } = render(
      <LeaderContextCard leaderName='Test Leader' chapter={1} questDone={false} completedInvs={2} />
    );

    expect(getByTestId('leader-context-title')).toBeTruthy();
    expect(getByTestId('leader-context-title').props.children).toBe('Party Leader');
  });

  it('displays leader information when leader is selected', () => {
    const { getByTestId } = render(
      <LeaderContextCard leaderName='Sir Galahad' chapter={3} questDone={true} completedInvs={4} />
    );

    expect(getByTestId('leader-info-container')).toBeTruthy();
    expect(getByTestId('leader-name').props.children).toBe('Sir Galahad');
    expect(getByTestId('leader-chapter').props.children).toBe(3);
    expect(getByTestId('quest-status').props.children).toBe('Completed');
    expect(getByTestId('investigation-count').props.children).toEqual([4, '/', 5]);
  });

  it('shows "Not yet" when quest is not done', () => {
    const { getByTestId } = render(
      <LeaderContextCard
        leaderName='Sir Lancelot'
        chapter={2}
        questDone={false}
        completedInvs={1}
      />
    );

    expect(getByTestId('quest-status').props.children).toBe('Not yet');
    expect(getByTestId('investigation-count').props.children).toEqual([1, '/', 5]);
  });

  it('shows "?" for chapter when chapter is undefined', () => {
    const { getByTestId } = render(
      <LeaderContextCard
        leaderName='Sir Percival'
        chapter={undefined}
        questDone={false}
        completedInvs={0}
      />
    );

    expect(getByTestId('leader-chapter').props.children).toBe('?');
  });

  it('shows "No leader selected" when no leader name is provided', () => {
    const { getByTestId } = render(
      <LeaderContextCard leaderName={undefined} chapter={1} questDone={false} completedInvs={0} />
    );

    expect(getByTestId('no-leader-message')).toBeTruthy();
    expect(getByTestId('no-leader-message').props.children).toBe('No leader selected.');
  });

  it('shows "No leader selected" when leader name is empty string', () => {
    const { getByTestId } = render(
      <LeaderContextCard leaderName='' chapter={1} questDone={false} completedInvs={0} />
    );

    expect(getByTestId('no-leader-message')).toBeTruthy();
  });

  it('shows "No leader selected" when leader name is only whitespace', () => {
    const { getByTestId } = render(
      <LeaderContextCard leaderName='   ' chapter={1} questDone={false} completedInvs={0} />
    );

    expect(getByTestId('no-leader-message')).toBeTruthy();
  });

  it('displays correct investigation count', () => {
    const { getByTestId } = render(
      <LeaderContextCard leaderName='Sir Gawain' chapter={4} questDone={true} completedInvs={5} />
    );

    expect(getByTestId('investigation-count').props.children).toEqual([5, '/', 5]);
  });

  it('handles zero completed investigations', () => {
    const { getByTestId } = render(
      <LeaderContextCard leaderName='Sir Tristan' chapter={1} questDone={false} completedInvs={0} />
    );

    expect(getByTestId('investigation-count').props.children).toEqual([0, '/', 5]);
  });

  it('clamps negative investigation count to 0', () => {
    const { getByTestId } = render(
      <LeaderContextCard
        leaderName='Sir Bedivere'
        chapter={1}
        questDone={false}
        completedInvs={-5}
      />
    );

    expect(getByTestId('investigation-count').props.children).toEqual([0, '/', 5]);
  });

  it('clamps investigation count to max when exceeded', () => {
    const { getByTestId } = render(
      <LeaderContextCard leaderName='Sir Kay' chapter={1} questDone={false} completedInvs={10} />
    );

    expect(getByTestId('investigation-count').props.children).toEqual([5, '/', 5]);
  });

  it('allows custom max investigations', () => {
    const { getByTestId } = render(
      <LeaderContextCard
        leaderName='Sir Gareth'
        chapter={1}
        questDone={false}
        completedInvs={3}
        maxInvestigations={7}
      />
    );

    expect(getByTestId('investigation-count').props.children).toEqual([3, '/', 7]);
  });

  it('clamps to custom max when exceeded', () => {
    const { getByTestId } = render(
      <LeaderContextCard
        leaderName='Sir Bors'
        chapter={1}
        questDone={false}
        completedInvs={10}
        maxInvestigations={3}
      />
    );

    expect(getByTestId('investigation-count').props.children).toEqual([3, '/', 3]);
  });
});
