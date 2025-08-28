export type ActivationTokenType = 'standard' | 'signature' | 'charge' | 'move' | 'attack';
export type ActivationCounter = { type: ActivationTokenType; count: number };

export type TraitActivation = { name: string; detail: string }; // supports inline [icon:*]
export type TraitAbility = { name: string; details: string };   // supports inline [icon:*]

export type MonsterTrait = Readonly<{
    id: string;                // stable id for reuse
    name: string;
    additionalSetup?: string;
    details?: string;
    activations?: ReadonlyArray<TraitActivation>;
    abilities?: ReadonlyArray<TraitAbility>;
}>;

export type MonsterStats = Readonly<{
    id: string;
    name: string;

    level: number;
    toHit: number;
    wounds: number;
    exhibitionStartingWounds: number;

    aiActivation?: ReadonlyArray<ActivationCounter>;
    signatureActivation?: ReadonlyArray<ActivationCounter>;

    atBonus?: number;
    vigorLossBonus?: number;
    evasionDiceBonus?: number;
    escalations?: number;

    traits?: ReadonlyArray<MonsterTrait>;
}>;

export const ActivationToken = {
    standard: 'standard',
    signature: 'signature',
    charge: 'charge',
    move: 'move',
    attack: 'attack',
} as const;

// helper to build counters with correct literal types
export function activationCounter(type: ActivationTokenType, count: number): Readonly<ActivationCounter> {
    return { type, count };
}