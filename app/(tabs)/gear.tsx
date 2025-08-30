import { allKingdomsCatalog } from '@/catalogs/kingdoms';
import Card from '@/components/Card';
import { GearCard } from '@/features/gear/ui/GearCard';
import type { Gear } from '@/models/gear';
import { useGear } from '@/store/gear';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { ImageHandler } from '@/utils/image-handler';
import { Ionicons } from '@expo/vector-icons';

import { useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type GearSection = {
  title: string;
  gear: Gear[];
  isExpanded: boolean;
};

export default function GearScreen() {
  const { tokens } = useThemeTokens();
  const { allGear } = useGear();

  const [selectedKingdom, setSelectedKingdom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showKingdomDropdown, setShowKingdomDropdown] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Kingdom Gear': false,
    'Monster Gear': false,
    'Wandering Monster Gear': false,
    'Consumable Gear': false,
    'Upgrade Cards': false,
    'Merchant Gear': false,
  });

  // Get all gear data
  const allGearArray = Object.values(allGear);

  // Filter gear based on selected kingdom and search query
  const filteredGear = allGearArray.filter(gear => {
    // Filter by kingdom
    const kingdomMatch =
      !selectedKingdom ||
      gear.kingdomId === selectedKingdom ||
      gear.type === 'wandering' ||
      gear.type === 'consumable' ||
      gear.type === 'upgrade' ||
      gear.type === 'merchant';

    // Filter by search query
    const searchMatch = !searchQuery || gear.name.toLowerCase().includes(searchQuery.toLowerCase());

    return kingdomMatch && searchMatch;
  });

  // Group gear by categories
  const kingdomGear = filteredGear.filter(gear => gear.type === 'kingdom');
  const monsterGear = filteredGear.filter(gear => gear.type === 'monster');
  const wanderingGear = filteredGear.filter(gear => gear.type === 'wandering');
  const consumableGear = filteredGear.filter(gear => gear.type === 'consumable');
  const upgradeGear = filteredGear.filter(gear => gear.type === 'upgrade');
  const merchantGear = filteredGear.filter(gear => gear.type === 'merchant');

  const selectedKingdomName = selectedKingdom
    ? allKingdomsCatalog.find(k => k.id === selectedKingdom)?.name
    : null;

  const sections: GearSection[] = [
    {
      title: selectedKingdomName ? `Kingdom Gear (${selectedKingdomName})` : 'Kingdom Gear',
      gear: kingdomGear,
      isExpanded: searchQuery ? kingdomGear.length > 0 : expandedSections['Kingdom Gear'],
    },
    {
      title: selectedKingdomName ? `Monster Gear (${selectedKingdomName})` : 'Monster Gear',
      gear: monsterGear,
      isExpanded: searchQuery ? monsterGear.length > 0 : expandedSections['Monster Gear'],
    },
    {
      title: 'Wandering Monster Gear',
      gear: wanderingGear,
      isExpanded: searchQuery
        ? wanderingGear.length > 0
        : expandedSections['Wandering Monster Gear'],
    },
    {
      title: 'Consumable Gear',
      gear: consumableGear,
      isExpanded: searchQuery ? consumableGear.length > 0 : expandedSections['Consumable Gear'],
    },
    {
      title: 'Upgrade Cards',
      gear: upgradeGear,
      isExpanded: searchQuery ? upgradeGear.length > 0 : expandedSections['Upgrade Cards'],
    },
    {
      title: 'Merchant Gear',
      gear: merchantGear,
      isExpanded: searchQuery ? merchantGear.length > 0 : expandedSections['Merchant Gear'],
    },
  ];

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const handleGearUpload = (gear: Gear) => {
    // TODO: Implement individual gear upload
    console.log('Upload gear:', gear.name);
  };

  const handleGearCamera = async (gear: Gear) => {
    try {
      const imageResult = await ImageHandler.takePhoto();
      if (imageResult) {
        const fileName = `gear_${gear.id}_${Date.now()}.jpg`;
        const savedUri = await ImageHandler.saveImageToDocuments(imageResult.uri, fileName);
        useGear.getState().setGearImage(gear.id, savedUri);
        console.log('Image saved for', gear.name);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleGearGallery = async (gear: Gear) => {
    try {
      console.log('Gallery button pressed for:', gear.name);
      const imageResult = await ImageHandler.pickFromGallery();
      console.log('Image result from handler:', imageResult);

      if (imageResult) {
        const fileName = `gear_${gear.id}_${Date.now()}.jpg`;
        const savedUri = await ImageHandler.saveImageToDocuments(imageResult.uri, fileName);
        useGear.getState().setGearImage(gear.id, savedUri);
        console.log('Image saved for', gear.name);
      } else {
        console.log('No image result returned from picker');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleGearDelete = (gear: Gear) => {
    // TODO: Add confirmation dialog
    useGear.getState().removeGearImage(gear.id);
    console.log('Image deleted for', gear.name);
  };

  const handleGearShare = async (gear: Gear) => {
    try {
      if (gear.imageUrl) {
        await ImageHandler.shareImage(gear.imageUrl, `${gear.name} - Gear Image`);
      } else {
        Alert.alert('No Image', 'This gear item has no image to share.');
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Error', 'Failed to share image.');
    }
  };

  const handleKingdomSelect = (kingdomId: string | null) => {
    setSelectedKingdom(kingdomId);
    setShowKingdomDropdown(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled'>
        {/* Filters */}
        <Card style={styles.filtersCard}>
          <View style={styles.filterRow}>
            <View style={styles.filterColumn}>
              <Text style={[styles.filterLabel, { color: tokens.textPrimary }]}>Kingdom</Text>
              <Pressable
                style={[styles.dropdownButton, { borderColor: tokens.textMuted }]}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowKingdomDropdown(!showKingdomDropdown);
                }}
              >
                <Text style={[styles.dropdownText, { color: tokens.textPrimary }]}>
                  {selectedKingdomName || 'All Kingdoms'}
                </Text>
                <Ionicons name='chevron-down' size={16} color={tokens.textMuted} />
              </Pressable>
            </View>

            <View style={styles.filterColumn}>
              <Text style={[styles.filterLabel, { color: tokens.textPrimary }]}>Filter</Text>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    borderColor: tokens.textMuted,
                    color: tokens.textPrimary,
                    backgroundColor: tokens.surface,
                  },
                ]}
                placeholder='Name of gear card'
                placeholderTextColor={tokens.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                blurOnSubmit={false}
                returnKeyType='done'
              />
            </View>
          </View>
        </Card>

        {/* Kingdom Dropdown */}
        {showKingdomDropdown && (
          <Card style={styles.dropdownCard}>
            <Pressable
              style={[styles.dropdownOption, { borderBottomColor: tokens.textMuted }]}
              onPress={() => handleKingdomSelect(null)}
            >
              <Text style={[styles.dropdownOptionText, { color: tokens.textPrimary }]}>
                All Kingdoms
              </Text>
              {selectedKingdom === null && (
                <Ionicons name='checkmark' size={16} color={tokens.textPrimary} />
              )}
            </Pressable>

            {allKingdomsCatalog.map(kingdom => (
              <Pressable
                key={kingdom.id}
                style={[styles.dropdownOption, { borderBottomColor: tokens.textMuted }]}
                onPress={() => handleKingdomSelect(kingdom.id)}
              >
                <Text style={[styles.dropdownOptionText, { color: tokens.textPrimary }]}>
                  {kingdom.name}
                </Text>
                {selectedKingdom === kingdom.id && (
                  <Ionicons name='checkmark' size={16} color={tokens.textPrimary} />
                )}
              </Pressable>
            ))}
          </Card>
        )}

        {sections.map(section => (
          <Card key={section.title} style={styles.sectionCard}>
            <Pressable
              style={styles.sectionHeader}
              onPress={() => {
                Keyboard.dismiss();
                toggleSection(section.title);
              }}
            >
              <Text style={[styles.sectionTitle, { color: tokens.textPrimary }]}>
                {section.title}
              </Text>
              <Text style={[styles.gearCount, { color: tokens.textMuted }]}>
                ({section.gear.length})
              </Text>
              <Ionicons
                name={section.isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={tokens.textMuted}
                style={styles.expandIcon}
              />
            </Pressable>

            {section.isExpanded && (
              <View style={styles.gearGrid}>
                {section.gear.length > 0 ? (
                  section.gear.map(gear => (
                    <GearCard
                      key={gear.id}
                      gear={gear}
                      onUpload={handleGearUpload}
                      onCamera={handleGearCamera}
                      onGallery={handleGearGallery}
                      onDelete={handleGearDelete}
                      onShare={handleGearShare}
                    />
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: tokens.textMuted }]}>
                    No {section.title.toLowerCase()} available
                  </Text>
                )}
              </View>
            )}
          </Card>
        ))}

        {allGearArray.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: tokens.textPrimary }]}>
              No Gear Available
            </Text>
            <Text style={[styles.emptyText, { color: tokens.textMuted }]}>
              Gear will appear here once added to the catalog.
            </Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  filtersCard: {
    marginBottom: 0,
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 16,
  },
  filterColumn: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  dropdownCard: {
    marginTop: -8,
    marginBottom: 8,
    padding: 0,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  dropdownOptionText: {
    fontSize: 16,
  },

  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionCard: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  gearCount: {
    fontSize: 14,
    marginRight: 8,
  },
  expandIcon: {
    marginLeft: 'auto',
  },
  gearGrid: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
