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
        v-for="(card, index) in cards"
        :key="card.instanceId"
        class="transition-all duration-300"
        :class="[\
          selectedId === card.instanceId ? '-translate-y-3 z-20 scale-105' : 'hover:scale-105 hover:-translate-y-1 z-10',\
          !isActive ? 'grayscale-[40%] cursor-not-allowed' : '',\
          (showHint && index === 0 && !selectedId) ? 'hint-bounce' : ''\
        ]"
      )
        //- The pulsing magical aura glow
        div.absolute.rounded-lg.pointer-events-none.transition-opacity.duration-500(
          v-if="selectedId === card.instanceId"
          class="bg-blue-800/90 blur-xl animate-pulse z-0 inset-[-10px]"
        )

        //- The Card itself
        CardDisplay(
          :card="card"
          :draggable="isActive"
          @dragstart="emit('dragstart', $event, card.instanceId)"
          @click.stop="onSelectCard(isActive, card)"
          @mouseenter="isHoverRoute && onHoverCard()"
          class="cursor-grab relative z-10"
        )

        //- The selected ring overlay
        div.absolute.inset-0.pointer-events-none.z-20(
          v-if="selectedId === card.instanceId"
          class="ring-4 ring-blue-400 rounded-lg shadow-[0_0_20px_rgba(96,165,250,0.8)]"
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
import useSound from '@/use/useSound.ts'

const props = defineProps<{
  cards: GameCard[]
  isActive: boolean
  selectedId: string | null
}>()

const emit = defineEmits<{
  (e: 'dragstart', event: DragEvent, id: string): void
  (e: 'select', id: string): void
}>()

const route = useRoute()
const { playSound } = useSound()
const showHint = ref<boolean>(false)
const isHintDisabled = ref<boolean>(false)
let hintTimeout: ReturnType<typeof setTimeout> | null = null

const isHoverRoute = computed(() => route.name === 'deck' || route.name === 'match')
const isMatchRoute = computed(() => route.name === 'match')

const onHoverCard = () => {
  playSound('hover-card', 0.25)
}
const onSelectCard = (isActive: boolean, card: any) => {
  isActive && emit('select', card.instanceId)
  playSound('hover-card', 0.3)
}

onMounted(() => {
  isHintDisabled.value = false
})

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
  else clearHint()
}, { immediate: true })

// Stop hint immediately if a card is selected
watch(() => props.selectedId, (newId) => {
  if (newId) {
    isHintDisabled.value = true
    clearHint()
  }
})

onUnmounted(() => {
  clearHint()
})
</script>

<style lang="sass" scoped>
.card-wrapper
  width: var(--hand-card-size)
  height: var(--hand-card-size)

  :deep(.game-card)
    @apply w-full h-full

div
  will-change: transform
</style>