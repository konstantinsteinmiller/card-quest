import { watch, type Ref, ref } from 'vue'
import type { GameCard, BoardSlot, GameTurn } from '@/types/game'
import { type Difficulties, DIFFICULTY } from '@/utils/enums'
import type { RuleName } from '@/use/useBattleRules'

export const useNPC = (
  turn: Ref<GameTurn>,
  npcHand: Ref<GameCard[]>,
  board: Ref<BoardSlot[][]>,
  placeCard: (card: GameCard, x: number, y: number) => void,
  difficulty: Ref<Difficulties>,
  activeRules: Ref<RuleName[]>,
  playerHand: Ref<GameCard[]>
) => {
  const ADJ = [
    { dx: 0, dy: -1, side: 'top' as const, opp: 'bottom' as const },
    { dx: 0, dy: 1, side: 'bottom' as const, opp: 'top' as const },
    { dx: -1, dy: 0, side: 'left' as const, opp: 'right' as const },
    { dx: 1, dy: 0, side: 'right' as const, opp: 'left' as const }
  ]

  // Roll for "Perfect Play" at the start of the match
  const isGrandmasterMatch = ref(Math.random() < 0.7)
  const isThinking = ref(false)

  /**
   * Evaluates the final score of a board state for Minimax
   */
  const evaluateBoardScore = (tempBoard: (GameCard | null)[][]) => {
    let score = 0
    tempBoard.forEach(row => row.forEach(card => {
      if (card) score += (card.owner === 'npc' ? 1 : -1)
    }))
    score += npcHand.value.length
    score -= playerHand.value.length
    return score
  }

  /**
   * Helper to clone and simulate board changes for Minimax recursion
   */
  const getSimulatedState = (currentBoard: (GameCard | null)[][], card: GameCard, x: number, y: number, owner: 'player' | 'npc') => {
    const newBoard = currentBoard.map(r => r.map(c => c ? { ...c } : null))
    const virtualCard = { ...card, owner }
    newBoard[y][x] = virtualCard

    const isLow = activeRules.value.includes('low')
    const hasPlus = activeRules.value.includes('plus')
    const hasSame = activeRules.value.includes('same')

    const captures: { x: number, y: number }[] = []
    const sums = new Map<number, { x: number, y: number, c: GameCard }[]>()
    const matches: { x: number, y: number, c: GameCard }[] = []

    ADJ.forEach(adj => {
      const nx = x + adj.dx, ny = y + adj.dy
      if (ny >= 0 && ny < 3 && nx >= 0 && nx < 3 && newBoard[ny][nx]) {
        const target = newBoard[ny][nx]!
        const vAtk = virtualCard.values[adj.side]
        const vDef = target.values[adj.opp]

        if (hasPlus) {
          const s = vAtk + vDef
          if (!sums.has(s)) sums.set(s, [])
          sums.get(s)!.push({ x: nx, y: ny, c: target })
        }
        if (hasSame && vAtk === vDef) matches.push({ x: nx, y: ny, c: target })

        if (target.owner !== owner) {
          if ((isLow && vAtk < vDef) || (!isLow && vAtk > vDef)) captures.push({ x: nx, y: ny })
        }
      }
    })

    if (hasPlus) {
      sums.forEach(list => {
        if (list.length >= 2) list.forEach(i => {
          if (i.c.owner !== owner) captures.push({ x: i.x, y: i.y })
        })
      })
    }
    if (hasSame && matches.length >= 2) {
      matches.forEach(i => {
        if (i.c.owner !== owner) captures.push({ x: i.x, y: i.y })
      })
    }

    captures.forEach(p => {
      if (newBoard[p.y][p.x]) newBoard[p.y][p.x]!.owner = owner
    })
    return newBoard
  }

  /**
   * Minimax with Alpha-Beta Pruning
   */
  const minimax = (
    currentBoard: (GameCard | null)[][],
    currentNpcHand: GameCard[],
    currentPlayerHand: GameCard[],
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number
  ): number => {
    const isFull = currentBoard.every(row => row.every(slot => slot !== null))
    if (depth === 0 || isFull) return evaluateBoardScore(currentBoard)

    if (isMaximizing) {
      let maxEval = -Infinity
      for (let i = 0; i < currentNpcHand.length; i++) {
        const card = currentNpcHand[i]
        for (let y = 0; y < 3; y++) {
          for (let x = 0; x < 3; x++) {
            if (currentBoard[y][x]) continue
            const nextBoard = getSimulatedState(currentBoard, card, x, y, 'npc')
            const nextHand = [...currentNpcHand.slice(0, i), ...currentNpcHand.slice(i + 1)]
            const evaluation = minimax(nextBoard, nextHand, currentPlayerHand, depth - 1, false, alpha, beta)
            maxEval = Math.max(maxEval, evaluation)
            alpha = Math.max(alpha, evaluation)
            if (beta <= alpha) break
          }
        }
      }
      return maxEval
    } else {
      let minEval = Infinity
      for (let i = 0; i < currentPlayerHand.length; i++) {
        const card = currentPlayerHand[i]
        for (let y = 0; y < 3; y++) {
          for (let x = 0; x < 3; x++) {
            if (currentBoard[y][x]) continue
            const nextBoard = getSimulatedState(currentBoard, card, x, y, 'player')
            const nextHand = [...currentPlayerHand.slice(0, i), ...currentPlayerHand.slice(i + 1)]
            const evaluation = minimax(nextBoard, currentNpcHand, nextHand, depth - 1, true, alpha, beta)
            minEval = Math.min(minEval, evaluation)
            beta = Math.min(beta, evaluation)
            if (beta <= alpha) break
          }
        }
      }
      return minEval
    }
  }

  /**
   * High-tier Perfect Play logic (Requires Open Rule)
   */
  const calculatePerfectMove = () => {
    let bestMove = null
    let maxEval = -Infinity
    const currentBoard = board.value.map(row => row.map(slot => slot.card ? { ...slot.card } : null))

    const emptySlots = currentBoard.flat().filter(s => s === null).length
    const searchDepth = emptySlots > 6 ? 4 : emptySlots

    for (let i = 0; i < npcHand.value.length; i++) {
      const card = npcHand.value[i]
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          if (currentBoard[y][x]) continue
          const nextBoard = getSimulatedState(currentBoard, card, x, y, 'npc')
          const nextHand = [...npcHand.value.slice(0, i), ...npcHand.value.slice(i + 1)]
          const evaluation = minimax(nextBoard, nextHand, playerHand.value, searchDepth - 1, false, -Infinity, Infinity)

          if (evaluation > maxEval) {
            maxEval = evaluation
            bestMove = { cardInstanceId: card.instanceId!, x, y }
          }
        }
      }
    }
    return bestMove
  }

  /**
   * Advanced Heuristic logic for Standard play
   */
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

            if (activeRules.value.includes('plus')) {
              const sum = valAtk + valDef
              if (!sums.has(sum)) sums.set(sum, [])
              sums.get(sum)!.push({ x: nx, y: ny, card: target })
            }

            if (activeRules.value.includes('same')) {
              if (valAtk === valDef) sameMatches.push({ x: nx, y: ny, card: target })
            }

            if (target.owner === 'player') {
              if (isLowRule) {
                if (valAtk < valDef) score += 1
              } else {
                if (valAtk > valDef) score += 1
              }
            }
          }
        }
      })

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
                if (isLowRule ? scVal < vicVal : scVal > vicVal) score += 1.2
              }
            }
          })
        })
      }

      move.score = score
      if (difficulty.value === DIFFICULTY.HARD) {
        if ((move.x === 0 || move.x === 2) && (move.y === 0 || move.y === 2)) move.score += 0.4
      }
    })

    moves.sort((a, b) => b.score - a.score)
    return moves[0]
  }

  const calculateOptimalMove = () => {
    // Only use Minimax if playing on HARD and the OPEN rule is active
    const canPlayPerfectly = difficulty.value === DIFFICULTY.HARD && activeRules.value.includes('open')

    if (canPlayPerfectly && isGrandmasterMatch.value) {
      return calculatePerfectMove()
    }

    return calculateBestMove()
  }

  const makeMove = () => {
    if (turn.value !== 'npc' || npcHand.value.length === 0) return

    isThinking.value = true

    setTimeout(() => {
      const bestMove = calculateOptimalMove()

      if (bestMove) {
        const cardToPlace = npcHand.value.find(c => c.instanceId === bestMove.cardInstanceId)
        if (cardToPlace) placeCard(cardToPlace, bestMove.x, bestMove.y)
      }

      isThinking.value = false
    }, 600)
  }

  watch(turn, (newTurn) => {
    if (newTurn === 'npc') makeMove()
  }, { immediate: true })

  return {
    makeMove,
    isGrandmasterMatch,
    isThinking
  }
}

export default useNPC