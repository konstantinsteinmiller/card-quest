<template lang="pug">
  div.h-screen.w-screen.bg-slate-900.text-white.overflow-hidden.flex.flex-col.items-center.justify-between.p-2.touch-none(class="select-none")
    // Main Game Area
    div.flex.items-center.justify-center.w-full.h-full.gap-2(
      class="flex-col landscape:flex-row lg:flex-row lg:gap-8"
    )
      // NPC Hand
      EnemyHandCard.order-1(
        :cards="npcHand"
        :is-active="turn === 'npc'"
        class="hand-wrapper-npc"
      )

      // 3x3 Board
      div.order-2.bg-slate-700.p-1.rounded-lg.shadow-2xl(
        class="max-w-[98vw] sm:p-2"
      )
        div.grid.grid-cols-3.gap-1(class="sm:gap-2")
          template(v-for="(row, y) in board" :key="y")
            div.contents(v-for="(slot, x) in row" :key="x")
              div.game-slot.bg-slate-800.rounded-md.border-2.border-dashed.border-slate-600.relative.overflow-hidden(
                @dragover.prevent
                @drop="handleDrop($event, x, y)"
                @click="handleSlotTap(x, y)"
                :class="{'border-purple-500 bg-slate-700': !slot.card}"
              )
                FairyCardDisplay(v-if="slot.card" :card="slot.card")

      // Player Hand
      PlayerHandCard.order-3(
        :cards="playerHand"
        :is-active="turn === 'player'"
        :selected-id="selectedCardId"
        @dragstart="handleDragStart"
        @select="handleTapSelect"
        class="hand-wrapper-player"
      )

    // Minimalist Floating Reset
    button.absolute.bottom-4.right-4.bg-slate-800.rounded-full(
      @click="resetGame"
      class="p-2 opacity-40 hover:opacity-100 transition-opacity z-50"
    )
      span.text-xl 🔄
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// Composables located in @/use/
import { useMatch } from '@/use/useMatch'
import { useNPC } from '@/use/useNPC'
import { useInteraction } from '@/use/useInteraction'
// Components
import PlayerHandCard from '@/components/PlayerHandCard'
import EnemyHandCard from '@/components/EnemyHandCard'
import FairyCardDisplay from '@/components/FairyCardDisplay'

const { turn, playerHand, npcHand, board, resetGame, placeCard } = useMatch()
const { selectedCardId, handleDragStart, handleDrop, handleTapSelect, handleSlotTap } = useInteraction(playerHand, placeCard)

// Initialize NPC AI
useNPC(turn, npcHand, board, placeCard)

onMounted(() => {
  resetGame()
})
</script>

<style lang="sass">
:root
  // Board fills width in portrait, height in landscape
  --board-card-size: min(12vh, 31vw)
  // Hand cards are slightly smaller to ensure they fit 5 in a row
  --hand-card-size: min(9vh, 18vw)

  @media (orientation: landscape)
    --board-card-size: min(25vh, 20vw)
    --hand-card-size: min(15vh, 12vw)

  @media (min-width: 1024px)
    --board-card-size: 140px
    --hand-card-size: 110px

.game-slot
  width: var(--board-card-size)
  height: var(--board-card-size)
  display: flex
  align-items: stretch
  justify-content: stretch

.hand-wrapper-player, .hand-wrapper-npc
  .fairy-card
    width: var(--hand-card-size)
    height: var(--hand-card-size)

.touch-none
  touch-action: none

.select-none
  user-select: none
  -webkit-tap-highlight-color: transparent
</style>