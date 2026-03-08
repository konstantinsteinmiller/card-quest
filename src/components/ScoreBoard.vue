<template lang="pug">
  div.flex.items-center.justify-between.w-full.max-w-md.rounded-full.bg-slate-800.shadow-xl.border.border-slate-700(
    class="mb-1 px-4 py-1 sm:mb-4 sm:py-2 md:max-w-xl landscape:max-h-[40px] landscape:mb-0.5 font-[Ribeye]"
  )
    //- Enemy Score (NPC Hand + NPC-owned cards on board)
    div.flex.items-center.gap-2(class="sm:gap-3")
      div.rounded-full.bg-red-600.flex.items-center.justify-center.border-2.border-red-400(
        class="w-6 h-6 sm:w-10 sm:h-10 landscape:w-6 landscape:h-6"
      )
        span(class="text-xs sm:text-lg landscape:text-xs") 👹
      div.flex.flex-col
        span.uppercase.tracking-widest.text-red-300(class="text-[10px] leading-tight hidden sm:block landscape:hidden") Enemy
        span.font-black.leading-none(class="text-lg sm:text-2xl landscape:text-lg") {{ scores.npc }}

    //- Versus Divider
    div.text-slate-500.font-italic(class="text-[10px] sm:text-base") VS

    //- Player Score (Player Hand + Player-owned cards on board)
    div.flex.items-center.gap-2.flex-row-reverse.text-right(class="sm:gap-3")
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

const props = defineProps<{
  board: BoardSlot[][]
  playerHand: GameCard[]
  npcHand: GameCard[]
}>()

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