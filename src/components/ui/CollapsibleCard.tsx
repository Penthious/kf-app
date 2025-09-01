import { useThemeTokens } from '@/theme/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text } from 'react-native';

import Card from '@/components/Card';

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function CollapsibleCard({
  title,
  children,
  isExpanded,
  onToggle,
}: CollapsibleCardProps) {
  const { tokens } = useThemeTokens();
  return (
    <Card>
      <Pressable
        onPress={onToggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: isExpanded ? 8 : 0,
        }}
      >
        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>{title}</Text>
        <MaterialCommunityIcons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={tokens.textPrimary}
        />
      </Pressable>
      {isExpanded && children}
    </Card>
  );
}
