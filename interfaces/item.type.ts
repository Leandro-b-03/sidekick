// For nested Bonus object
export interface EvolutionBonus {
  [key: string]: string;
}

// For Evolution Stage object
export interface EvolutionStage {
  level: number;
  player_level: string;
  bonus: EvolutionBonus;
  appearance: string;
  evolution_requirement: string;
}

// For Damage object
export interface DamageInfo {
  base: string;
  versatile: string;
}

// Structure matching my code
export interface MagicItemDocument {
  slug: string;
  name: string;
  class: string | null;
  description: string;
  weapon_type: string | null;
  requirements: string;
  type: string;
  wondrous_item: string | null;
  rarity: string;
  evolution_level: EvolutionStage | []; // JSON string of EvolutionStage[]
  notes: string[];
  evolution_notes: string[];
  damage: DamageInfo | []; // JSON string of DamageInfo
  item_tier: string | null;
  damage_type: string | null;
}

// Structure for LOCAL component state (more convenient to work with)
export interface MagicItemLocalState extends Omit<MagicItemDocument, 'evolution_level' | 'wondrous_item' | 'item_tier' | 'weapon_type' | 'evolution_notes' | 'damage_type'> {
  evolutionLevel: EvolutionStage[]; // Use array of objects locally
  wondrousItem: string; // Use string locally for easier manipulation
  itemTier: string; // Use string locally for easier manipulation
  weaponType: string; // Use string locally for easier manipulation
  evolutionNotes: string[]; // Use array of strings locally
  damageType: string; // Use string locally for easier manipulation

  // Local UI state
  show: boolean;
  image: string | ArrayBuffer | null; // Allow ArrayBuffer from FileReader
}