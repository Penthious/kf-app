import { useThemeTokens } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import FAQScreen from '@/features/faq/ui/FAQScreen';

export default function FAQRoute() {
  const { tokens } = useThemeTokens();

  const onClose = () => {
    router.back();
  };

  return (
    <>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: tokens.surface,
          borderBottomWidth: 1,
          borderColor: '#0006',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          onPress={onClose}
          style={{
            paddingHorizontal: 10,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.surface,
            borderWidth: 1,
            borderColor: '#0006',
          }}
        >
          <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Close</Text>
        </Pressable>
        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>FAQ</Text>
        <View style={{ width: 60 }} /> {/* Spacer to center the title */}
      </View>

      <FAQScreen />
    </>
  );
}
