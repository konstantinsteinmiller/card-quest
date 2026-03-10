<template lang="pug">
  div.game-card.relative.perspective-1000.w-full.h-full(class="select-none")
    //- The 3D Wrapper
    div.w-full.h-full.relative.transition-transform.duration-700.transform-style-3d(
      :class="card.owner === 'player' ? 'rotate-y-0' : 'rotate-y-180'"
    )
      //- Single Card Face
      div.absolute.inset-0.backface-hidden.rounded-lg.shadow-lg.overflow-hidden(
        :class="[card.owner === 'player' ? '' : 'rotate-y-180']"
      )
        //- 1. Card Image (Base Layer)
        img.absolute.inset-0.w-full.h-full.object-cover(
          :src="card.image"
          class="scale-[90%]"
          :alt="`${card.name}-image` || 'game-card-image'"
        )

        //- 2. Gradient Tint Overlay
        div.absolute.inset-0.pointer-events-none.transition-opacity.duration-500(
          v-if="showTint"
          :class="card.owner === 'player' ? 'bg-gradient-to-t from-blue-600/60 via-blue-600/10 to-transparent' : 'bg-gradient-to-t from-red-600/60 via-red-600/10 to-transparent'"
          class="h-full w-full scale-y-[90%] scale-x-[92%]"
        )

        //- 3. The Frame (Middle Layer)
        img.absolute.inset-0.w-full.h-full.pointer-events-none.z-10(
          src="/images/frames/fancy-frame_512x512.png"
          class="object-fill"
        )

        //- 4. Value Grid & UI (Top Layer)
        div.absolute.inset-0.flex.items-center.justify-center.z-20(class="")
          div.absolute.inset-0.grid.grid-cols-3.grid-rows-3.font-black.pointer-events-none(
            class="px-[8px] py-[4px] landscape:px-[6px] landscape:py-[3px] landscape:sm:px-[0.6rem] landscape:sm:py-[0.4rem] font-[Ribeye]"
            :class="showTint ? 'text-[12px] landscape:text-[13px] landscape:md:text-[15px]' : 'text-[10px] landscape:text-[11px] landscape:md:text-[13px] landscape:sm:px-[6px] landscape:sm:py-[3px]'"
          )
            div.col-start-2.text-center.self-start.text-outline(class="") {{ card.values.top }}
            div.row-start-2.col-start-1.flex.items-center.text-outline(class="") {{ card.values.left }}
            div.row-start-2.col-start-3.flex.items-center.justify-end.text-outline(class="") {{ card.values.right }}
            div.row-start-3.col-start-2.text-center.self-end.text-outline(class="") {{ card.values.bottom }}
</template>

<script setup lang="ts">
import type { GameCard } from '@/types/game'

defineProps<{
  card: GameCard,
  showTint?: boolean
}>()
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
</style>