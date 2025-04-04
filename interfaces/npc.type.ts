// Interface for details of a single attribute
export interface AttributeDetail {
  title: string;
  short: string;
  value: string; // Stored as string in JSON
  bonus: string; // Stored as string in JSON
}

// Interface for the set of character attributes (parsed structure)
export interface AttributeSet {
  str: AttributeDetail;
  dex: AttributeDetail;
  con: AttributeDetail;
  int: AttributeDetail;
  wis: AttributeDetail;
  cha: AttributeDetail;
}

// Interface for the character's items (parsed structure)
export interface ItemSet {
  weapon: string;
  armor: string;
  other: string;
  potions: string;
}

// Interface for the character's spells (parsed structure)
export interface SpellSet {
  cantrips: string[];
  level_1: string[];
  level_2: string[];
  level_3: string[];
  level_4: string[];
  level_5: string[];
  level_6: string[];
  level_7: string[];
  level_8: string[];
  level_9: string[];
}

// Interface for the character document in supabase
export interface CharacterDocument {
  name: string;
  slug: string;
  race: string;
  class: string; // Using 'class' as it's the Appwrite attribute name
  job: string;
  armour_class: number;
  initiative: string;
  speed: string;
  hit_points: string; // Stored as string in Appwrite
  hit_dice: string;
  description: string;
  appearance: string;
  languages: string;
  saving_throws: string;
  attr: AttributeSet | []; // Contains JSON string of AttributeSet
  sex_orientation: string;
  appearance_description: string; // Detailed appearance description
  affiliation: string;
  alignment: string;
  background: string;
  backstory: string;
  gender: string;
  goal: string;
  personality: string;
  items: ItemSet | []; // Contains JSON string of ItemSet (or empty array)
  enemy: boolean;
  secret_plot: string;
  spells: SpellSet | []; // Contains JSON string of SpellSet (or empty array)
  difficult: string;
  age: number; // Stored as number
  level: number; // Stored as number
}

// Interface for the LOCAL component reactive state
export interface NpcLocalState extends Omit<CharacterDocument, 'hit_points' | 'hit_dice' | 'saving_throws' | 'secret_plot' | 'armour_class' | 'appearance_description' | 'sex_orientation'> {
  // Fields matching CharacterDocument but potentially different types/names locally
  hitPoints: string; // Use string locally for easier manipulation
  hitDice: string; // Use string locally for easier manipulation
  savingThrows: string; // Use string locally for easier manipulation
  secretPlot: string; // Use string locally for easier manipulation
  armourClass: number; // Use number locally for easier manipulation
  appearanceDescription: string; // Use string locally for easier manipulation
  sexOrientation: string; // Use string locally for easier manipulation

  // Local UI state fields
  show: boolean;
  image: string | ArrayBuffer | null; // Allow ArrayBuffer from FileReader
}