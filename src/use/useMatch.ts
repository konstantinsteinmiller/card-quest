import {ref, computed} from 'vue'
import type {FairyCard, BoardSlot} from '@/types/game'
import { useModels } from '@/use/useModels'

export const useMatch = () => {
  const turn = ref<'player' | 'npc'>('player')
  const playerHand = ref<FairyCard[]>([])
  const npcHand = ref<FairyCard[]>([])
  const {fairyModels} = useModels()

  const board = ref<BoardSlot[][]>(Array.from({length: 3}, (_, y) =>
    Array.from({length: 3}, (_, x) => ({x, y, card: null}))
  ))

  // Added: Logic to check if the board is full
  const isBoardFull = computed(() => {
    return board.value.every(row => row.every(slot => slot.card !== null))
  })

  const generateRandomCard = (owner: 'player' | 'npc'): FairyCard => {
    const randomFairy = Math.floor(Math.random() * fairyModels.length)
    const fairyName = fairyModels[randomFairy]?.name

    return {
      id: Math.random().toString(36).substring(2, 9),
      name: `${fairyName}`,
      values: {
        top: Math.floor(Math.random() * 9) + 1,
        right: Math.floor(Math.random() * 9) + 1,
        bottom: Math.floor(Math.random() * 9) + 1,
        left: Math.floor(Math.random() * 9) + 1
      },
      owner,
      image: `/models/${fairyModels[randomFairy]?.model}/preview_400x400.webp`
    }
  }

  const resetGame = () => {
    board.value.forEach(row => row.forEach(slot => {
      slot.card = null
    }))
    playerHand.value = Array.from({length: 5}, () => generateRandomCard('player'))
    npcHand.value = Array.from({length: 5}, () => generateRandomCard('npc'))
    turn.value = 'player'
  }

  const evaluateCapture = (x: number, y: number) => {
    const attackerSlot = board.value[y][x]
    const attackerCard = attackerSlot.card
    if (!attackerCard) return

    const adjacents = [
      {dy: -1, dx: 0, atk: 'top', def: 'bottom'},
      {dy: 1, dx: 0, atk: 'bottom', def: 'top'},
      {dy: 0, dx: 1, atk: 'right', def: 'left'},
      {dy: 0, dx: -1, atk: 'left', def: 'right'}
    ]

    adjacents.forEach(({dy, dx, atk, def}) => {
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

  const placeCard = (card: FairyCard, x: number, y: number) => {
    if (board.value[y][x].card) return false
    board.value[y][x].card = card
    evaluateCapture(x, y)
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
    isBoardFull
  }
}