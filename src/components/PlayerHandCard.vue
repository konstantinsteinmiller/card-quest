<template lang="pug">
  //- 1. Main Container (Tints the hand background)
  div.flex.items-center.justify-center.rounded-xl.transition-all.duration-300(
    :class="isActive ? '' : 'opacity-60'"
    class="min-h-[var(--hand-card-size)] min-w-[var(--hand-card-size)]"
  )
    //- 2. Flex Layout Wrapper
    div.flex.p-1.relative(class="flex-row gap-1 landscape:flex-col lg:flex-col lg:gap-2")
      //- Loop for the actual cards
      div.card-wrapper.relative(
        v-for="card in cards"
        :key="card.id"
        class="transition-all duration-300"
        :class="[\
        selectedId === card.id ? '-translate-y-3 z-20 scale-105' : 'hover:scale-105 hover:-translate-y-1 z-10',\
        !isActive ? 'grayscale-[40%] cursor-not-allowed' : ''\
      ]"
      )
        //- The pulsing magical aura glow (Moved behind the card via z-index)
        div.absolute.rounded-lg.pointer-events-none.transition-opacity.duration-500(
          v-if="selectedId === card.id"
          class="bg-blue-800/90 blur-xl animate-pulse z-0 inset-[-10px]"
        )

        //- The Card itself
        CardDisplay(
          :card="card"
          :draggable="isActive"
          @dragstart="emit('dragstart', $event, card.id)"
          @click.stop="isActive && emit('select', card.id)"
          class="cursor-grab relative z-10"
        )

        //- The selected ring overlay (Stays on top)
        div.absolute.inset-0.pointer-events-none.z-20(
          v-if="selectedId === card.id"
          class="ring-4 ring-blue-400 rounded-lg shadow-[0_0_20px_rgba(96,165,250,0.8)]"
        )

        //- Floating Indicator Arrow
        div.absolute.-top-10.z-30.animate-bounce(
          v-if="selectedId === card.id"
          class="left-1/2 -translate-x-1/2"
        )
          span.text-blue-400.text-2xl ▼
</template>

<script setup lang="ts">
import type { GameCard } from '@/types/game'
import CardDisplay from '@/components/CardDisplay'

defineProps<{
  cards: GameCard[]
  isActive: boolean
  selectedId: string | null
}>()

const emit = defineEmits<{
  (e: 'dragstart', event: DragEvent, id: string): void
  (e: 'select', id: string): void
}>()
</script>

<style lang="sass" scoped>
.card-wrapper
  width: var(--hand-card-size)
  height: var(--hand-card-size)
  // We remove overflow: hidden if it exists on any parent to allow the glow to spread

  :deep(.game-card)
    @apply w-full h-full

div
  will-change: transform
</style>