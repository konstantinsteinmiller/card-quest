<template lang="pug">
  div.flex.items-center.justify-center.rounded-xl.transition-all.duration-300(
    :class="isActive ? 'ring-2 ring-red-500 bg-red-900/40' : 'opacity-60'"
    class="min-h-[var(--hand-card-size)] min-w-[var(--hand-card-size)]"
  )
    div.flex.p-1(class="flex-row gap-0.5 landscape:flex-col lg:flex-col lg:gap-2")
      div.fairy-card.bg-gradient-to-br.from-red-900.to-slate-800.rounded-lg.border-2.border-red-700.flex.items-center.justify-center(
        v-for="card in cards"
        :key="card.id"
      )
        span.text-2xl 👹
</template>

<script setup lang="ts">
import type {FairyCard} from '@/types/game'

defineProps<{
  cards: FairyCard[]
  isActive: boolean
}>()
</script>