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