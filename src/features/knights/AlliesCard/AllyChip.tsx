import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text, View } from 'react-native';

interface AllyChipProps {
  label: string;
  onRemove: () => void;
}

export function AllyChip({ label, onRemove }: AllyChipProps) {
  const { tokens } = useThemeTokens();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: tokens.surface,
        borderWidth: 1,
        borderColor: '#0006',
        borderRadius: 16,
        paddingHorizontal: 10,
        height: 32,
      }}
    >
      <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{label}</Text>
      <Pressable onPress={onRemove} style={{ marginLeft: 8 }}>
        <Text style={{ color: tokens.textMuted }}>✕</Text>
      </Pressable>
    </View>
  );
}
