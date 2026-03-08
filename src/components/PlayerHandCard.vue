<template lang="pug">
  div.flex.items-center.justify-center.rounded-xl.transition-all.duration-300(
    :class="isActive ? 'ring-2 ring-blue-500 bg-blue-900/40' : 'opacity-60'"
    class="min-h-[var(--hand-card-size)] min-w-[var(--hand-card-size)]"
  )
    div.flex.p-1(class="flex-row gap-0.5 landscape:flex-col lg:flex-col lg:gap-2")
      div(
        v-for="card in cards"
        :key="card.id"
        draggable="true"
        @dragstart="emit('dragstart', $event, card)"
        @click.stop="emit('select', card)"
        class="cursor-pointer transition-all duration-200"
        :class="[selectedId === card.id ? '-translate-y-2 ring-2 ring-green-400 rounded-lg z-10' : 'hover:scale-105']"
      )
        CardDisplay(:card="card")
</template>

<script setup lang="ts">
import type {GameCard} from '@/types/game'
import CardDisplay from '@/components/CardDisplay.vue'

defineProps<{
  cards: GameCard[]
  isActive: boolean
  selectedId: string | null
}>()

const emit = defineEmits(['dragstart', 'select'])
</script>