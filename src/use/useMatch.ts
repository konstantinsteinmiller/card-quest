import {ref} from 'vue'
import type {FairyCard, BoardSlot} from '@/types/game'

export const useMatch = () => {
  const turn = ref<'player' | 'npc'>('player')
  const playerHand = ref<FairyCard[]>([])
  const npcHand = ref<FairyCard[]>([])

  // Initialize empty 3x3 board
  const board = ref<BoardSlot[][]>(Array.from({length: 3}, (_, y) =>
    Array.from({length: 3}, (_, x) => ({x, y, card: null}))
  ))

  const generateRandomCard = (owner: 'player' | 'npc'): FairyCard => ({
    id: Math.random().toString(36).substring(2, 9),
    name: 'Fairy',
    values: {
      top: Math.floor(Math.random() * 9) + 1,
      right: Math.floor(Math.random() * 9) + 1,
      bottom: Math.floor(Math.random() * 9) + 1,
      left: Math.floor(Math.random() * 9) + 1
    },
    owner
  })

  const resetGame = () => {
    // Clear board
    board.value.forEach(row => row.forEach(slot => {
      slot.card = null
    }))

    // Deal new hands
    playerHand.value = Array.from({length: 5}, () => generateRandomCard('player'))
    npcHand.value = Array.from({length: 5}, () => generateRandomCard('npc'))

    turn.value = 'player'
  }

  const evaluateCapture = (x: number, y: number) => {
    const attackerSlot = board.value[y][x]
    const attackerCard = attackerSlot.card
    if (!attackerCard) return

    // Directions: [y-offset, x-offset, attackerSide, defenderSide]
    const adjacents = [
      {dy: -1, dx: 0, atk: 'top', def: 'bottom'},    // North
      {dy: 1, dx: 0, atk: 'bottom', def: 'top'},    // South
      {dy: 0, dx: 1, atk: 'right', def: 'left'},    // East
      {dy: 0, dx: -1, atk: 'left', def: 'right'}    // West
    ]

    adjacents.forEach(({dy, dx, atk, def}) => {
      const targetY = y + dy
      const targetX = x + dx

      // Check board boundaries
      if (targetY >= 0 && targetY < 3 && targetX >= 0 && targetX < 3) {
        const defenderSlot = board.value[targetY][targetX]
        const defenderCard = defenderSlot.card

        // Capture logic: If there's an opponent's card and our value is higher
        if (defenderCard && defenderCard.owner !== attackerCard.owner) {
          const atkVal = (attackerCard.values as any)[atk]
          const defVal = (defenderCard.values as any)[def]

          if (atkVal > defVal) {
            /** * CRITICAL FOR 3D FLIP:
             * We change the property on the existing object.
             * FairyCardDisplay.vue watches this property to trigger the CSS rotation.
             */
            defenderCard.owner = attackerCard.owner
          }
        }
      }
    })
  }

  const placeCard = (card: FairyCard, x: number, y: number) => {
    // Prevent placing on occupied slots
    if (board.value[y][x].card) return false

    // Place the card on the board
    board.value[y][x].card = card

    // Check for captures
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
    placeCard
  }
}