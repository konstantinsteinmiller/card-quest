<template lang="pug">
  div.flex.items-center.justify-center.rounded-xl.transition-all.duration-300(
    :class="isActive ? 'ring-2 ring-red-500 bg-red-900/40' : 'opacity-60'"
    class="min-h-[var(--hand-card-size)] min-w-[var(--hand-card-size)]"
  )
    div.flex.p-1(class="flex-row gap-0.5 landscape:flex-col lg:flex-col lg:gap-2")
      div.relative.game-card.rounded-lg.flex.items-center.justify-center(
        v-for="card in cards"
        :key="card.id"
      )
        img.absolute.inset-0.object-fill(src="/images/backside/backside-1_256x256.webp")
</template>

<script setup lang="ts">
import type { GameCard } from '@/types/game'

defineProps<{
  cards: GameCard[]
  isActive: boolean
}>()
</script>