import { PRINCIPALITY_OF_STONE } from '@/catalogs/kingdoms/principality-of-stone';
import { SUNKEN_KINGDOM } from '@/catalogs/kingdoms/sunken-kingdom';
import { TEN_THOUSAND_SUCCULENT_FEARS } from '@/catalogs/kingdoms/ten-thousand-succulent-fears';
import { KingdomCatalog } from '@/models/kingdom';

export const allKingdomsCatalog: KingdomCatalog[] = [
  SUNKEN_KINGDOM as KingdomCatalog,
  TEN_THOUSAND_SUCCULENT_FEARS as KingdomCatalog,
  PRINCIPALITY_OF_STONE as KingdomCatalog,
];
