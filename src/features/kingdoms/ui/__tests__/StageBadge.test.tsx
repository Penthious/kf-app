import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import StageBadge from '../StageBadge';

describe('StageBadge', () => {
  it('renders locked stage correctly', () => {
    const { getByText, getByTestId } = render(<StageBadge stage={0} testID='stage-badge' />);

    expect(getByText('Locked')).toBeTruthy();
    expect(getByTestId('stage-badge')).toBeTruthy();
    expect(getByTestId('stage-badge-text')).toBeTruthy();
  });

  it('renders stage 1 correctly', () => {
    const { getByText } = render(<StageBadge stage={1} />);

    expect(getByText('Stage 1')).toBeTruthy();
  });

  it('renders stage 2 correctly', () => {
    const { getByText } = render(<StageBadge stage={2} />);

    expect(getByText('Stage 2')).toBeTruthy();
  });

  it('renders stage 3 correctly', () => {
    const { getByText } = render(<StageBadge stage={3} />);

    expect(getByText('Stage 3')).toBeTruthy();
  });

  it('renders stage 4 correctly', () => {
    const { getByText } = render(<StageBadge stage={4} />);

    expect(getByText('Stage 4')).toBeTruthy();
  });

  it('handles unknown stage by showing stage number', () => {
    const { getByText } = render(<StageBadge stage={99} />);

    expect(getByText('Stage 99')).toBeTruthy();
  });

  it('handles negative stage by showing stage number', () => {
    const { getByText } = render(<StageBadge stage={-1} />);

    expect(getByText('Stage -1')).toBeTruthy();
  });

  it('applies correct styling for stage 0 (locked)', () => {
    const { getByTestId } = render(<StageBadge stage={0} testID='stage-badge' />);

    const badge = getByTestId('stage-badge');
    const text = getByTestId('stage-badge-text');

    expect(badge.props.style).toMatchObject({
      backgroundColor: '#444',
      paddingHorizontal: 12,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#0006',
      minWidth: 84,
    });

    expect(text.props.style).toMatchObject({
      color: '#fff',
      fontWeight: '800',
    });
  });

  it('applies correct styling for stage 1', () => {
    const { getByTestId } = render(<StageBadge stage={1} testID='stage-badge' />);

    const badge = getByTestId('stage-badge');
    const text = getByTestId('stage-badge-text');

    expect(badge.props.style.backgroundColor).toBe('#2ecc71');
    expect(text.props.style.color).toBe('#0B0B0B');
  });

  it('applies correct styling for stage 2', () => {
    const { getByTestId } = render(<StageBadge stage={2} testID='stage-badge' />);

    const badge = getByTestId('stage-badge');
    const text = getByTestId('stage-badge-text');

    expect(badge.props.style.backgroundColor).toBe('#f1c40f');
    expect(text.props.style.color).toBe('#0B0B0B');
  });

  it('applies correct styling for stage 3', () => {
    const { getByTestId } = render(<StageBadge stage={3} testID='stage-badge' />);

    const badge = getByTestId('stage-badge');
    const text = getByTestId('stage-badge-text');

    expect(badge.props.style.backgroundColor).toBe('#e67e22');
    expect(text.props.style.color).toBe('#fff');
  });

  it('applies correct styling for stage 4', () => {
    const { getByTestId } = render(<StageBadge stage={4} testID='stage-badge' />);

    const badge = getByTestId('stage-badge');
    const text = getByTestId('stage-badge-text');

    expect(badge.props.style.backgroundColor).toBe('#c0392b');
    expect(text.props.style.color).toBe('#fff');
  });

  it('works without testID prop', () => {
    const { getByText, queryByTestId } = render(<StageBadge stage={1} />);

    expect(getByText('Stage 1')).toBeTruthy();
    expect(queryByTestId('stage-badge')).toBeNull();
    expect(queryByTestId('stage-badge-text')).toBeNull();
  });
});
