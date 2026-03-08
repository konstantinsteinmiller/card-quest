export type Direction = 'top' | 'right' | 'bottom' | 'left'

export interface GameCard {
  id: string
  name: string
  values: {
    top: number
    right: number
    bottom: number
    left: number
  }
  owner: 'player' | 'npc'
  image?: string
}

export interface BoardSlot {
  x: number
  y: number
  card: GameCard | null
}