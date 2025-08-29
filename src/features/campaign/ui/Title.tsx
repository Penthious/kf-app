import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function Title() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { tokens } = useThemeTokens();
  const { campaigns } = useCampaigns();

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
