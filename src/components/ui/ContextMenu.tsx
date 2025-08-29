import React, { useEffect, useState } from 'react';
import { Dimensions, LayoutRectangle, Modal, Pressable, Text, View } from 'react-native';

interface ContextMenuItem {
  key: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ContextMenuProps {
  visible: boolean;
  anchorFrame: LayoutRectangle | null;
  onRequestClose: () => void;
  items: ContextMenuItem[];
  testID?: string;
}

export default function ContextMenu({
  visible,
  anchorFrame,
  onRequestClose,
  items,
  testID,
}: ContextMenuProps) {
  const [menuWidth, setMenuWidth] = useState(220); // measured later, starts with a sensible default
  const [container, setContainer] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!visible || !anchorFrame) return;
    const { width: sw, height: sh } = Dimensions.get('window');
    const gutter = 8;
    const heightGuess = 220;

    const top = Math.min(anchorFrame.y + anchorFrame.height + 6, sh - gutter - heightGuess);

    // ✅ right-align to the burger using the *actual* measured width
    const preferredLeft = anchorFrame.x + anchorFrame.width - menuWidth;
    const left = Math.max(gutter, Math.min(preferredLeft, sw - gutter - menuWidth));

    setContainer({ top, left });
  }, [visible, anchorFrame, menuWidth]);

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onRequestClose}>
      {/* Backdrop behind the menu (tap to dismiss) */}
      <Pressable
        onPress={onRequestClose}
        testID={testID ? `${testID}-backdrop` : undefined}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#00000055',
        }}
      />

      {/* Popover menu */}
      <View
        onLayout={e => setMenuWidth(Math.max(160, Math.round(e.nativeEvent.layout.width)))}
        testID={testID ? `${testID}-menu` : undefined}
        style={{
          position: 'absolute',
          top: container.top,
          left: container.left,
          backgroundColor: '#1B1D22',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#0006',
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
          // min width so we don't collapse
          minWidth: 180,
          maxWidth: 280,
        }}
      >
        {items.map((it, i) => (
          <Pressable
            key={it.key}
            onPress={it.onPress}
            testID={testID ? `${testID}-item-${it.key}` : undefined}
            android_ripple={{ color: '#ffffff22' }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderTopWidth: i === 0 ? 0 : 1,
              borderColor: '#0006',
              backgroundColor: '#1B1D22',
            }}
          >
            <Text
              style={{
                color: it.destructive ? '#F97373' : '#E6E9EF',
                fontWeight: it.destructive ? '800' : '600',
              }}
              testID={testID ? `${testID}-item-text-${it.key}` : undefined}
            >
              {it.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

/** Helper to get a LayoutRectangle for an element */
export function measureInWindow(
  ref: React.RefObject<{
    measureInWindow?: (callback: (x: number, y: number, w: number, h: number) => void) => void;
  }>
): Promise<LayoutRectangle | null> {
  return new Promise(resolve => {
    const node = ref.current;
    if (!node || typeof node.measureInWindow !== 'function') return resolve(null);
    node.measureInWindow((x: number, y: number, w: number, h: number) => {
      resolve({ x, y, width: w, height: h });
    });
  });
}
