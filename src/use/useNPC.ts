import { watch, type Ref } from 'vue'
import type { GameCard, BoardSlot, GameTurn } from '@/types/game'
import { type Difficulties, DIFFICULTY } from '@/utils/enums'
import type { RuleName } from '@/use/useBattleRules'

export const useNPC = (
  turn: Ref<GameTurn>,
  npcHand: Ref<GameCard[]>,
  board: Ref<BoardSlot[][]>,
  placeCard: (card: GameCard, x: number, y: number) => void,
  difficulty: Ref<Difficulties>,
  activeRules: Ref<RuleName[]>
) => {
  const ADJ = [
    { dx: 0, dy: -1, side: 'top' as const, opp: 'bottom' as const },
    { dx: 0, dy: 1, side: 'bottom' as const, opp: 'top' as const },
    { dx: -1, dy: 0, side: 'left' as const, opp: 'right' as const },
    { dx: 1, dy: 0, side: 'right' as const, opp: 'left' as const }
  ]

  const calculateBestMove = () => {
    const moves: { cardInstanceId: string; x: number; y: number; score: number }[] = []

    npcHand.value.forEach((card) => {
      board.value.forEach((row, y) => {
        row.forEach((slot, x) => {
          if (!slot.card) moves.push({ cardInstanceId: card.instanceId!, x, y, score: 0 })
        })
      })
    })

    if (difficulty.value === DIFFICULTY.EASY) {
      return moves[Math.floor(Math.random() * moves.length)]
    }

    const isLowRule = activeRules.value.includes('low')

    moves.forEach((move) => {
      const card = npcHand.value.find(c => c.instanceId === move.cardInstanceId)!
      let score = 0
      const specialCaptured: { x: number; y: number; card: GameCard }[] = []
      const sums = new Map<number, { x: number; y: number; card: GameCard }[]>()
      const sameMatches: { x: number; y: number; card: GameCard }[] = []

      ADJ.forEach(adj => {
        const nx = move.x + adj.dx
        const ny = move.y + adj.dy
        if (ny >= 0 && ny < 3 && nx >= 0 && nx < 3) {
          const target = board.value[ny][nx].card
          if (target) {
            const valAtk = card.values[adj.side]
            const valDef = target.values[adj.opp]

            // Plus Rule Logic
            if (activeRules.value.includes('plus')) {
              const sum = valAtk + valDef
              if (!sums.has(sum)) sums.set(sum, [])
              sums.get(sum)!.push({ x: nx, y: ny, card: target })
            }

            // Same Rule Logic
            if (activeRules.value.includes('same')) {
              if (valAtk === valDef) sameMatches.push({ x: nx, y: ny, card: target })
            }

            // High or Low Capture Logic
            if (target.owner === 'player') {
              if (isLowRule) {
                if (valAtk < valDef) score += 1
              } else if (activeRules.value.includes('high')) {
                if (valAtk > valDef) score += 1
              }
            }
          }
        }
      })

      // Process Plus/Same Results
      if (activeRules.value.includes('plus')) {
        sums.forEach(list => {
          if (list.length >= 2) {
            list.forEach(item => {
              if (item.card.owner === 'player') {
                score += 1.5
                specialCaptured.push(item)
              }
            })
          }
        })
      }

      if (activeRules.value.includes('same') && sameMatches.length >= 2) {
        sameMatches.forEach(item => {
          if (item.card.owner === 'player') {
            score += 1.5
            specialCaptured.push(item)
          }
        })
      }

      // Combo Logic (respects Low rule for subsequent flips)
      if (activeRules.value.includes('combo') && specialCaptured.length > 0) {
        specialCaptured.forEach(sc => {
          ADJ.forEach(adj => {
            const nx = sc.x + adj.dx
            const ny = sc.y + adj.dy
            if (ny >= 0 && ny < 3 && nx >= 0 && nx < 3) {
              const victim = board.value[ny][nx].card
              if (victim && victim.owner === 'player' && !specialCaptured.some(s => s.x === nx && s.y === ny)) {
                const scVal = sc.card.values[adj.side]
                const vicVal = victim.values[adj.opp]

                if (isLowRule) {
                  if (scVal < vicVal) score += 1.2
                } else {
                  if (scVal > vicVal) score += 1.2
                }
              }
            }
          })
        })
      }

      move.score = score
      if (difficulty.value === DIFFICULTY.HARD) {
        // Corners are valuable defensive positions
        if ((move.x === 0 || move.x === 2) && (move.y === 0 || move.y === 2)) move.score += 0.4
      }
    })

    // Sort to get the highest score move
    moves.sort((a, b) => b.score - a.score)
    return moves[0]
  }

  const calculateOptimalMove = () => {
  }

  const makeMove = () => {
    if (turn.value !== 'npc' || npcHand.value.length === 0) return
    setTimeout(() => {
      const bestMove = calculateBestMove()
      if (bestMove) {
        const cardToPlace = npcHand.value.find(c => c.instanceId === bestMove.cardInstanceId)
        if (cardToPlace) placeCard(cardToPlace, bestMove.x, bestMove.y)
      }
    }, 600)
  }

  watch(turn, (newTurn) => {
    if (newTurn === 'npc') makeMove()
  }, { immediate: true })

  return { makeMove }
}

export default useNPC