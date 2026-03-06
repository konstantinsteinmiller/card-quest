<template lang="pug">
  div.fairy-card.relative.perspective-1000.w-full.h-full(class="select-none")
    // The 3D Wrapper
    div.w-full.h-full.relative.transition-transform.duration-700.transform-style-3d(
      :class="card.owner === 'player' ? 'rotate-y-0' : 'rotate-y-180'"
    )
      // Single Card Face
      div.absolute.inset-0.backface-hidden.rounded-lg.shadow-lg.border-2.overflow-hidden(
        :class="[card.owner === 'player' ? 'border-blue-400 bg-blue-800' : 'border-red-400 bg-red-800 rotate-y-180']"
      )

        // Internal face container
        div.w-full.h-full.relative.bg-gray-200.bg-opacity-30.flex.items-center.justify-center(class="p-0.5 sm:p-1")
          // Value Grid
          div.absolute.inset-0.grid.grid-cols-3.grid-rows-3.font-black.pointer-events-none.z-10(
            class="text-[9px] sm:text-base"
          )
            div.col-start-2.text-center.self-start.text-outline(class="p-0 md:p-1") {{ card.values.top }}
            div.row-start-2.col-start-1.flex.items-center.text-outline(class="p-1 md:p-2") {{ card.values.left }}
            div.row-start-2.col-start-3.flex.items-center.justify-end.text-outline(class="p-1 md:p-2") {{ card.values.right }}
            div.row-start-3.col-start-2.text-center.self-end.text-outline(class="p-0 md:p-1") {{ card.values.bottom }}
            // Central Icon
            //span.text-xl(class="sm:text-4xl") {{ card.owner === 'player' ? '🧚' : '👹' }}
        img.absolute.top-0.left-0(:src="card.image" alt="fairy-card-image" class="w-full h-full object-fit")

</template>

<script setup lang="ts">
import type {FairyCard} from '@/types/game'

defineProps<{ card: FairyCard }>()
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

// Custom text outline for readability
.text-outline
  color: white
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
</style>