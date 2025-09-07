import type { KnightCatalogEntry } from '@/catalogs/knights';
import type { CampaignSettings } from '@/models/campaign';

/**
 * Maps knight source strings to expansion keys
 */
const SOURCE_TO_EXPANSION_MAP: Record<
  string,
  keyof NonNullable<CampaignSettings['expansions']> | 'core'
> = {
  Core: 'core', // Core knights are always available
  'Expansion: Ten Thousand Succulent Fears': 'ttsf',
  'Expansion: The Barony of Bountiful Harvest': 'tbbh',
  'Expansion: The Red Kingdom of Eshin': 'trkoe',
  Standalone: 'absolute-bastard', // Default standalone mapping - will be overridden by knight ID
};

/**
 * Filters knights based on enabled expansions in campaign settings
 */
export function getAvailableKnights(
  allKnights: KnightCatalogEntry[],
  campaignExpansions?: CampaignSettings['expansions']
): KnightCatalogEntry[] {
  return allKnights.filter(knight => {
    // Handle standalone knights individually by ID
    if (knight.source === 'Standalone') {
      if (knight.id === 'absolute-bastard') {
        return campaignExpansions?.['absolute-bastard']?.enabled === true;
      }
      if (knight.id === 'ser-gallant') {
        return campaignExpansions?.['ser-gallant']?.enabled === true;
      }
      return false; // Unknown standalone knight
    }

    const expansion = SOURCE_TO_EXPANSION_MAP[knight.source];

    // Core knights are always available
    if (expansion === 'core') {
      return true;
    }

    // Check if the expansion is enabled (expansion is guaranteed to be a valid expansion key here)
    return (
      campaignExpansions?.[expansion as keyof NonNullable<CampaignSettings['expansions']>]
        ?.enabled === true
    );
  });
}

/**
 * Gets the expansion name for display purposes
 */
export function getExpansionDisplayName(
  expansion: keyof NonNullable<CampaignSettings['expansions']>
): string {
  const names: Record<keyof NonNullable<CampaignSettings['expansions']>, string> = {
    ttsf: 'Ten Thousand Succulent Fears',
    tbbh: 'The Barony of Bountiful Harvest',
    trkoe: 'The Red Kingdom of Eshin',
    'absolute-bastard': 'Absolute Bastard',
    'ser-gallant': 'Ser Gallant',
  };

  return names[expansion] || expansion;
}

/**
 * Gets the expansion description for display purposes
 */
export function getExpansionDescription(
  expansion: keyof NonNullable<CampaignSettings['expansions']>
): string {
  const descriptions: Record<keyof NonNullable<CampaignSettings['expansions']>, string> = {
    ttsf: 'Adds Ser Ubar and Stoneface knights to your campaign.',
    tbbh: 'Adds Delphine knight to your campaign.',
    trkoe: 'Adds Reiner knight to your campaign.',
    'absolute-bastard': 'Adds Absolute Bastard knight to your campaign.',
    'ser-gallant': 'Adds Ser Gallant knight to your campaign.',
  };

  return descriptions[expansion] || '';
}
