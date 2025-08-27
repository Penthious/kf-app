import pos from "@/catalogs/kingdoms/principality-of-stone.json";
import ttsf from "@/catalogs/kingdoms/ten-thousand-succulent-fears.json";
import {KingdomCatalog} from "@/models/kingdom";

export const allKingdomsCatalog: KingdomCatalog[] = [
    pos as KingdomCatalog,
    ttsf as KingdomCatalog,
];
