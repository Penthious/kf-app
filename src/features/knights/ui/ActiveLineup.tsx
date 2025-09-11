// src/features/knights/ui/ActiveLineup.tsx
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text, View } from 'react-native';
import type { ActiveLineupProps } from '../types';

export default function ActiveLineup({
  list,
  maxSlots,
  onSetLeader,
  onBench,
  onEdit,
  isLeaderDisabled = false,
}: ActiveLineupProps) {
  const { tokens } = useThemeTokens();

  if (!list || list.length === 0) {
    return <Text style={{ color: tokens.textMuted }}>No active knights.</Text>;
  }

  return (
    <View style={{ gap: 8 }}>
      {list.map(item => {
        const isLeader = !!item.isLeader;

        return (
          <View
            key={item.knightUID}
            style={{
              padding: 12,
              borderRadius: 10,
              backgroundColor: tokens.surface,
              borderWidth: 1,
              borderColor: '#0006',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            {/* Left: name + catalog */}
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{item.name}</Text>
            </View>

            {/* Right: actions */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {/* Leader toggle */}
              <Pressable
                onPress={() => !isLeaderDisabled && onSetLeader(item.knightUID)}
                disabled={isLeaderDisabled}
                style={{
                  paddingHorizontal: 12,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isLeader ? tokens.accent : tokens.surface,
                  borderWidth: 1,
                  borderColor: '#0006',
                  opacity: isLeaderDisabled ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    color: isLeader ? '#0B0B0B' : tokens.textMuted,
                    fontWeight: '800',
                  }}
                >
                  Leader
                </Text>
              </Pressable>

              {/* Edit */}
              <Pressable
                onPress={() => onEdit(item.knightUID)}
                style={{
                  paddingHorizontal: 12,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: tokens.surface,
                  borderWidth: 1,
                  borderColor: '#0006',
                }}
              >
                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Edit</Text>
              </Pressable>

              {/* Bench */}
              <Pressable
                onPress={() => onBench(item.knightUID)}
                style={{
                  paddingHorizontal: 12,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: tokens.surface,
                  borderWidth: 1,
                  borderColor: '#0006',
                }}
              >
                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Bench</Text>
              </Pressable>
            </View>
          </View>
        );
      })}

      {/* Slots indicator */}
      <Text style={{ color: tokens.textMuted, marginTop: 2 }}>
        Slots: {list.length}/{maxSlots}
      </Text>
    </View>
  );
}
