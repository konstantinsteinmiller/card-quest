<template lang="pug">
  //- The actual Game Field
  div.h-screen.w-screen.bg-slate-900.text-white.overflow-hidden.flex.flex-col.items-center.justify-between.p-1.touch-none(
    class="inset-0 bg-[url('/images/board/papyrus-tile_128x128.webp')] bg-repeat select-none landscape:p-0.5 md:p-4"
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
      div.flex.items-center.justify-center.p-1(
        class="max-w-full max-h-full sm:p-2"
      )
        div.grid.grid-cols-3(class="sm:gap-[2px]")
          template(v-for="(row, y) in board" :key="y")
            div.contents(v-for="(slot, x) in row" :key="x")
              div.game-slot.relative.overflow-hidden(
                @dragover.prevent
                @drop="turn === 'player' && handleDrop($event, x, y)"
                @click="turn === 'player' && handleSlotTap(x, y)"
                :class="[(!slot.card && turn === 'player') ? 'cursor-pointer' : '']"
              )
                img.absolute.inset-0(v-if="(y + x) % 2 === 0" src="/images/board/field-outer_256x256.webp")
                img.absolute.inset-0(v-else src="/images/board/field-inner_256x256.webp")
                CardDisplay(
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
import CardDisplay from '@/components/CardDisplay'
import ScoreBoard from '@/components/ScoreBoard'
import GameOverModal from '@/components/organisms/GameOverModal'
import useUser from '@/use/useUser'

const emit = defineEmits(['backToMainMenu'])

const { turn, playerHand, npcHand, board, resetGame, placeCard, isBoardFull } = useMatch()
const { userDifficulty } = useUser()
const {
  selectedCardId,
  handleDragStart,
  handleDrop,
  handleTapSelect,
  handleSlotTap
} = useInteraction(playerHand, placeCard)

useNPC(turn, npcHand, board, placeCard, userDifficulty)

onMounted(async () => {
  resetGame()
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

.game-card
  width: 100%
  height: 100%

.hand-container
  min-height: var(--hand-card-size)
  min-width: var(--hand-card-size)

  .game-card
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