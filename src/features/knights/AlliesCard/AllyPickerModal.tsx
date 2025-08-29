import { useThemeTokens } from '@/theme/ThemeProvider';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { AllyOption } from './useAlliesData';

interface AllyPickerModalProps {
  visible: boolean;
  title: string;
  options: AllyOption[];
  onSelect: (option: AllyOption) => void;
  onClose: () => void;
}

export function AllyPickerModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
}: AllyPickerModalProps) {
  const { tokens } = useThemeTokens();

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#0009', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: tokens.card,
            maxHeight: '70%',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 12,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', fontSize: 16 }}>
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: tokens.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#0006',
              }}
            >
              <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>Close</Text>
            </Pressable>
          </View>
          <FlatList
            data={options}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSelect(item)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: tokens.surface,
                  borderWidth: 1,
                  borderColor: '#0006',
                }}
              >
                <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{item.name}</Text>
                <Text style={{ color: tokens.textMuted, fontSize: 12 }}>{item.id}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
