// src/features/knights/ui/BenchedList.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';
import type { BenchedListProps } from '../types';

export default function BenchedList({
                                        list,
                                        activeCatalogIds,
                                        onActivate,
                                        onRemove,
                                        onEdit,
                                    }: BenchedListProps) {
    const { tokens } = useThemeTokens();

    if (!list || list.length === 0) {
        return <Text style={{ color: tokens.textMuted }}>No benched knights.</Text>;
    }

    return (
        <View style={{ gap: 8 }}>
            {list.map((item) => (
                <View
                    key={item.knightUID}
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
                        <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{item.name}</Text>
                        <Text style={{ color: tokens.textMuted, fontSize: 12 }}>{item.catalogId}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
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
                            <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>Edit</Text>
                        </Pressable>

                        <Pressable
                            disabled={activeCatalogIds.has(item.catalogId)}
                            onPress={() => onActivate(item.knightUID)}
                            style={{
                                paddingHorizontal: 12,
                                height: 32,
                                borderRadius: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: activeCatalogIds.has(item.catalogId)
                                    ? '#555' // disabled look
                                    : tokens.accent,
                                borderWidth: 1,
                                borderColor: '#0006',
                            }}
                        >
                            <Text
                                style={{
                                    color: activeCatalogIds.has(item.catalogId) ? tokens.textMuted : '#0B0B0B',
                                    fontWeight: '800',
                                }}
                            >
                                {activeCatalogIds.has(item.catalogId) ? 'Active Exists' : 'Activate'}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => onRemove(item.knightUID)}
                            style={{
                                paddingHorizontal: 12,
                                height: 32,
                                borderRadius: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#2a1313',
                                borderWidth: 1,
                                borderColor: '#0006',
                            }}
                        >
                            <Text style={{ color: '#F9DADA', fontWeight: '800' }}>Remove</Text>
                        </Pressable>
                    </View>
                </View>
            ))}
        </View>
    );
}