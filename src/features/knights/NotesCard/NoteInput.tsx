import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface NoteInputProps {
  onAdd: (text: string) => void;
}

export function NoteInput({ onAdd }: NoteInputProps) {
  const { tokens } = useThemeTokens();
  const [draft, setDraft] = useState<string>('');

  const handleSave = () => {
    const trimmedText = draft.trim();
    if (!trimmedText) return;

    onAdd(trimmedText);
    setDraft('');
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <TextInput
        placeholder='Add a note...'
        placeholderTextColor={tokens.textMuted}
        value={draft}
        onChangeText={setDraft}
        style={{
          flex: 1,
          color: tokens.textPrimary,
          backgroundColor: tokens.surface,
          borderWidth: 1,
          borderColor: '#0006',
          borderRadius: 10,
          paddingHorizontal: 10,
          height: 36,
          marginRight: 8,
        }}
      />
      <Pressable
        onPress={handleSave}
        style={{
          paddingHorizontal: 12,
          height: 36,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tokens.accent,
        }}
      >
        <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Add</Text>
      </Pressable>
    </View>
  );
}
