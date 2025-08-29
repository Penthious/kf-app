import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { AddExistingKnightsProps } from '@/features/knights/types';

export default function AddExistingKnights({
  list,
  onAddActive,
  onBench,
}: AddExistingKnightsProps) {
  const { tokens } = useThemeTokens();

  if (!list || list.length === 0) {
    return (
      <View
        style={{
          padding: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#0006',
          backgroundColor: tokens.surface,
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 14, color: tokens.textMuted }}>
          No other knights available. Create a new one below.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      {list.map(k => (
        <View
          key={k.knightUID}
          style={{
            padding: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#0006',
            backgroundColor: tokens.surface,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ color: tokens.textPrimary, fontWeight: '700' }} numberOfLines={1}>
              {k.name}
            </Text>
            <Text style={{ color: tokens.textMuted, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
              {k.catalogId}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => onAddActive(k.knightUID)}
              style={{
                paddingHorizontal: 12,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: tokens.accent,
                borderWidth: 1,
                borderColor: '#0006',
              }}
            >
              <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Add Active</Text>
            </Pressable>

            <Pressable
              onPress={() => onBench(k.knightUID)}
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
      ))}
    </View>
  );
}
