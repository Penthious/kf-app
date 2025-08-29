import { useLocalSearchParams } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Text, View } from 'react-native';
import React from 'react';

export default function Title() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { tokens } = useThemeTokens();
  const { campaigns } = require('@/store/campaigns').useCampaigns(); // safe inside component

  const campaign = id ? campaigns?.[id] : undefined;
  const title = campaign ? `Campaign – ${campaign.name}` : 'Campaign';

  return (
    <View>
      <Text numberOfLines={1} style={{ color: tokens.textPrimary, fontWeight: '800' }}>
        {title}
      </Text>
    </View>
  );
}
