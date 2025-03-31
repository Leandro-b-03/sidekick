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

// Structure matching Appwrite Document (used for saving)
export interface MagicItemDocument {
  name: string;
  class: string | null;
  description: string;
  weaponType: string | null;
  requirements: string;
  type: string;
  wondrousItem: string | null;
  rarity: string;
  evolutionLevel: string[]; // JSON string of EvolutionStage[]
  notes: string[];
  evolutionNotes: string[];
  damage: string[]; // JSON string of DamageInfo
  itemTier: string | null;
  damageType: string | null;
  $id: string | null,
  $createdAt: string | null,
  $updatedAt: string | null,
  $permissions: [] | null,
  $databaseId: string | null,
  $collectionId: string | null,
}

// Structure for LOCAL component state (more convenient to work with)
// Extends the document type but overrides fields that are handled differently locally
export interface MagicItemLocalState extends Omit<MagicItemDocument, 'evolution_level' | 'damage'>, Partial<Models.Document> {
  evolution_level: EvolutionStage[]; // Use array of objects locally
  damage: DamageInfo;              // Use object locally

  // Local UI state
  show: boolean;
  image: string | ArrayBuffer | null; // Allow ArrayBuffer from FileReader
}