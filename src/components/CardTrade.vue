<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FReward from '@/components/atoms/FReward'
import TradeHand from '@/components/molecules/TradeHand'
import CardDisplay from '@/components/CardDisplay'
import useUser, { orientation } from '@/use/useUser'
import type { GameCard } from '@/types/game'
import { mobileCheck } from '@/utils/function'
import useModels, { type Card } from '@/use/useModels'
import { activeRules, originalNpcHand, originalPlayerHand, playerSelection, useMatch } from '@/use/useMatch'
import { TRADE_RULES_LIST } from '@/use/useBattleRules'
import useSound from '@/use/useSound'
import { useTrade, type TradeRule } from '@/use/useTrade'

interface Props {
  isOpen: boolean
  scores: { player: number; npc: number }
  playerHand: any[]
  npcHand: any[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'continue'): void
}>()

const { t } = useI18n()
const { setSettingValue } = useUser()
const { addCardToCollection, removeCardFromCollection } = useModels()
const { playSound } = useSound()
const { board } = useMatch()
const { getTradeResult } = useTrade()

const isMobileLandscape = computed(() => mobileCheck() && window.innerWidth > 500 && orientation.value === 'landscape')

const playerDeck = ref<GameCard[]>([...props.playerHand])
const npcDeck = ref<GameCard[]>([...props.npcHand])

watch(() => props.playerHand, (newVal) => {
  playerDeck.value = [...props.playerHand]
  npcDeck.value = [...props.npcHand]
})

const tradeRule = computed<TradeRule>(() => {
  return (activeRules.value.find(rule => TRADE_RULES_LIST.includes(rule)) as TradeRule) ?? 'one'
})

const tradeComplete = ref<boolean>(false)
const animatingCards = ref<{ card: any, direction: 'up' | 'down' }[]>([])
const selectedCardId = ref<string | null>(null)

const isWin = computed(() => props.scores.player > props.scores.npc)
const isLose = computed(() => props.scores.npc > props.scores.player)
const isDraw = computed(() => props.scores.player === props.scores.npc)

const resultText = computed(() => {
  if (isWin.value) return 'win'
  if (isLose.value) return 'lose'
  return 'draw'
})

// Watch for modal opening to trigger logic or auto-complete
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    tradeComplete.value = false
    animatingCards.value = []
    selectedCardId.value = null

    if (isDraw.value) {
      executeTrade()
    } else if (isLose.value) {
      if (tradeRule.value === 'one') {
        // NPC takes a moment to "think" before picking a player card
        setTimeout(() => executeNpcOnePick(), 1000)
      } else {
        // Auto-execute strategies that don't need a specific pick
        setTimeout(() => executeTrade(), 1000)
      }
    } else if (isWin.value) {
      if (tradeRule.value !== 'one') {
        // Auto-execute player win if the rule doesn't require clicking a card
        setTimeout(() => executeTrade(), 1000)
      }
    }
  }
})

const executeNpcOnePick = () => {
  if (!playerDeck.value || playerDeck.value.length === 0) {
    executeTrade()
    return
  }

  // Best card logic: highest total value points
  let bestCard = playerDeck.value[0]
  let maxPoints = -1

  playerDeck.value.forEach(card => {
    const points = card.values['left'] + card.values['right'] + card.values['top'] + card.values['bottom']
    if (points > maxPoints) {
      maxPoints = points
      bestCard = card
    }
  })

  // Select card visually before moving
  selectedCardId.value = bestCard.instanceId

  setTimeout(() => {
    executeTrade(bestCard)
  }, 800)
}

const handleEnemyCardSelect = (id: string) => {
  if (!isWin.value || tradeComplete.value || animatingCards.value.length > 0 || tradeRule.value !== 'one') return
  const card = npcDeck.value.find(c => (c.instanceId) === id)
  if (card) {
    selectedCardId.value = id
    // Small delay to show selection ring before flying
    setTimeout(() => executeTrade(card), 300)
  }
}

const executeTrade = (selectedCard?: any) => {
  const winner = isWin.value ? 'player' : isLose.value ? 'npc' : 'draw'

  const { playerGains, npcGains } = getTradeResult(tradeRule.value, {
    winner,
    board: board.value,
    playerHand: playerDeck.value,
    npcHand: npcDeck.value,
    selectedCard
  })

  const movingCards: { card: any, direction: 'up' | 'down' }[] = []
  let newPlayerDeck = JSON.parse(JSON.stringify(playerDeck.value))
  let newNpcDeck = JSON.parse(JSON.stringify(npcDeck.value))

  // Process Player Gains
  playerGains.forEach(card => {
    newNpcDeck = newNpcDeck.filter((c: any) => c.instanceId !== card.instanceId)
    const newCard = { ...card, owner: 'player' }
    newPlayerDeck.push(newCard)
    addCardToCollection(JSON.parse(JSON.stringify(newCard)))
    movingCards.push({ card, direction: 'down' })
  })

  // Process NPC Gains
  npcGains.forEach(card => {
    newPlayerDeck = newPlayerDeck.filter((c: any) => c.instanceId !== card.instanceId)
    playerSelection.value = playerSelection.value.filter((c: any) => c.instanceId !== card.instanceId)
    const newCard = { ...card, owner: 'npc' }
    newNpcDeck.push(newCard)
    movingCards.push({ card, direction: 'up' })
  })

  playerDeck.value = newPlayerDeck
  npcDeck.value = newNpcDeck

  /* check if all original cards are in the players deck and no npc cards where pushed in */
  const originalPlayerCardIds: string[] = (originalPlayerHand.value.map(c => c.instanceId) as string[])
  let onlyOriginalPlayerCardsDeck: GameCard[] = []
  originalPlayerCardIds.forEach((iId: string) => {
    onlyOriginalPlayerCardsDeck = playerDeck.value.filter((c: any) => c.instanceId === iId && c.owner === 'player')
  })

  if (npcGains.length > 0) {
    setSettingValue('hand', JSON.parse(JSON.stringify(onlyOriginalPlayerCardsDeck)))
  }

  // Handle Animations
  animatingCards.value = movingCards

  if (movingCards.length > 0) {
    setTimeout(() => {
      animatingCards.value = []
      tradeComplete.value = true
      playSound('reward-continue')
    }, 1000)
  } else {
    // No cards traded (e.g., Draw or empty hands)
    tradeComplete.value = true
    setTimeout(() => {
      playSound('reward-continue')
    }, 500)
  }
}
</script>

