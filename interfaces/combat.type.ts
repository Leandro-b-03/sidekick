// --- Constants ---
export const COMBATANT_STATUS = {
  ALIVE: 'alive',
  DEAD: 'dead',
  UNCONSCIOUS: 'unconscious',
} as const; // Use const assertion for stricter typing

// --- Interfaces / Types ---
export interface MonsterInfo {
  label: string; // e.g., "monsters.Goblin-Warrior"
  value: string; // e.g., "Goblin-Warrior"
  hp?: number;   // Optional: Add HP to your monsters.json if possible
  // Add other relevant monster stats if available (AC, speed, etc.)
}

// Type for the object holding form values
export interface MonsterFormValues {
  monster: MonsterInfo | undefined;
  monster_qtd: number;
}

// Represents a single state in a combatant's turn history
interface TurnState {
  hp: number;
  // Add other turn-specific states if needed (e.g., conditions, temporary HP)
}

// Represents a combatant (monster or player)
export interface Combatant {
  id: string; // Unique ID for keying in lists
  name: string;
  initiative: number;
  maxHp: number; // Store max HP
  currentHp: number; // Store current HP separately
  status: typeof COMBATANT_STATUS[keyof typeof COMBATANT_STATUS]; // Use status constants
  type: 'monster' | 'player';
  turnHistory: TurnState[]; // Renamed for clarity, tracks HP etc. over turns
  docId?: string; // Optional: Store combat ID if needed
  monsterData?: MonsterInfo; // Optional: Store original monster data if needed
}