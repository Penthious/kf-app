import type { Campaign } from '@/models/campaign';
import type {
  Bestiary,
  KingdomAdventureDef,
  KingdomCatalog,
  KingdomContractDef,
  KingdomState,
} from '@/models/kingdom';
import { getBestiaryWithExpansions } from '@/models/kingdom';

export type KingdomAdventureView = KingdomAdventureDef & {
  id: string; // advId, e.g. `${kingdomId}:${slug(name)}`
  completedCount: number;
  completed: boolean; // convenience for singleAttempt: true/false
};

export type KingdomView = {
  id: string;
  name: string;
  adventures: KingdomAdventureView[];
  contracts?: KingdomContractDef[];
  bestiary?: Bestiary;
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function buildAdvId(kingdomId: string, name: string): string {
  return `${kingdomId}:${slug(name)}`;
}

// Read a count from either array state [{ id, completedCount }] or
// record-like state { [id]: number | { completedCount } }.
function readCount(ks: KingdomState | undefined, advId: string): number {
  const advs: unknown = ks?.adventures;
  if (!advs) return 0;

  if (Array.isArray(advs)) {
    const found = advs.find(
      a => a && typeof a === 'object' && 'id' in a && (a as { id: string }).id === advId
    );
    return Number((found as { completedCount?: number })?.completedCount ?? 0);
  }
  if (typeof advs === 'object') {
    const v = (advs as Record<string, unknown>)[advId];
    if (typeof v === 'number') return v;
    if (v && typeof v === 'object' && 'completedCount' in v)
      return Number((v as { completedCount?: number }).completedCount ?? 0);
  }
  return 0;
}

/**
 * Merge a KingdomCatalog with its KingdomState into a single view object
 * for easy rendering and testing.
 */
export function buildKingdomView(
  kingdomId: string,
  campaign: Campaign | undefined,
  catalogs: ReadonlyArray<KingdomCatalog>
): KingdomView | undefined {
  const catalog = catalogs.find(k => k.id === kingdomId);
  if (!catalog) return undefined;

  const ks = campaign?.kingdoms?.find(k => k.kingdomId === kingdomId);

  const adventures = catalog.adventures.map(def => {
    const id = buildAdvId(catalog.id, def.name);
    const completedCount = readCount(ks, id);
    const completed = !!def.singleAttempt && completedCount >= 1;
    return { ...def, id, completedCount, completed };
  });

  return {
    id: catalog.id,
    name: catalog.name,
    adventures,
    contracts: catalog.contracts,
    bestiary: getBestiaryWithExpansions(catalog, campaign?.settings?.expansions),
  };
}
