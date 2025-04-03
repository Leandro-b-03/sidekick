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
  level_n: string[];
}

// 1. Interface representing the structure stored in Appwrite
export interface NpcLocalState {
  show: boolean;
  image: string;
  name: string;
  race: string;
  class_: string;
  job: string;
  armour_class: number;
  initiative: string;
  speed: string;
  hitPoints: string;
  hitDice: string;
  description: string;
  appearance: string;
  languages: string;
  savingThrows: string;
  attr: any | null;
  sexOrientation: string;
  appearance_: string;
  affiliation: string;
  alignment: string;
  background: string;
  backstory: string;
  gender: string;
  goal: string;
  personality: string;
  items: any | null;
  enemy: boolean;
  secretPlot: string;
  spells: any | null;
  difficult: string;
  age: number;
  level: number;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

// 1. Interface representing the structure stored in Appwrite
export interface CharacterDocumentSaveAppwrite {
  name: string;
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
  attr: string[]; // Contains JSON string of AttributeSet
  sex_orientation: string;
  appearance_: string; // Detailed appearance description
  affiliation: string;
  alignment: string;
  background: string;
  backstory: string;
  gender: string;
  goal: string;
  personality: string;
  items: string[]; // Contains JSON string of ItemSet (or empty array)
  enemy: boolean;
  secret_plot: string;
  spells: string[]; // Contains JSON string of SpellSet (or empty array)
  difficult: string;
  age: number; // Stored as number
  level: number; // Stored as number
}

export interface CharacterDocumentSaveSupabase {
  name: string;
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
  attr: []; // Contains JSON string of AttributeSet
  sex_orientation: string;
  appearance_description: string; // Detailed appearance description
  affiliation: string;
  alignment: string;
  background: string;
  backstory: string;
  gender: string;
  goal: string;
  personality: string;
  items: []; // Contains JSON string of ItemSet (or empty array)
  enemy: boolean;
  secret_plot: string;
  spells: []; // Contains JSON string of SpellSet (or empty array)
  difficult: string;
  age: number; // Stored as number
  level: number; // Stored as number
}

// 2. Interface for the LOCAL component reactive state
export interface NpcLocalState extends Omit<CharacterDocument, 'attr' | 'items' | 'spells' | 'class' | 'hit_points' | 'armour_class' | 'age' | 'level'> {
  // Fields matching CharacterDocument but potentially different types/names locally
  attr: AttributeSet | null;  // Use parsed object locally, allow null initially
  items: ItemSet | null;     // Use parsed object locally, allow null initially
  spells: SpellSet | null;    // Use parsed object locally, allow null initially
  class_: string;            // Use 'class_' locally if needed to avoid reserved word issues in templates/forms
  hit_points: number | string; // Allow string for input, number preferred locally? Or keep string? Let's use number locally.
  armour_class: number;       // Keep as number
  age: number;                // Keep as number
  level: number;              // Keep as number

  // Mappings for different local naming conventions (if any) - align where possible
  // sexOrientation: string; // Use sex_orientation if possible locally too
  // savingThrows: string;
  // secretPlot: string;
  // hitDice: string;

  // Local UI state fields
  show: boolean;
  image: string | ArrayBuffer | null; // Allow ArrayBuffer from FileReader

  // Appwrite metadata is inherited via Partial<Models.Document>
}