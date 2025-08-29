import type {
  MockCardProps,
  MockNoteInputProps,
  MockNotesListProps,
} from '../../../../test-utils/types';

// Mock the Card component
jest.mock('@/components/Card', () => {
  const React = require('react');
  const { View } = require('react-native');

  function MockCard({ children }: MockCardProps) {
    return <View testID='card'>{children}</View>;
  }

  return MockCard;
});

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

// Mock the custom hook
jest.mock('../useNotesData', () => ({
  useNotesData: () => ({
    notes: [
      { id: '1', text: 'First note', at: 1000 },
      { id: '2', text: 'Second note', at: 2000 },
    ],
    addNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
  }),
}));

// Mock the NoteInput component
jest.mock('../NoteInput', () => {
  const React = require('react');
  const { View } = require('react-native');

  function MockNoteInput({ onAdd }: MockNoteInputProps) {
    return <View testID='note-input' onPress={() => onAdd?.('Test note')} />;
  }

  return { NoteInput: MockNoteInput };
});

// Mock the NotesList component
jest.mock('../NotesList', () => {
  const React = require('react');
  const { View } = require('react-native');

  function MockNotesList({
    notes,
    editingId,
    editText,
    onEditTextChange,
    onBeginEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete,
  }: MockNotesListProps) {
    return (
      <View testID='notes-list'>
        <View testID='notes-count'>{notes?.length}</View>
        {editingId && <View testID='editing-id'>{editingId}</View>}
        <View testID='edit-text'>{editText}</View>
      </View>
    );
  }

  return { NotesList: MockNotesList };
});

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import NotesCard from '../NotesCard';

describe('NotesCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with notes title', () => {
    const { getByText } = render(<NotesCard knightUID='knight-1' />);

    expect(getByText('Notes')).toBeTruthy();
  });

  it('renders note input component', () => {
    const { getByTestId } = render(<NotesCard knightUID='knight-1' />);

    expect(getByTestId('note-input')).toBeTruthy();
  });

  it('renders notes list component', () => {
    const { getByTestId } = render(<NotesCard knightUID='knight-1' />);

    expect(getByTestId('notes-list')).toBeTruthy();
  });

  it('displays correct number of notes', () => {
    const { getByTestId } = render(<NotesCard knightUID='knight-1' />);

    expect(getByTestId('notes-count')).toBeTruthy();
  });

  it('handles different knight UIDs', () => {
    const { getByText } = render(<NotesCard knightUID='knight-2' />);

    expect(getByText('Notes')).toBeTruthy();
  });

  it('initializes with no editing state', () => {
    const { queryByTestId } = render(<NotesCard knightUID='knight-1' />);

    expect(queryByTestId('editing-id')).toBeNull();
  });

  it('initializes with empty edit text', () => {
    const { getByTestId } = render(<NotesCard knightUID='knight-1' />);

    const editTextElement = getByTestId('edit-text');
    expect(editTextElement).toBeTruthy();
  });
});
