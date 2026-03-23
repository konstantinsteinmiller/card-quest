import type { GameCard, BoardSlot } from '@/types/game'
import { originalPlayerHand } from '@/use/useMatch'

export type TradeRule = 'one' | 'all' | 'random' | 'conquered'

export interface TradeResult {
  playerGains: GameCard[]
  npcGains: GameCard[]
}

interface TradeStrategy {
  execute(params: {
    winner: 'player' | 'npc' | 'draw'
    board: BoardSlot[][]
    playerHand: GameCard[]
    npcHand: GameCard[]
    selectedCard?: GameCard | null
  }): TradeResult
}

const OneStrategy: TradeStrategy = {
  execute({ winner, selectedCard }) {
    if (winner === 'draw' || !selectedCard) return { playerGains: [], npcGains: [] }
    return {
      playerGains: winner === 'player' ? [selectedCard] : [],
      npcGains: winner === 'npc' ? [selectedCard] : []
    }
  }
}

const AllStrategy: TradeStrategy = {
  execute({ winner, playerHand, npcHand }) {
    if (winner === 'draw') return { playerGains: [], npcGains: [] }
    return {
      playerGains: winner === 'player' ? [...npcHand] : [],
      npcGains: winner === 'npc' ? [...playerHand] : []
    }
  }
}

const RandomStrategy: TradeStrategy = {
  execute({ winner, playerHand, npcHand }) {
    if (winner === 'draw') return { playerGains: [], npcGains: [] }

    if (winner === 'player' && npcHand.length > 0) {
      const randomCard = npcHand[Math.floor(Math.random() * npcHand.length)]
      return { playerGains: [randomCard], npcGains: [] }
    }

    if (winner === 'npc' && playerHand.length > 0) {
      const randomCard = playerHand[Math.floor(Math.random() * playerHand.length)]
      return { playerGains: [], npcGains: [randomCard] }
    }

    return { playerGains: [], npcGains: [] }
  }
}

const ConqueredStrategy: TradeStrategy = {
  execute({ board }) {
    const playerGains: GameCard[] = []
    const npcGains: GameCard[] = []

    board.forEach(row => {
      row.forEach(slot => {
        if (slot.card) {
          const isOriginallyPlayerCard = originalPlayerHand.value.some(c => c.instanceId === slot.card?.instanceId)
          // If the current card owner is 'player' but the original owner was 'npc', player gains it
          if (slot.card.owner === 'player' && !isOriginallyPlayerCard) {
            playerGains.push(slot.card)
          }
          // If the current card owner is 'npc' but the original owner was 'player', npc gains it
          else if (slot.card.owner === 'npc' && isOriginallyPlayerCard) {
            npcGains.push(slot.card)
          }
        }
      })
    })

    return { playerGains, npcGains }
  }
}

const strategies: Record<TradeRule, TradeStrategy> = {
  one: OneStrategy,
  all: AllStrategy,
  random: RandomStrategy,
  conquered: ConqueredStrategy
}

export const useTrade = () => {
  const getTradeResult = (
    rule: TradeRule,
    params: Parameters<TradeStrategy['execute']>[0]
  ): TradeResult => {
    const strategy = strategies[rule] || strategies.one
    return strategy.execute(params)
  }

  return {
    getTradeResult
  }
}