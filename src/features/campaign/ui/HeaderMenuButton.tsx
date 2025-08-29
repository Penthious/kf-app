import ContextMenu, { measureInWindow } from '@/components/ui/ContextMenu';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import type { LayoutRectangle } from 'react-native';
import { Alert, Pressable, Text, View } from 'react-native';

interface HeaderMenuButtonProps {
  testID?: string;
}

export default function HeaderMenuButton({ testID }: HeaderMenuButtonProps) {
  const { tokens } = useThemeTokens();
  const { id } = useLocalSearchParams<{ id?: string }>();

  // Ref typed to support measureInWindow without using any
  const anchorRef = useRef<View | null>(null);
  const [open, setOpen] = useState(false);
  const [frame, setFrame] = useState<LayoutRectangle | null>(null);

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

  const menuItems = [
    { key: 'keywords', label: 'Keywords', onPress: () => go(() => router.push('/keywords')) },
    { key: 'theme', label: 'Theme', onPress: () => go(() => router.push('/theme')) },
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
