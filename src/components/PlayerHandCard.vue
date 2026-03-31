<template lang="pug">
  div(
    class="player-hand flex w-full portrait:flex-row landscape:flex-col"
    :class="{ 'opacity-60' : !isActive, 'match-cards': isMatchRoute, 'h-full': !isMatchRoute }"
  )
    div(
      v-for="(card, index) in cards"
      :key="card.instanceId"
      class="card-wrapper relative flex-1 flex items-center justify-center min-h-0 min-w-0 transition-all duration-300"
      style="flex-basis: 20%; flex-shrink: 1; flex-grow: 0;"
      :class="[\
        isPortrait ? 'n-portrait':'n-landscape' ,\
        isMobilePortrait ? 'portrait' : isMobileLandscape ?'landscape' : '',\
        selectedId === card.instanceId ? '-translate-y-3 z-20 scale-105' : 'hover:scale-105 hover:-translate-y-1 z-10',\
        !isActive ? 'grayscale-[40%] cursor-not-allowed' : '',\
        (showHint && index === 0 && !selectedId) ? 'hint-bounce' : ''\
      ]"
    )
      //- The pulsing magical aura glow
      div(
        v-if="selectedId === card.instanceId"
        class="absolute rounded-lg pointer-events-none transition-opacity duration-500 bg-blue-800/90 blur-xl animate-pulse z-0 inset-[-10px]"
      )

      CardDisplay(
        :card="card"
        :draggable="isActive"
        @dragstart="emit('dragstart', $event, card.instanceId)"
        @click.stop="onSelectCard(isActive, card)"
        class="cursor-grab relative z-10 w-full h-full"
      )

      //- Floating Indicator Arrow
      div.absolute.-top-10.z-30.animate-bounce(
        v-if="selectedId === card.instanceId"
        class="left-1/2 -translate-x-1/2"
      )
        span.text-blue-400.text-2xl ▼
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { GameCard } from '@/types/game'
import CardDisplay from '@/components/CardDisplay'
import useSound from '@/use/useSound'
import { isMobilePortrait, isMobileLandscape } from '@/use/useUser'

const props = defineProps<{ cards: GameCard[], isActive: boolean, selectedId: string | null }>()
const emit = defineEmits<{ (e: 'dragstart', event: DragEvent, id: string): void, (e: 'select', id: string): void }>()
const route = useRoute()
const { playSound } = useSound()
const showHint = ref(false)
const isHintDisabled = ref(false)
let hintTimeout: any = null

const isHoverRoute = computed(() => route.name === 'deck' || route.name === 'match')
const isMatchRoute = computed(() => route.name === 'match')
const onHoverCard = () => playSound('hover-card', 0.25)
const onSelectCard = (isActive: boolean, card: any) => {
  isActive && emit('select', card.instanceId)
  playSound('hover-card', 0.3)
}

onMounted(() => {
  isHintDisabled.value = false
})
onUnmounted(() => clearHint())

const startHintTimer = () => {
  clearHint()
  if (props.isActive && !props.selectedId && !isHintDisabled.value) {
    hintTimeout = setTimeout(() => {
      showHint.value = true
    }, 5000)
  }
}

const clearHint = () => {
  if (hintTimeout) {
    clearTimeout(hintTimeout)
    hintTimeout = null
  }
  showHint.value = false
}

// Start timer when turn begins, stop when turn ends
watch(() => props.isActive, (active) => {
  if (active && route.name === 'match') startHintTimer()
  if (!active) clearHint()
}, { immediate: true })

// Stop hint immediately if a card is selected
watch(() => props.selectedId, (newId) => {
  if (newId) {
    isHintDisabled.value = true
    clearHint()
  }
})

const isPortrait = computed(() => window.innerWidth < window.innerHeight)
</script>

<style lang="sass" scoped>
.card-wrapper.n-portrait
  :deep(.game-card)
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

.match-cards .card-wrapper
  width: var(--hand-card-size)
  height: var(--hand-card-size)

  :deep(.game-card)
    @apply w-full h-full
    aspect-ratio: 1/1
    width: 100%
    height: auto
    max-width: var(--hand-card-size)
    max-height: var(--hand-card-size)
    object-fit: none !important
    @media (max-height: 780px)
      width: 100%
      max-width: calc(18vh - 8px)
      max-height: calc(18vh - 8px)

.hint-bounce
  animation: hint-bounce 2s infinite

@keyframes hint-bounce
  0%, 20%, 50%, 80%, 100%
    transform: translateY(0)
  40%
    transform: translateY(-10px)
  60%
    transform: translateY(-5px)
</style>