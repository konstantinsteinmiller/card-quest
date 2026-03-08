import { watch, type Ref } from 'vue'
import type { GameCard, BoardSlot, GameTurn } from '@/types/game'
import { type Difficulties, DIFFICULTY } from '@/utils/enums.ts'

export const useNPC = (
  turn: Ref<GameTurn>,
  npcHand: Ref<GameCard[]>,
  board: Ref<BoardSlot[][]>,
  placeCard: (card: GameCard, x: number, y: number) => void,
  difficulty: Ref<Difficulties>
) => {
  const makeMove = () => {
    if (turn.value !== 'npc' || npcHand.value.length === 0) return

    // Artificial delay for "thinking"
    setTimeout(() => {
      const bestMove = calculateBestMove()
      if (bestMove) {
        const cardToPlace = npcHand.value.find(c => c.id === bestMove.cardId)
        if (cardToPlace) {
          placeCard(cardToPlace, bestMove.x, bestMove.y)
        }
      }
    }, Math.random() * 500 + 500)
  }

  const calculateBestMove = () => {
    const moves: { cardId: string; x: number; y: number; score: number }[] = []

    // Map out every possible move
    npcHand.value.forEach((card) => {
      board.value.forEach((row, y) => {
        row.forEach((slot, x) => {
          if (!slot.card) {
            moves.push({ cardId: card.id, x, y, score: 0 })
          }
        })
      })
    })

    if (difficulty.value === DIFFICULTY.EASY) {
      return moves[Math.floor(Math.random() * moves.length)]
    }

    // Evaluate moves for Medium/Hard
    moves.forEach((move) => {
      const card = npcHand.value.find(c => c.id === move.cardId)!
      let captures = 0

      const adjacents = [
        { dx: 0, dy: -1, side: 'top' as const, opp: 'bottom' as const },
        { dx: 0, dy: 1, side: 'bottom' as const, opp: 'top' as const },
        { dx: -1, dy: 0, side: 'left' as const, opp: 'right' as const },
        { dx: 1, dy: 0, side: 'right' as const, opp: 'left' as const }
      ]

      adjacents.forEach((adj) => {
        const nx = move.x + adj.dx
        const ny = move.y + adj.dy
        if (ny >= 0 && ny < 3 && nx >= 0 && nx < 3) {
          const target = board.value[ny][nx].card
          if (target && target.owner === 'player') {
            if (card.values[adj.side] > target.values[adj.opp]) {
              captures++
            }
          }
        }
      })

      move.score = captures

      // Hard Mode: Strategic positioning
      if (difficulty.value === DIFFICULTY.HARD) {
        if ((move.x === 0 || move.x === 2) && (move.y === 0 || move.y === 2)) move.score += 0.6
        else if (move.x === 0 || move.x === 2 || move.y === 0 || move.y === 2) move.score += 0.3

        if (move.x === 1 && move.y === 1) move.score -= 0.1
      }
    })

    // Sort by score (descending) and take the best
    moves.sort((a, b) => b.score - a.score)
    return moves[0]
  }

  watch(turn, (newTurn) => {
    if (newTurn === 'npc') makeMove()
  }, { immediate: true })
}