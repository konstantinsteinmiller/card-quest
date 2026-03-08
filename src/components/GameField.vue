<template lang="pug">
  ////- Show a loading screen while isReady is false
  //div(v-if="!isReady" class="flex flex-col items-center justify-center h-screen bg-[#0f1a30]")
  //  h1(class="text text-white text-4xl mb-4") LOADING...
  //  div(class="w-64 h-4 bg-black/50 rounded-full overflow-hidden")
  //    div(class="h-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse w-1/2")

  //- The actual Game Field    //v-else
  div.h-screen.w-screen.bg-slate-900.text-white.overflow-hidden.flex.flex-col.items-center.justify-between.p-1.touch-none(
    class="select-none landscape:p-0.5 md:p-4"
  )
    GameOverModal(
      :is-open="isGameOver"
      :scores="scores"
      @reset="resetGame"
      @backToMainMenu="emit('backToMainMenu')"
    )

    ScoreBoard(
      :board="board"
      :player-hand="playerHand"
      :npc-hand="npcHand"
    )

    //- Main Game Layout
    div.flex.items-center.justify-center.w-full.h-full.gap-1(
      class="flex-col landscape:flex-row lg:flex-row lg:gap-8"
    )
      //- NPC Hand
      div.hand-container.flex-shrink-0.flex.items-center.justify-center.w-full(
        class="h-auto landscape:w-auto landscape:h-full"
      )
        EnemyHandCard(
          :cards="npcHand"
          :is-active="turn === 'npc'"
        )

      //- 3x3 Board
      div.flex.items-center.justify-center.bg-slate-700.p-1.rounded-lg.shadow-2xl(
        class="max-w-full max-h-full sm:p-2"
      )
        div.grid.grid-cols-3.gap-1(class="sm:gap-2")
          template(v-for="(row, y) in board" :key="y")
            div.contents(v-for="(slot, x) in row" :key="x")
              div.game-slot.bg-slate-800.rounded-md.border-2.border-dashed.relative.overflow-hidden(
                @dragover.prevent
                @drop="turn === 'player' && handleDrop($event, x, y)"
                @click="turn === 'player' && handleSlotTap(x, y)"
                :class="[(!slot.card && turn === 'player') ? 'border-purple-500 bg-slate-700 cursor-pointer' : 'border-slate-600']"
              )
                FairyCardDisplay(
                  v-if="slot.card"
                  :card="slot.card"
                  :show-tint="true"
                )

      //- Player Hand
      div.hand-container.flex-shrink-0.flex.items-center.justify-center.w-full.transition-all.duration-300(
        class="h-auto landscape:w-auto landscape:h-full"
        :class="turn === 'player' ? 'opacity-100' : 'opacity-40 grayscale-[50%]'"
      )
        PlayerHandCard(
          :cards="playerHand"
          :is-active="turn === 'player'"
          :selected-id="selectedCardId"
          @dragstart="(e, id) => turn === 'player' && handleDragStart(e, id)"
          @select="(id) => turn === 'player' && handleTapSelect(id)"
        )

    //- Manual Reset Button
    button.absolute.bottom-4.right-4.bg-slate-800.rounded-full(
      @click="resetGame"
      class="p-2 opacity-40 hover:opacity-100 transition-opacity z-50 md:p-4 md:bottom-8 md:right-8"
    )
      span.text-xl.md_text-3xl 🔄
</template>

<script setup lang="ts">
import { onMounted, computed, watch, ref } from 'vue'
import { useMatch } from '@/use/useMatch'
import { useNPC } from '@/use/useNPC'
import { useInteraction } from '@/use/useInteraction'
import PlayerHandCard from '@/components/PlayerHandCard'
import EnemyHandCard from '@/components/EnemyHandCard'
import FairyCardDisplay from '@/components/FairyCardDisplay'
import ScoreBoard from '@/components/ScoreBoard'
import GameOverModal from '@/components/GameOverModal'
import { preloadImages } from '@/utils/preloader.ts'

const emit = defineEmits(['backToMainMenu'])

const { turn, difficulty, playerHand, npcHand, board, resetGame, placeCard, isBoardFull } = useMatch()
const { selectedCardId, handleDragStart, handleDrop, handleTapSelect, handleSlotTap } = useInteraction(playerHand, placeCard)

useNPC(turn, npcHand, board, placeCard, difficulty)
// const isReady = ref(false)

onMounted(async () => {
  resetGame()
  // const fairyModelImagePaths = npcHand.value.concat(playerHand.value).map(card => card.image);
  //
  // try {
  //   await preloadImages(fairyModelImagePaths)
  //   console.log('preloaded image')
  //   isReady.value = true; // Only show the game once images are in browser cache
  // } catch (error) {
  //   console.error("Critical error loading assets:", error)
  // }
})

const isGameOver = ref<boolean>(false)
watch(isBoardFull, () => {
  isBoardFull.value
    ? setTimeout(() => {
        isGameOver.value = isBoardFull.value
      }, 550)
    : isGameOver.value = isBoardFull.value
})

const scores = computed(() => {
  let pS = playerHand.value.length
  let nS = npcHand.value.length
  board.value.forEach(row => row.forEach(slot => {
    if (slot.card) slot.card.owner === 'player' ? pS++ : nS++
  }))
  return { player: pS, npc: nS }
})
</script>

<style lang="sass">
:root
  --board-card-size: 31vw
  --hand-card-size: 18.5vw

  @media (orientation: landscape)
    --board-card-size: 24vh
    --hand-card-size: 15.5vh

  @media (min-width: 1024px)
    --board-card-size: 180px
    --hand-card-size: 140px

.game-slot
  width: var(--board-card-size)
  height: var(--board-card-size)
  display: flex
  align-items: stretch
  justify-content: stretch

.fairy-card
  width: 100%
  height: 100%

.hand-container
  min-height: var(--hand-card-size)
  min-width: var(--hand-card-size)

  .fairy-card
    width: var(--hand-card-size)
    height: var(--hand-card-size)

.touch-none
  touch-action: none

.select-none
  user-select: none
  -webkit-tap-highlight-color: transparent

.text
  text-shadow: 3px 3px 0 #000
</style>