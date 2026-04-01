<template lang="pug">
  div(
    class="npc-hand flex w-full portrait:flex-row landscape:flex-col transition-all duration-300"
    :class="{ 'opacity-60 grayscale-[40%]': !isActive }"
  )
    //- Using the same wrapper logic as PlayerHandCard
    div(
      v-for="card in cards"
      :key="card.instanceId"
      class="card-wrapper relative flex-1 flex items-center justify-center min-h-0 min-w-0 transition-all duration-300"
      style="flex-basis: 20%; flex-shrink: 1; flex-grow: 0;"
      :class="isPortrait ? 'n-portrait' : 'n-landscape'"
    )
      div.game-card.relative.w-full.h-full.flex.items-center.justify-center
        template(v-if="activeRules.includes('open')")
          //- Face up display for the Open rule
          CardDisplay(
            :card="card"
            :show-tint="true"
            class="w-full h-full"
          )
        template(v-else)
          //- Card Backside image (Standard hidden hand)
          div.game-card
            img.absolute.inset-0.w-full.h-full.object-fill.rounded-lg.shadow-md(
              src="/images/back-face_256x256.webp"
              alt="Card Back"
            )
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { GameCard } from '@/types/game'
import { activeRules } from '@/use/useMatch'
import CardDisplay from '@/components/CardDisplay'

const props = defineProps<{
  cards: GameCard[]
  isActive: boolean
}>()

const isPortrait = ref(window.innerWidth < window.innerHeight)

const updateOrientation = () => {
  isPortrait.value = window.innerWidth < window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', updateOrientation)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateOrientation)
})
</script>

<style lang="sass" scoped>
// Synchronized with PlayerHandCard.vue logic
.card-wrapper.n-portrait
  :deep(.game-card), .game-card
    height: 100%
    max-width: calc(20vw)
    max-height: calc(20vw)
    aspect-ratio: 1/1

.card-wrapper
  :deep(.game-card)
    width: 100%
    max-width: calc(15vh - 8px)
    max-height: calc(15vh - 8px)
    object-fit: contain

.card-wrapper
  width: var(--hand-card-size)
  height: var(--hand-card-size)

  :deep(.game-card), .game-card
    width: 100%
    height: auto
    max-width: var(--hand-card-size)
    max-height: var(--hand-card-size)
    object-fit: none !important
    aspect-ratio: 1/1
    @media (max-height: 780px)
      width: 100%
      max-width: calc(18vh - 8px)
      max-height: calc(18vh - 8px)
</style>