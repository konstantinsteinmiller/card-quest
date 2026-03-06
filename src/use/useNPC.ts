import {watch} from 'vue'
import type {FairyCard, BoardSlot} from '@/types/game'

/**
 * NPC AI Logic
 * @param turn - Ref to the current turn state
 * @param hand - Ref to the NPC's card hand
 * @param board - Ref to the 3x3 game board
 * @param placeCard - The placement function from useMatch
 */
export const useNPC = (
  turn: { value: 'player' | 'npc' },
  hand: { value: FairyCard[] },
  board: { value: BoardSlot[][] },
  placeCard: (card: FairyCard, x: number, y: number) => boolean
) => {

  const performMove = () => {
    // 1. Collect all valid empty slots
    const emptySlots: { x: number, y: number }[] = []
    board.value.forEach((row, y) => {
      row.forEach((slot, x) => {
        if (!slot.card) emptySlots.push({x, y})
      })
    })

    // 2. If board is full or hand is empty, NPC can't move
    if (emptySlots.length === 0 || hand.value.length === 0) return

    // 3. Simple AI Strategy: Pick a random slot and its first card
    // Note: The owner change in useMatch will trigger the 3D CSS flip automatically
    const targetSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)]
    const npcCard = hand.value[0]

    // 4. Place the card
    const success = placeCard(npcCard, targetSlot.x, targetSlot.y)

    if (success) {
      hand.value.shift() // Remove the card from NPC hand only if placement succeeded
    }
  }

  // Watch for turn changes
  watch(turn, (newTurn) => {
    if (newTurn === 'npc') {
      // Small delay to make it feel like the AI is "thinking"
      setTimeout(performMove, 1200)
    }
  })
}