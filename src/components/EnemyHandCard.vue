<template lang="pug">
  //- Main Container for NPC Hand
  div.flex.items-center.justify-center.rounded-xl.transition-all.duration-300(
    :class="isActive ? '' : 'opacity-80'"
    class="min-h-[var(--hand-card-size)] min-w-[var(--hand-card-size)]"
  )
    //- Wrapper for the card stack
    div.flex.p-1(class="flex-row gap-0.5 landscape:flex-col lg:flex-col lg:gap-2")
      //- Loop using instanceId for unique identification
      div.relative.game-card.rounded-lg.flex.items-center.justify-center(
        v-for="card in cards"
        :key="card.instanceId"
        class="transition-transform duration-300"
      )
        template(v-if="activeRules.includes('open')")
          //- Face up display for the Open rule
          CardDisplay(
            :card="card"
            :show-tint="true"
          )
        template(v-else)
          //- Card Backside image (Standard hidden hand)
          img.absolute.inset-0.w-full.h-full.object-fill.rounded-lg.shadow-md(
            src="/images/backside/backside-1_256x256.webp"
            alt="Card Back"
          )
</template>

<script setup lang="ts">
import type { GameCard } from '@/types/game'
import type { RuleName } from '@/use/useBattleRules'
import { activeRules } from '@/use/useMatch'
import CardDisplay from '@/components/CardDisplay'

defineProps<{
  cards: GameCard[]
  isActive: boolean
}>()
</script>

<style lang="sass" scoped>
// Ensures the NPC cards use the same sizing as the rest of the board
.game-card
  width: var(--hand-card-size)
  height: var(--hand-card-size)
  will-change: transform
</style>