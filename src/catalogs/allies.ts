export interface AllyEntry {
    id: string;
    name: string;
}

export interface AlliesCatalog {
    saints: AllyEntry[];
    mercenaries: AllyEntry[];
}

export const ALLIES_CATALOG: AlliesCatalog = {
    saints: [
        { id: "st-aloy", name: "Saint Aloy" },
        { id: "st-bran", name: "Saint Bran" },
        { id: "st-colm", name: "Saint Colm" }
    ],
    mercenaries: [
        { id: "sellsword", name: "Sellsword" },
        { id: "marksman", name: "Marksman" },
        { id: "apothecary", name: "Apothecary" }
    ]
};

export default ALLIES_CATALOG;
