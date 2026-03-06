import {ref} from 'vue'
import type {FairyCard} from '@/types/game'

export const useInteraction = (
  playerHand: { value: FairyCard[] },
  placeCard: (card: FairyCard, x: number, y: number) => boolean
) => {
  const selectedCardId = ref<string | null>(null)

  const handleDragStart = (event: DragEvent, card: FairyCard) => {
    // Standard desktop drag
    event.dataTransfer?.setData('cardId', card.id)
    selectedCardId.value = card.id
  }

  const handleDrop = (event: DragEvent, x: number, y: number) => {
    const id = event.dataTransfer?.getData('cardId') || selectedCardId.value
    if (id) executeMove(id, x, y)
  }

  const handleTapSelect = (card: FairyCard) => {
    // Primary mobile interaction
    selectedCardId.value = selectedCardId.value === card.id ? null : card.id
  }

  const handleSlotTap = (x: number, y: number) => {
    if (selectedCardId.value) {
      executeMove(selectedCardId.value, x, y)
    }
  }

  const executeMove = (id: string, x: number, y: number) => {
    const index = playerHand.value.findIndex(c => c.id === id)
    if (index !== -1) {
      const card = playerHand.value[index]
      const success = placeCard(card, x, y)
      if (success) {
        playerHand.value.splice(index, 1)
        selectedCardId.value = null
      }
    }
  }

  return {selectedCardId, handleDragStart, handleDrop, handleTapSelect, handleSlotTap}
}