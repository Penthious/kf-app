import { allKingdomsCatalog } from '@/catalogs/kingdoms';
import Card from '@/components/Card';
import { GearCard } from '@/features/gear/ui/GearCard';
import type { Gear } from '@/models/gear';
import { useCampaigns } from '@/store/campaigns';
import { useGear } from '@/store/gear';
import { useThemeTokens } from '@/theme/ThemeProvider';
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
import { SafeAreaView } from 'react-native-safe-area-context';

type GearSection = {
  title: string;
  gear: Gear[];
  isExpanded: boolean;
};

export default function CampaignGear() {
  const { tokens } = useThemeTokens();
  const campaignId = useCampaigns(s => s.currentCampaignId);
  const { campaigns } = useCampaigns();
  const c = campaignId ? campaigns[campaignId] : undefined;
  const { allGear, getGearByKingdom, getGearByType, getGlobalGear, getEquippedGear } = useGear();
  const { isGearUnlockedForCampaign } = useGear();

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

  const handleGearCamera = async (gear: Gear) => {
    // Temporarily disabled to prevent crashes
    console.log('Camera button pressed for:', gear.name);
    Alert.alert(
      'Camera Disabled',
      'Camera functionality is temporarily disabled to prevent crashes. Please use the gallery option instead.'
    );
  };

  const handleGearGallery = async (gear: Gear) => {
    // Temporarily disabled to prevent crashes
    console.log('Gallery button pressed for:', gear.name);
    Alert.alert(
      'Gallery Disabled',
      'Gallery functionality is temporarily disabled to prevent crashes.'
    );
  };

  const handleGearDelete = (gear: Gear) => {
    // TODO: Add confirmation dialog
    useGear.getState().removeGearImage(gear.id);
    console.log('Image deleted for', gear.name);
  };

  const handleGearUnlock = (gear: Gear) => {
    if (!campaignId) return;
    useGear.getState().unlockGearForCampaign(campaignId, gear.id);
    console.log('Gear unlocked for campaign:', gear.name);
  };

  const handleKingdomSelect = (kingdomId: string | null) => {
    setSelectedKingdom(kingdomId);
    setShowKingdomDropdown(false);
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  if (!c) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Card>
            <Text style={{ color: tokens.textMuted }}>Campaign not found</Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
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
              <Text style={[styles.filterLabel, { color: tokens.textPrimary }]}>Search</Text>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    borderColor: tokens.textMuted,
                    color: tokens.textPrimary,
                    backgroundColor: tokens.surface,
                  },
                ]}
                placeholder='Search gear...'
                placeholderTextColor={tokens.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setShowKingdomDropdown(false)}
              />
            </View>
          </View>

          {/* Kingdom Dropdown */}
          {showKingdomDropdown && (
            <View
              style={[
                styles.dropdown,
                { backgroundColor: tokens.surface, borderColor: tokens.textMuted },
              ]}
            >
              <Pressable style={styles.dropdownItem} onPress={() => handleKingdomSelect(null)}>
                <Text style={[styles.dropdownItemText, { color: tokens.textPrimary }]}>
                  All Kingdoms
                </Text>
              </Pressable>
              {allKingdomsCatalog.map(kingdom => (
                <Pressable
                  key={kingdom.id}
                  style={styles.dropdownItem}
                  onPress={() => handleKingdomSelect(kingdom.id)}
                >
                  <Text style={[styles.dropdownItemText, { color: tokens.textPrimary }]}>
                    {kingdom.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </Card>

        {/* Gear Sections */}
        {sections.map(section => (
          <Card key={section.title} style={styles.sectionCard}>
            <Pressable style={styles.sectionHeader} onPress={() => toggleSection(section.title)}>
              <Text style={[styles.sectionTitle, { color: tokens.textPrimary }]}>
                {section.title} ({section.gear.length})
              </Text>
              <Ionicons
                name={section.isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={tokens.textMuted}
              />
            </Pressable>

            {section.isExpanded && section.gear.length > 0 && (
              <View style={styles.gearGrid}>
                {section.gear.map(gear => (
                  <GearCard
                    key={gear.id}
                    gear={gear}
                    onCamera={handleGearCamera}
                    onGallery={handleGearGallery}
                    onDelete={handleGearDelete}
                    onUnlock={handleGearUnlock}
                    isUnlocked={campaignId ? isGearUnlockedForCampaign(campaignId, gear.id) : false}
                  />
                ))}
              </View>
            )}

            {section.isExpanded && section.gear.length === 0 && (
              <Text style={[styles.emptyText, { color: tokens.textMuted }]}>
                No gear found in this category.
              </Text>
            )}
          </Card>
        ))}

        {sections.every(section => section.gear.length === 0) && (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyText, { color: tokens.textMuted }]}>
              No gear found matching your filters.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  filtersCard: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterColumn: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
  },
  searchInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  gearGrid: {
    gap: 12,
    marginTop: 12,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
