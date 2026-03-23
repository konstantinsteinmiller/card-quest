import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTrade } from '@/use/useTrade'
import type { GameCard, BoardSlot } from '@/types/game'

// Mock the useMatch composable to inject originalPlayerHand
vi.mock('@/use/useMatch', () => ({
  originalPlayerHand: { value: [] }
}))

import { originalPlayerHand } from '@/use/useMatch'

// Helper to create mock cards
const createCard = (instanceId: string, owner: 'player' | 'npc' = 'player'): GameCard => {
  return {
    id: `card_${instanceId}`,
    instanceId,
    owner,
    values: { top: 1, right: 1, bottom: 1, left: 1 },
    element: 'neutral',
    image: '',
    name: `Card ${instanceId}`
  } as unknown as GameCard
}

describe('useTrade Strategies', () => {
  const { getTradeResult } = useTrade()

  let playerHand: GameCard[]
  let npcHand: GameCard[]
  let emptyBoard: BoardSlot[][]

  beforeEach(() => {
    // Reset global states
    originalPlayerHand.value = []

    playerHand = [createCard('p1', 'player'), createCard('p2', 'player')]
    npcHand = [createCard('n1', 'npc'), createCard('n2', 'npc')]

    // 3x3 empty board
    emptyBoard = Array(3).fill(null).map(() =>
      Array(3).fill(null).map(() => ({ card: null, background: 'default' }))
    )
  })

  describe('Rule: ONE', () => {
    it('should give the selected card to the player if player wins', () => {
      const selectedCard = npcHand[0]
      const result = getTradeResult('one', {
        winner: 'player',
        board: emptyBoard,
        playerHand,
        npcHand,
        selectedCard
      })

      expect(result.playerGains).toEqual([selectedCard])
      expect(result.npcGains).toEqual([])
    })

    it('should give the selected card to the npc if npc wins', () => {
      const selectedCard = playerHand[0]
      const result = getTradeResult('one', {
        winner: 'npc',
        board: emptyBoard,
        playerHand,
        npcHand,
        selectedCard
      })

      expect(result.playerGains).toEqual([])
      expect(result.npcGains).toEqual([selectedCard])
    })

    it('should return empty gains on a draw', () => {
      const selectedCard = npcHand[0]
      const result = getTradeResult('one', {
        winner: 'draw',
        board: emptyBoard,
        playerHand,
        npcHand,
        selectedCard
      })

      expect(result.playerGains).toEqual([])
      expect(result.npcGains).toEqual([])
    })

    it('should return empty gains if no card is selected', () => {
      const result = getTradeResult('one', {
        winner: 'player',
        board: emptyBoard,
        playerHand,
        npcHand,
        selectedCard: null
      })

      expect(result.playerGains).toEqual([])
      expect(result.npcGains).toEqual([])
    })
  })

  describe('Rule: ALL', () => {
    it('should give all NPC cards to the player if player wins', () => {
      const result = getTradeResult('all', {
        winner: 'player',
        board: emptyBoard,
        playerHand,
        npcHand
      })

      expect(result.playerGains).toEqual(npcHand)
      expect(result.npcGains).toEqual([])
    })

    it('should give all Player cards to the NPC if npc wins', () => {
      const result = getTradeResult('all', {
        winner: 'npc',
        board: emptyBoard,
        playerHand,
        npcHand
      })

      expect(result.playerGains).toEqual([])
      expect(result.npcGains).toEqual(playerHand)
    })

    it('should return empty gains on a draw', () => {
      const result = getTradeResult('all', {
        winner: 'draw',
        board: emptyBoard,
        playerHand,
        npcHand
      })

      expect(result.playerGains).toEqual([])
      expect(result.npcGains).toEqual([])
    })
  })

  describe('Rule: RANDOM', () => {
    it('should give exactly one random NPC card to the player if player wins', () => {
      const result = getTradeResult('random', {
        winner: 'player',
        board: emptyBoard,
        playerHand,
        npcHand
      })

      expect(result.playerGains).toHaveLength(1)
      expect(npcHand).toContain(result.playerGains[0])
      expect(result.npcGains).toEqual([])
    })

    it('should give exactly one random Player card to the NPC if npc wins', () => {
      const result = getTradeResult('random', {
        winner: 'npc',
        board: emptyBoard,
        playerHand,
        npcHand
      })

      expect(result.playerGains).toEqual([])
      expect(result.npcGains).toHaveLength(1)
      expect(playerHand).toContain(result.npcGains[0])
    })

    it('should return empty gains on a draw', () => {
      const result = getTradeResult('random', {
        winner: 'draw',
        board: emptyBoard,
        playerHand,
        npcHand
      })

      expect(result.playerGains).toEqual([])
      expect(result.npcGains).toEqual([])
    })

    it('should handle empty hands gracefully', () => {
      const result = getTradeResult('random', {
        winner: 'player',
        board: emptyBoard,
        playerHand,
        npcHand: [] // Empty opponent hand
      })

      expect(result.playerGains).toEqual([])
      expect(result.npcGains).toEqual([])
    })
  })

  describe('Rule: CONQUERED', () => {
    it('should assign cards based on board ownership vs original ownership, ignoring the winner parameter', () => {
      // Setup original player hand
      const origPlayer1 = createCard('p1', 'player')
      const origPlayer2 = createCard('p2', 'player')
      originalPlayerHand.value = [origPlayer1, origPlayer2]

      // Setup cards currently on the board
      const cardKeptByPlayer = { ...origPlayer1, owner: 'player' } // Originally player, currently player
      const cardStolenByNpc = { ...origPlayer2, owner: 'npc' }     // Originally player, currently npc

      const origNpc1 = createCard('n1', 'npc')
      const origNpc2 = createCard('n2', 'npc')
      const cardKeptByNpc = { ...origNpc1, owner: 'npc' }          // Originally npc, currently npc
      const cardStolenByPlayer = { ...origNpc2, owner: 'player' }  // Originally npc, currently player

      // Place them on the board
      const board = [...emptyBoard]
      board[0][0] = { card: cardKeptByPlayer, background: 'default' } as BoardSlot
      board[0][1] = { card: cardStolenByNpc, background: 'default' } as BoardSlot
      board[1][0] = { card: cardKeptByNpc, background: 'default' } as BoardSlot
      board[1][1] = { card: cardStolenByPlayer, background: 'default' } as BoardSlot

      const result = getTradeResult('conquered', {
        winner: 'draw', // Winner doesn't matter for this rule
        board,
        playerHand: [],
        npcHand: []
      })

      // Player gains the NPC's original card they conquered
      expect(result.playerGains).toHaveLength(1)
      expect(result.playerGains[0].instanceId).toBe('n2')

      // NPC gains the Player's original card they conquered
      expect(result.npcGains).toHaveLength(1)
      expect(result.npcGains[0].instanceId).toBe('p2')
    })

    it('should return empty gains if no cards changed original ownership', () => {
      const origPlayer = createCard('p1', 'player')
      const origNpc = createCard('n1', 'npc')
      originalPlayerHand.value = [origPlayer]

      const board = [...emptyBoard]
      board[0][0] = { card: origPlayer, background: 'default' } as BoardSlot // Kept by player
      board[0][1] = { card: origNpc, background: 'default' } as BoardSlot // Kept by npc

      const result = getTradeResult('conquered', {
        winner: 'player',
        board,
        playerHand: [],
        npcHand: []
      })

      expect(result.playerGains).toEqual([])
      expect(result.npcGains).toEqual([])
    })
  })
})