import { ref, type Ref } from 'vue'
import type { GameCard } from '@/types/game'

export const useInteraction = (
  playerHand: Ref<GameCard[]>,
  placeCard: (card: GameCard, x: number, y: number) => boolean
) => {
  // This ref MUST only store the string ID, not the object
  const selectedCardId = ref<string | null>(null)

  /**
   * Triggered when starting a drag.
   * Ensure we only pass and store the ID.
   */
  const handleDragStart = (event: DragEvent, cardId: string) => {
    // Safety check: ensure we are receiving a string
    const id = typeof cardId === 'object' ? (cardId as any).id : cardId

    if (event.dataTransfer) {
      event.dataTransfer.setData('cardId', id)
      event.dataTransfer.dropEffect = 'move'
    }

    selectedCardId.value = id
  }

  /**
   * Triggered when dropping a card onto a game-slot.
   */
  const handleDrop = (event: DragEvent, x: number, y: number) => {
    const cardId = event.dataTransfer?.getData('cardId')
    if (!cardId) return

    const card = playerHand.value.find((c) => c.id === cardId)
    if (card) {
      const success = placeCard(card, x, y)
      if (success) {
        selectedCardId.value = null
      }
    }
  }

  /**
   * Mobile/Tap support: Selecting a card in hand.
   * Fixes the "Object instead of String" warning.
   */
  const handleTapSelect = (cardId: string) => {
    // If the incoming cardId is accidentally an object, extract the id
    const id = typeof cardId === 'object' ? (cardId as any).id : cardId

    // Toggle selection: if already selected, deselect.
    selectedCardId.value = selectedCardId.value === id ? null : id
  }

  /**
   * Mobile/Tap support: Placing the selected card on the board.
   */
  const handleSlotTap = (x: number, y: number) => {
    if (!selectedCardId.value) return

    const card = playerHand.value.find((c) => c.id === selectedCardId.value)
    if (card) {
      const success = placeCard(card, x, y)
      if (success) {
        selectedCardId.value = null
      }
    }
  }

  return {
    selectedCardId,
    handleDragStart,
    handleDrop,
    handleTapSelect,
    handleSlotTap
  }
}