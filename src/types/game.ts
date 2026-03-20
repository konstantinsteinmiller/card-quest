export type Direction = 'top' | 'right' | 'bottom' | 'left'

export interface GameCard {
  id: string
  instanceId?: string
  name: string
  values: {
    top: number
    right: number
    bottom: number
    left: number
  }
  owner: 'player' | 'npc'
  image: string
  lastRuleTrigger?: 'Plus' | 'Same' | 'Combo' | null // Added for visual indicators
}

export interface BoardSlot {
  x: number
  y: number
  card: GameCard | null
}

export type GameTurn = 'player' | 'npc'

export interface GameState {
  board: BoardSlot[][];
  playerHand: GameCard[];
  npcHand: GameCard[];
  turn: 'player' | 'npc';
  activeRules: string[]; // e.g., ['plus', 'same', 'low']
  score: {
    player: number;
    npc: number;
  };
  winner: 'player' | 'npc' | 'draw' | null;
}