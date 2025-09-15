import ContextMenu, { measureInWindow } from '@/components/ui/ContextMenu';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';

interface HeaderMenuButtonProps {
  testID?: string;
}

export default function HeaderMenuButton({ testID }: HeaderMenuButtonProps) {
  const { tokens } = useThemeTokens();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { campaigns, endExpedition } = useCampaigns();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anchorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [frame, setFrame] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const showMenu = async () => {
    const f = await measureInWindow(anchorRef);
    setFrame(f);
    setOpen(true);
  };

  // Close then navigate on next frame → feels instant, avoids modal flashing
  const go = (fn: () => void) => {
    setOpen(false);
    requestAnimationFrame(fn);
  };

  const handleExitCampaign = () => {
    go(() =>
      Alert.alert(
        'Leave campaign?',
        'This will return you to home.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: () => router.replace('/') },
        ],
        { cancelable: true }
      )
    );
  };

  const handleResetExpedition = () => {
    go(() =>
      Alert.alert(
        'Reset Expedition?',
        'This will end the current expedition and return you to the Vision Phase. All expedition progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: () => {
              if (id) {
                endExpedition(id);
              }
            },
          },
        ],
        { cancelable: true }
      )
    );
  };

  // Check if user is past the vision phase
  const campaign = id ? campaigns[id] : null;
  const isPastVisionPhase = campaign?.expedition && campaign.expedition.currentPhase !== 'vision';

  const menuItems = [
    { key: 'keywords', label: 'Keywords', onPress: () => go(() => router.push('/keywords')) },
    { key: 'theme', label: 'Theme', onPress: () => go(() => router.push('/theme')) },
    { key: 'faq', label: 'FAQ', onPress: () => go(() => router.push('/faq')) },
    ...(id
      ? [
          {
            key: 'expansions',
            label: 'Expansions',
            onPress: () => go(() => router.push(`/expansions?id=${id}`)),
          },
          {
            key: 'jura-contracts',
            label: 'Jura Contracts',
            onPress: () => go(() => router.push(`/jura-contracts?campaignId=${id}`)),
          },
        ]
      : []),
    ...(id && isPastVisionPhase
      ? [
          {
            key: 'reset-expedition',
            label: 'Reset Expedition',
            destructive: true,
            onPress: handleResetExpedition,
          },
        ]
      : []),
    ...(id
      ? [
          {
            key: 'exit',
            label: 'Exit Campaign',
            destructive: true,
            onPress: handleExitCampaign,
          },
        ]
      : []),
  ];

  return (
    <>
      <Pressable
        ref={anchorRef}
        onPress={showMenu}
        hitSlop={12}
        testID={testID}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 10,
          backgroundColor: tokens.card,
          borderWidth: 1,
          borderColor: '#0006',
        }}
        accessibilityRole='button'
        accessibilityLabel='Open quick menu'
      >
        <Text
          style={{ color: tokens.textPrimary, fontWeight: '800' }}
          testID={testID ? `${testID}-icon` : undefined}
        >
          ☰
        </Text>
      </Pressable>

      <ContextMenu
        visible={open}
        anchorFrame={frame}
        onRequestClose={() => setOpen(false)}
        items={menuItems}
        testID={testID ? `${testID}-menu` : undefined}
      />
    </>
  );
}
