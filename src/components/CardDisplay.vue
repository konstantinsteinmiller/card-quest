<template lang="pug">
  div.game-card.relative.perspective-1000.w-full.h-full(class="select-none")
    //- Rule Trigger Indicator
    //- We use a unique key to force a fresh start on every trigger
    transition(name="float-fade")
      div.absolute.inset-0.flex.items-center.justify-center.z-50.pointer-events-none(
        v-if="activeTrigger"
        :key="animationKey"
      )
        span.text-lg.font-black.italic.tracking-tighter.text-shadow-strong(
          :class="triggerClass"
        ) {{ activeTrigger }}

    //- The 3D Wrapper
    div.w-full.h-full.relative.transition-transform.duration-700.transform-style-3d(
      :class="card.owner === 'player' ? 'rotate-y-0' : 'rotate-y-180'"
    )
      div(v-if="isSelection").absolute.inset-0.-top-4.pointer-events-none.z-10
        div.absolute.inset-0.text-shadow.text-amber-400.text-sm.text-center(
          class="w-full h-auto") {{ card.name }}

      //- Single Card Face
      div.absolute.inset-0.backface-hidden.rounded-lg.shadow-lg.overflow-hidden(
        :class="[card.owner === 'player' ? '' : 'rotate-y-180']"
      )
        //- 1. Card Image
        img.absolute.inset-0.w-full.h-full.object-cover(
          :src="card.image"
          class="scale-[90%]"
          :alt="`${card.name}-image` || 'game-card-image'"
        )

        //- 2. Gradient Tint
        div.absolute.inset-0.pointer-events-none.transition-opacity.duration-500(
          v-if="showTint"
          :class="card.owner === 'player' ? 'bg-gradient-to-t from-blue-600/60 via-blue-600/10 to-transparent' : 'bg-gradient-to-t from-red-600/60 via-red-600/10 to-transparent'"
          class="h-full w-full scale-y-[90%] scale-x-[92%]"
        )

        //- 3. Frame
        img.absolute.inset-0.w-full.h-full.pointer-events-none.z-10(
          src="/images/frames/fancy-frame_512x512.png"
          class="object-fill"
        )

        //- 4. Value Grid
        div.absolute.inset-0.flex.items-center.justify-center.z-20
          div.absolute.inset-0.grid.grid-cols-3.grid-rows-3.font-black.pointer-events-none(
            class="px-[8px] py-[4px] landscape:px-[6px] landscape:py-[3px] landscape:sm:px-[0.6rem] landscape:sm:py-[0.4rem] font-[Ribeye]"
            :class="showTint ? 'text-[12px] landscape:text-[13px] landscape:md:text-[15px]' : 'text-[10px] landscape:text-[11px] landscape:md:text-[13px] landscape:sm:px-[6px] landscape:sm:py-[3px]'"
          )
            div.col-start-2.text-center.self-start.text-outline {{ card.values.top }}
            div.row-start-2.col-start-1.flex.items-center.text-outline {{ card.values.left }}
            div.row-start-2.col-start-3.flex.items-center.justify-end.text-outline {{ card.values.right }}
            div.row-start-3.col-start-2.text-center.self-end.text-outline {{ card.values.bottom }}
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { GameCard } from '@/types/game'

const props = defineProps<{
  card: GameCard,
  showTint?: boolean
  isSelection?: boolean
}>()

const activeTrigger = ref<string | null>(null)
const animationKey = ref(0)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const triggerClass = computed(() => {
  switch (activeTrigger.value) {
    case 'Plus':
      return 'text-amber-500'
    case 'Same':
      return 'text-rose-500'
    case 'Combo':
      return 'text-blue-500'
    default:
      return 'text-white'
  }
})

watch(() => props.card.lastRuleTrigger, (newVal) => {
  if (newVal) {
    if (timeoutId) clearTimeout(timeoutId)

    // Incrementing the key forces a complete DOM replacement
    animationKey.value++
    activeTrigger.value = newVal

    timeoutId = setTimeout(() => {
      activeTrigger.value = null
      props.card.lastRuleTrigger = null
    }, 750)
  }
}, { immediate: true })
</script>

<style lang="sass" scoped>
.perspective-1000
  perspective: 1000px

.transform-style-3d
  transform-style: preserve-3d

.backface-hidden
  backface-visibility: hidden

.rotate-y-180
  transform: rotateY(180deg)

.rotate-y-0
  transform: rotateY(0deg)

.text-outline
  color: white
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000

.text-shadow-strong
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8), 2px 2px 0 rgba(0, 0, 0, 1)

// The Transition Classes
.float-fade-enter-active
  animation: float-up 0.8s ease-out forwards

// This is the CRITICAL part: when the element leaves (v-if="false"),
// we ensure it stays at 0 opacity and doesn't snap back.
.float-fade-leave-active
  opacity: 0
  transition: opacity 0.1s

@keyframes float-up
  0%
    opacity: 0
    transform: translateY(10px) scale(0.9)
  20%
    opacity: 1
    transform: translateY(0) scale(1.1)
  80%
    opacity: 1
  100%
    opacity: 0
    // We end at the final position
    transform: translateY(-28px) translateX(3px) scale(1)
</style>