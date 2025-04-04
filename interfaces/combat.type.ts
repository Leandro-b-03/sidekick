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
export interface CombatantDocument {
  id: bigint | null; // ID of the combatant
  combat_id: bigint; // ID of the combat this combatant belongs to
  name: string;
  initiative: number;
  max_hp: number; // Store max HP
  current_hp: number; // Store current HP separately
  status: typeof COMBATANT_STATUS[keyof typeof COMBATANT_STATUS]; // Use status constants
  type: 'monster' | 'player';
  turn_history: TurnState[]; // Renamed for clarity, tracks HP etc. over turns
  combatant_id: string; // Unique ID for the combatant
}

// Represents a combat document in the database
export interface CombatDocument {
  id: bigint | null; // ID of the combat
  monsters: number | null; // Number of monsters in the combat
  players: number | null; // Number of players in the combat
  turns: number | null; // Number of turns in the combat
  status: 'ongoing' | 'completed' | 'abandoned' | null; // Combat status
  won: 'monsters' | 'players' | 'draw' | 'none' | null; // Outcome of the combat
}

// Represents a combatant's local state in the UI
export interface CombatantLocalState extends Omit<CombatantDocument, 'max_hp' | 'current_hp' | 'turn_history' | 'combat_id' | 'combatant_id'> {
  // Fields matching Combatant but potentially different types/names locally
  maxHp: number; // Use number locally for easier manipulation
  currentHp: number; // Use number locally for easier manipulation
  turnHistory: TurnState[]; // Use array of TurnState objects locally
  combatId: bigint; // Use bigint locally for easier manipulation
  combatantId: string; // Use string locally for easier manipulation
  // Local UI state fields
  show: boolean; // For toggling visibility in UI
  createdAt: Date; // Timestamp when the combat was created
  updatedAt: Date | null; // Timestamp when the combat was last updated
}