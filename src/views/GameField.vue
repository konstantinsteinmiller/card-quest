<template lang="pug">
  div.h-screen.w-screen.bg-slate-900.text-white.overflow-hidden.flex.flex-col.items-center.justify-between.p-1.touch-none(
    class="inset-0 bg-[url('/images/board/papyrus-tile_128x128.webp')] bg-repeat select-none landscape:p-0.5 md:p-4"
  )
    MatchRulesModal(
      :is-open="showRules && nonStandardRules.length > 0"
      :rules="nonStandardRules"
      @close="showRules = false"
    )

    CardTradeModal(
      :is-open="showTradeModal"
      :scores="scores"
      :player-hand="originalPlayerHand"
      :npc-hand="originalNpcHand"
      @continue="handleTradeContinue"
    )

    GameOverModal(
      :is-open="isGameOver"
      :scores="scores"
      @reset="onContinue"
    )

    ScoreBoard(
      :board="board"
      :player-hand="playerHand"
      :npc-hand="npcHand"
    )

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
                :class="[\
                  (!slot.card && turn === 'player') ? 'cursor-pointer' : '',\
                  (errorSlot?.x === x && errorSlot?.y === y) ? 'shake-error' : ''\
                ]"
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
          @dragstart="(e, instanceId) => turn === 'player' && handleDragStart(e, instanceId)"
          @select="(instanceId) => turn === 'player' && handleTapSelect(instanceId)"
        )
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
import MatchRulesModal from '@/components/organisms/MatchRulesModal'
import CardTradeModal from '@/components/organisms/CardTradeModal'
import useUser from '@/use/useUser'
import useCampaign from '@/use/useCampaign'

const {
  turn,
  playerHand,
  npcHand,
  board,
  resetGame,
  placeCard,
  isBoardFull,
  activeRules,
  originalPlayerHand,
  originalNpcHand
} = useMatch()
const { userDifficulty, userSkipRulesModal } = useUser()
const {
  selectedCardId,
  errorSlot,
  handleDragStart,
  handleDrop,
  handleTapSelect,
  handleSlotTap
} = useInteraction(playerHand, placeCard)
const { activeNode } = useCampaign()

useNPC(turn, npcHand, board, placeCard, userDifficulty, activeRules)

const showRules = ref(true)
const nonStandardRules = computed(() => activeRules.value.filter(r => r !== 'standard'))

onMounted(() => {
  resetGame(activeNode)
})

const isGameOver = ref<boolean>(false)
const showTradeModal = ref<boolean>(false)

watch(isBoardFull, () => {
  if (isBoardFull.value) {
    setTimeout(() => {
      showTradeModal.value = true
    }, 550)
  } else {
    showRules.value = !userSkipRulesModal.value
    isGameOver.value = false
    showTradeModal.value = false
  }
}, { immediate: true })

// Triggered when the user clicks 'continue' on the Trade Modal
const handleTradeContinue = () => {
  showTradeModal.value = false
  isGameOver.value = true
}

const onContinue = () => {
  showRules.value = !userSkipRulesModal.value
  isGameOver.value = false
  showTradeModal.value = false
  resetGame(activeNode)
}

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
  transition: all 0.2s ease

.shake-error
  animation: shake-anim 0.4s cubic-bezier(.36, .07, .19, .97) both
  border: 2px solid rgba(239, 68, 68, 0.7)
  z-index: 50

@keyframes shake-anim
  10%, 90%
    transform: translate3d(-1px, 0, 0)
  20%, 80%
    transform: translate3d(2px, 0, 0)
  30%, 50%, 70%
    transform: translate3d(-4px, 0, 0)
  40%, 60%
    transform: translate3d(4px, 0, 0)

.game-card
  width: 100%
  height: 100%

.hand-container
  min-height: var(--hand-card-size)
  min-width: var(--hand-card-size)

.touch-none
  touch-action: none

.select-none
  user-select: none
  -webkit-tap-highlight-color: transparent

.text
  text-shadow: 3px 3px 0 #000
</style>