import { watch, type Ref, ref, onUnmounted, type ComputedRef } from 'vue'
import type { GameCard, BoardSlot, GameTurn } from '@/types/game'
import { type Difficulties, DIFFICULTY } from '@/utils/enums'
import type { RuleName } from '@/use/useBattleRules'

// Vite way to import a web worker
import NPCWorker from '@/use/npc.worker?worker'

export const useNPC = (
  turn: Ref<GameTurn>,
  npcHand: Ref<GameCard[]>,
  board: Ref<BoardSlot[][]>,
  placeCard: (card: GameCard, x: number, y: number) => void,
  difficulty: Ref<Difficulties>,
  activeRules: Ref<RuleName[]>,
  playerHand: Ref<GameCard[]>,
  isInitialDialogueDone: Ref<boolean>,
  hasWonAnyGame: ComputedRef<boolean>
) => {
  const ADJ = [
    { dx: 0, dy: -1, side: 'top' as const, opp: 'bottom' as const },
    { dx: 0, dy: 1, side: 'bottom' as const, opp: 'top' as const },
    { dx: -1, dy: 0, side: 'left' as const, opp: 'right' as const },
    { dx: 1, dy: 0, side: 'right' as const, opp: 'left' as const }
  ]

  /* give the player a chance to sometimes beat the perfect play node */
  const isGrandmasterMatch = ref(Math.random() < 0.7)
  const isThinking = ref(false)
  let worker: Worker | null = null

  /**
   * Pity Logic:
   * Used for the player's very first game.
   * NPC tries to place cards next to player cards but deliberately chooses moves
   * that do not result in a capture.
   */
  const calculatePityMove = () => {
    const moves: { cardInstanceId: string; x: number; y: number; score: number; isAdjacent: boolean }[] = []

    npcHand.value.forEach((card) => {
      board.value.forEach((row, y) => {
        row.forEach((slot, x) => {
          if (slot.card) return

          let isAdjacent = false
          ADJ.forEach(adj => {
            const nx = x + adj.dx
            const ny = y + adj.dy
            if (ny >= 0 && ny < 3 && nx >= 0 && nx < 3) {
              if (board.value[ny][nx].card?.owner === 'player') isAdjacent = true
            }
          })

          moves.push({ cardInstanceId: card.instanceId!, x, y, score: 0, isAdjacent })
        })
      })
    })

    const isLowRule = activeRules.value.includes('low')

    // Evaluate "threat" - we want a score of 0 (no capture)
    moves.forEach((move) => {
      const card = npcHand.value.find(c => c.instanceId === move.cardInstanceId)!
      let score = 0

      ADJ.forEach(adj => {
        const nx = move.x + adj.dx
        const ny = move.y + adj.dy
        if (ny >= 0 && ny < 3 && nx >= 0 && nx < 3) {
          const target = board.value[ny][nx].card
          if (target?.owner === 'player') {
            const valAtk = card.values[adj.side]
            const valDef = target.values[adj.opp]

            // Simple capture check
            if (isLowRule) {
              if (valAtk < valDef) score += 1
            } else {
              if (valAtk > valDef) score += 1
            }
          }
        }
      })
      move.score = score
    })

    // Filter for moves that capture nothing
    const nonCapturingMoves = moves.filter(m => m.score === 0)
    const candidates = nonCapturingMoves.length > 0 ? nonCapturingMoves : moves

    // Prioritize adjacency to look "challenging" but fair
    const adjacentCandidates = candidates.filter(m => m.isAdjacent)
    const finalPool = adjacentCandidates.length > 0 ? adjacentCandidates : candidates

    return finalPool[Math.floor(Math.random() * finalPool.length)]
  }

  const calculateBestMove = () => {
    const moves: { cardInstanceId: string; x: number; y: number; score: number }[] = []
    npcHand.value.forEach((card) => {
      board.value.forEach((row, y) => {
        row.forEach((slot, x) => {
          if (!slot.card) moves.push({ cardInstanceId: card.instanceId!, x, y, score: 0 })
        })
      })
    })

    /** * EASY Logic: 60% of the time it plays randomly.
     * The other 40% it ignores this block and uses the Medium/Heuristic logic below.
     */
    if (difficulty.value === DIFFICULTY.EASY) {
      const shouldBeCompletelyRandom = Math.random() < 0.6
      if (shouldBeCompletelyRandom) {
        return moves[Math.floor(Math.random() * moves.length)]
      }
    }

    const isLowRule = activeRules.value.includes('low')

    moves.forEach((move) => {
      if (!move?.cardInstanceId) return console.log('move: ', move)
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
            if (activeRules.value.includes('same') && valAtk === valDef) {
              sameMatches.push({ x: nx, y: ny, card: target })
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

  const performMove = (move: any) => {
    if (!move?.cardInstanceId) return
    const cardToPlace = npcHand.value.find(c => c.instanceId === move.cardInstanceId)
    if (cardToPlace) placeCard(cardToPlace, move.x, move.y)
    isThinking.value = false
  }

  const makeMove = () => {
    if (turn.value !== 'npc' || npcHand.value.length === 0) return
    isThinking.value = true

    // Check for Pity Logic (First Win)
    if (!hasWonAnyGame.value) {
      const pityMove = calculatePityMove()
      setTimeout(() => {
        performMove(pityMove)
      }, 900)
      return
    }

    const usePerfect = difficulty.value === DIFFICULTY.HARD && activeRules.value.includes('open') && isGrandmasterMatch.value

    if (!usePerfect) {
      const bestMove = calculateBestMove()
      setTimeout(() => {
        performMove(bestMove)
      }, 800)
      return
    }

    // 1. Initialize Worker
    if (worker) worker.terminate()
    worker = new NPCWorker()

    // 2. Setup 1500ms Timeout Fallback
    const timeout = setTimeout(() => {
      console.warn('NPC: Perfect play took too long. Falling back to heuristic.')
      if (worker) {
        worker.terminate()
        worker = null
      }
      performMove(calculateBestMove())
    }, 1500)

    // working complex move
    const complexMove = ref(null)
    const complexTimeout = setTimeout(() => {
      // console.log('NPC: Perfect play move.')
      if (complexMove.value) {
        performMove(complexMove.value)
      }
      clearTimeout(complexTimeout)
    }, 900)

    // 3. Handle Worker Result
    worker.onmessage = (event: { data?: any }) => {
      clearTimeout(timeout)
      complexMove.value = event.data
      if (!complexTimeout) {
        // console.warn('NPC: Perfect play directly --- after waiting', event.data)
        performMove(event.data)
      }
      if (worker) {
        worker.terminate()
        worker = null
      }
    }

    // 4. Send Data to Worker
    worker.postMessage({
      board: JSON.parse(JSON.stringify(board.value.map(row => row.map(slot => slot.card ? { ...slot.card } : null)))),
      npcHand: JSON.parse(JSON.stringify(npcHand.value)),
      playerHand: JSON.parse(JSON.stringify(playerHand.value)),
      rules: JSON.parse(JSON.stringify(activeRules.value))
    })
  }

  onUnmounted(() => {
    if (worker) worker.terminate()
  })

  watch([turn, isInitialDialogueDone], ([currentTurn, dialogueDone]) => {
    if (currentTurn === 'npc' && dialogueDone) {
      makeMove()
    }
  }, { immediate: true })

  return { makeMove, isGrandmasterMatch, isThinking }
}