<template lang="pug">
  FReward(
    :model-value="isOpen"
    :show-continue="tradeComplete"
    @continue="emit('continue')"
  )
    //- Ribbon Score Header (FModal style)
    div.relative.mb-10.scale-90(class="sm:scale-100" :class="{ '!mb-2 -mt-2': isMobileLandscape }")
      div.absolute.inset-0.translate-y-1.rounded-lg(class="bg-[#1a2b4b]")
      div.relative.flex.items-center.justify-center.bg-gradient-to-b.border-4.px-10.py-2.rounded-xl(
        class="from-[#ffcd00] to-[#f7a000] border-[#0f1a30] min-w-[280px]"
      )
        div.flex.items-center.gap-6
          span.text-4xl.font-black.text-red-600.brawl-text {{ scores.npc }}
          div.flex.flex-col.items-center
            span.text-xs.italic.text-white.font-black.brawl-text VS
            span.text-sm.font-bold.text-blue-900.uppercase.tracking-tighter {{ t(resultText) }}
          span.text-4xl.font-black.text-blue-600.brawl-text {{ scores.player }}

    //- Trade Area
    div.flex.flex-col.items-center.justify-center.w-full.flex-1.gap-4.relative(
      class="max-h-[80vh] md:gap-10"
      :class="{ '!flex-row': isMobileLandscape }"
    )
      //- NPC Hand
      div.flex.flex-col.items-center.w-full
        span.text-red-400.font-bold.uppercase.tracking-wider.mb-2.text-xs.brawl-text(class="md:text-base") {{ t('enemyCards') }}
        TradeHand(
          :cards="npcDeck"
          :is-active="isWin && !tradeComplete && tradeRule === 'one'"
          :selected-id="selectedCardId"
          :class="{'opacity-50 grayscale': (!isWin && tradeRule === 'one') || tradeComplete}"
          @select="handleEnemyCardSelect"
        )

      //- Rule Indicator
      div.relative.z-10
        div.absolute.inset-0.rounded-full(class="bg-slate-900 translate-y-0.5")
      div.relative.py-1.px-8.rounded-full.border-2.border-slate-700(class="bg-black/60")
        span.text-white.font-bold.uppercase.tracking-widest.text-xs.brawl-text(class="md:text-sm") {{ t('tradeRule', { rule: t('rule.' + tradeRule) }) }}

      //- Player Hand
      div.flex.flex-col.items-center.w-full
        TradeHand(
          :cards="playerDeck"
          :is-active="false"
          :class="{'opacity-50 grayscale': tradeComplete}"
        )
        span.text-blue-400.font-bold.uppercase.tracking-wider.mt-2.text-xs.brawl-text(
          class="md:text-base"
          :class="{ '-order-1 mt-0 mb-2': isMobileLandscape }"
        ) {{ t('yourCards') }}

    //- Flying Cards Overlay
    TransitionGroup(name="fly")
      div.fixed.z-50.pointer-events-none(
        v-for="item in animatingCards"
        :key="item.card.instanceId"
        class="aspect-square w-[100px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        :class="item.direction === 'up' ? 'animate-fly-up' : 'animate-fly-down'"
      )
        CardDisplay(:card="item.card")
</template>

<style scoped lang="sass">
.brawl-text
  text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000

@keyframes flyUp
  0%
    transform: translate(-50%, -50%) scale(1)
    top: 70%
    opacity: 1
  100%
    transform: translate(-50%, -50%) scale(0.5)
    top: 20%
    opacity: 0

@keyframes flyDown
  0%
    transform: translate(-50%, -50%) scale(1)
    top: 30%
    opacity: 1
  100%
    transform: translate(-50%, -50%) scale(0.5)
    top: 70%
    opacity: 0

.animate-fly-up
  animation: flyUp 1s ease-in-out forwards

.animate-fly-down
  animation: flyDown 1s ease-in-out forwards
</style>

<i18n lang="yaml">
en:
  win: "Victory"
  lose: "Defeat"
  draw: "Draw"
  enemyCards: "Enemy Cards"
  yourCards: "Your Cards"
  tradeRule: "Trade Rule: {rule}"
de:
  win: "Sieg"
  lose: "Niederlage"
  draw: "Unentschieden"
  enemyCards: "Gegnerische Karten"
  yourCards: "Deine Karten"
  tradeRule: "Tauschregel: {rule}"
</i18n>