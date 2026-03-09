import { ref, computed } from 'vue'
import type { GameCard, BoardSlot } from '@/types/game'
import { useModels, modelImgPath } from '@/use/useModels'

const isSplashScreenVisible = ref<boolean>(false)
const isDbInitialized = ref<boolean>(false)


export const useMatch = () => {
  const turn = ref<'player' | 'npc'>('player')
  const playerHand = ref<GameCard[]>([])
  const npcHand = ref<GameCard[]>([])
  const { allCards } = useModels()

  const board = ref<BoardSlot[][]>(Array.from({ length: 3 }, (_, y) =>
    Array.from({ length: 3 }, (_, x) => ({ x, y, card: null }))
  ))

  const isBoardFull = computed(() => {
    return board.value.every(row => row.every(slot => slot.card !== null))
  })

  const generateRandomCard = (owner: 'player' | 'npc'): GameCard => {
    const randomModel = Math.floor(Math.random() * allCards.length)
    const card = allCards[randomModel]

    return {
      id: Math.random().toString(36).substring(2, 9),
      name: `${card?.name || 'Fairy'}`,
      values: { ...card.values },
      owner,
      image: modelImgPath(card?.id || 'missing_id')
    }
  }

  const resetGame = () => {
    board.value.forEach(row => row.forEach(slot => {
      slot.card = null
    }))
    playerHand.value = Array.from({ length: 5 }, () => generateRandomCard('player'))
    npcHand.value = Array.from({ length: 5 }, () => generateRandomCard('npc'))
    turn.value = 'player'
  }

  const evaluateCapture = (x: number, y: number) => {
    const attackerSlot = board.value[y][x]
    const attackerCard = attackerSlot.card
    if (!attackerCard || typeof attackerCard !== 'object') return

    const adjacents = [
      { dy: -1, dx: 0, atk: 'top', def: 'bottom' },
      { dy: 1, dx: 0, atk: 'bottom', def: 'top' },
      { dy: 0, dx: 1, atk: 'right', def: 'left' },
      { dy: 0, dx: -1, atk: 'left', def: 'right' }
    ]

    adjacents.forEach(({ dy, dx, atk, def }) => {
      const targetY = y + dy
      const targetX = x + dx

      if (targetY >= 0 && targetY < 3 && targetX >= 0 && targetX < 3) {
        const defenderSlot = board.value[targetY][targetX]
        const defenderCard = defenderSlot.card

        if (defenderCard && defenderCard.owner !== attackerCard.owner) {
          const atkVal = (attackerCard.values as any)[atk]
          const defVal = (defenderCard.values as any)[def]

          if (atkVal > defVal) {
            defenderCard.owner = attackerCard.owner
          }
        }
      }
    })
  }

  const placeCard = (card: GameCard, x: number, y: number) => {
    if (board.value[y][x].card) return false

    // Remove from hand (Single Source of Truth)
    if (card.owner === 'player') {
      playerHand.value = playerHand.value.filter(c => c.id !== card.id)
    } else {
      npcHand.value = npcHand.value.filter(c => c.id !== card.id)
    }

    board.value[y][x].card = card
    evaluateCapture(x, y)

    // Switch turns
    turn.value = turn.value === 'player' ? 'npc' : 'player'
    return true
  }

  return {
    turn,
    playerHand,
    npcHand,
    board,
    resetGame,
    placeCard,
    isBoardFull,
    isSplashScreenVisible,
    isDbInitialized
  }
}

export default useMatch