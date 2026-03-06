<template lang="pug">
  div.fairy-card.relative.perspective-1000.w-full.h-full.select-none
    //- The 3D Wrapper
    div.w-full.h-full.relative.transition-transform.duration-700.transform-style-3d(
      :class="card.owner === 'player' ? 'rotate-y-0' : 'rotate-y-180'"
    )
      //- Single Card Face (The visual content)
      //- We apply 'rotate-y-180' conditionally to the face so the NPC side isn't mirrored
      div.absolute.inset-0.backface-hidden.rounded-lg.shadow-lg.border-2.overflow-hidden(
        :class="[card.owner === 'player' ? 'border-blue-400 bg-blue-800' : 'border-red-400 bg-red-800 rotate-y-180']"
      )
        div.w-full.h-full.relative.bg-black.bg-opacity-30.flex.items-center.justify-center
          //- Value Grid
          div.absolute.inset-0.grid.grid-cols-3.grid-rows-3.font-black.pointer-events-none.z-10(
            class="text-[9px] sm:text-base"
          )
            div.col-start-2.text-center.self-start {{ card.values.top }}
            div.row-start-2.col-start-1.flex.items-center(class="pl-0.5") {{ card.values.left }}
            div.row-start-2.col-start-3.flex.items-center.justify-end(class="pr-0.5") {{ card.values.right }}
            div.row-start-3.col-start-2.text-center.self-end {{ card.values.bottom }}

          //- Central Icon
          span.text-xl(class="sm:text-3xl") {{ card.owner === 'player' ? '🧚' : '👹' }}
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
</style>