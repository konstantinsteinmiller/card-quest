<template lang="pug">
  div.relative.flex.items-center.justify-between.w-full.max-w-md(
    class="px-4 py-1 sm:py-2 md:max-w-xl landscape:max-h-[40px] landscape:mb-0.5 font-[Ribeye]"
  )
    img.absolute.left-0.top-0.w-full.h-full.object-fill(src="/images/frames/frame_papyrus_640x64.webp")

    //- Enemy Score (NPC Hand + NPC-owned cards on board)
    div.flex.items-center.gap-2.z-1.text-shadow(class="sm:gap-3")
      div.rounded-full.bg-red-600.flex.items-center.justify-center.border-2.border-red-400(
        class="w-6 h-6 sm:w-10 sm:h-10 landscape:w-6 landscape:h-6"
      )
        span(class="text-xs sm:text-lg landscape:text-xs") 👹
      div.flex.flex-col
        span.uppercase.tracking-widest.text-red-300(class="text-[10px] leading-tight hidden sm:block landscape:hidden") Enemy
        span.font-black.leading-none(class="text-lg sm:text-2xl landscape:text-lg") {{ scores.npc }}

    //- Rules
    div(v-if="activeRules.length").z-1.text-slate-500.font-italic.gap-3.flex.items-center(class="text-[10px] sm:text-base")
      RuleIcon(class="scale-85 hover:scale-110" v-for="rule in activeRules" :key="rule" :rule="rule" :icon-only="true")


    //- Player Score (Player Hand + Player-owned cards on board)
    div.flex.items-center.gap-2.flex-row-reverse.text-right.z-1.text-shadow(class="sm:gap-3")
      div.rounded-full.bg-blue-600.flex.items-center.justify-center.border-2.border-blue-400(
        class="w-6 h-6 sm:w-10 sm:h-10 landscape:w-6 landscape:h-6"
      )
        span(class="text-xs sm:text-lg landscape:text-xs") 🧚
      div.flex.flex-col
        span.uppercase.tracking-widest.text-blue-300(class="text-[10px] leading-tight hidden sm:block landscape:hidden") Player
        span.font-black.leading-none(class="text-lg sm:text-2xl landscape:text-lg") {{ scores.player }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BoardSlot, GameCard } from '@/types/game'
import { useMatch } from '@/use/useMatch'
import RuleIcon from '@/components/atoms/RuleIcon.vue'

const props = defineProps<{
  board: BoardSlot[][]
  playerHand: GameCard[]
  npcHand: GameCard[]
}>()

const { activeRules } = useMatch()

const scores = computed(() => {
  let pCount = props.playerHand.length
  let nCount = props.npcHand.length

  // Count ownership on the board
  props.board.forEach(row => {
    row.forEach(slot => {
      if (slot.card) {
        if (slot.card.owner === 'player') pCount++
        else nCount++
      }
    })
  })

  return { player: pCount, npc: nCount }
})
</script>