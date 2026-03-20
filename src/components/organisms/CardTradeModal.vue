<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FReward from '@/components/atoms/FReward.vue'
import TradeHand from '@/components/molecules/TradeHand.vue'
import CardDisplay from '@/components/CardDisplay'
import useUser from '@/use/useUser'

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
const { userHand, setSettingValue } = useUser()

const tradeComplete = ref(false)
const animatingCard = ref<any>(null)
const flyDirectionClass = ref('')
const selectedCardId = ref<string | null>(null)

const isWin = computed(() => props.scores.player > props.scores.npc)
const isLose = computed(() => props.scores.npc > props.scores.player)
const isDraw = computed(() => props.scores.player === props.scores.npc)

const resultText = computed(() => {
  if (isWin.value) return 'win'
  if (isLose.value) return 'lose'
  return 'draw'
})

// Watch for modal opening to trigger NPC logic or auto-complete on draw
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    tradeComplete.value = false
    animatingCard.value = null
    selectedCardId.value = null

    if (isDraw.value) {
      tradeComplete.value = true
    } else if (isLose.value) {
      // NPC takes a moment to "think" before picking a player card
      setTimeout(() => executeNpcPick(), 2000)
    }
  }
})

const parseUserHand = (): any[] => {
  try {
    return JSON.parse(userHand.value === '[]' || !userHand.value ? '[]' : userHand.value)
  } catch (e) {
    return []
  }
}

const executeNpcPick = () => {
  if (!props.playerHand || props.playerHand.length === 0) {
    tradeComplete.value = true
    return
  }

  // Best card logic: highest total value points
  let bestCard = props.playerHand[0]
  let maxPoints = -1

  props.playerHand.forEach(card => {
    const points = card.values.reduce((a: number, b: number) => a + b, 0)
    if (points > maxPoints) {
      maxPoints = points
      bestCard = card
    }
  })

  // Select card visually before moving
  selectedCardId.value = bestCard.instanceId || bestCard.id

  setTimeout(() => {
    animateCardTransfer(bestCard, 'up')

    // Update global state: remove from player hand
    const parsedHand = parseUserHand()
    const index = parsedHand.findIndex((c: any) => c.id === (bestCard.instanceId || bestCard.id))
    if (index !== -1) {
      parsedHand.splice(index, 1)
      setSettingValue('hand', parsedHand)
    }
  }, 800)
}

const handleEnemyCardSelect = (id: string) => {
  if (!isWin.value || tradeComplete.value || animatingCard.value) return
  const card = props.npcHand.find(c => (c.instanceId || c.id) === id)
  if (card) {
    selectedCardId.value = id
    // Small delay to show selection ring before flying
    setTimeout(() => processPlayerPick(card), 300)
  }
}

const processPlayerPick = (card: any) => {
  animateCardTransfer(card, 'down')
  // Update global state: add to player hand
  const parsedHand = parseUserHand()
  parsedHand.push(card)
  setSettingValue('hand', parsedHand)
}

const animateCardTransfer = (card: any, direction: 'up' | 'down') => {
  animatingCard.value = card
  flyDirectionClass.value = direction === 'up' ? 'animate-fly-up' : 'animate-fly-down'

  setTimeout(() => {
    animatingCard.value = null
    tradeComplete.value = true
  }, 1000)
}
</script>

<template lang="pug">
  FReward(
    :model-value="isOpen"
    :show-continue="tradeComplete"
    @continue="emit('continue')"
  )
    //- Ribbon Score Header (FModal style)
    div.relative.mb-10.scale-90(class="sm:scale-100")
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
    div.flex.flex-col.items-center.justify-center.w-full.flex-1.gap-4.relative(class="max-h-[80vh] md:gap-10")

      //- NPC Hand
      div.flex.flex-col.items-center.w-full
        span.text-red-400.font-bold.uppercase.tracking-wider.mb-2.text-xs.brawl-text(class="md:text-base") {{ t('enemyCards') }}
        TradeHand(
          :cards="npcHand"
          :is-active="isWin && !tradeComplete"
          :selected-id="selectedCardId"
          :class="{'opacity-50 grayscale': !isWin || tradeComplete}"
          @select="handleEnemyCardSelect"
        )

      //- Rule Indicator
      div.relative.z-10
        div.absolute.inset-0.rounded-full(class="bg-slate-900 translate-y-0.5")
      div.relative.py-1.px-8.rounded-full.border-2.border-slate-700(class="bg-black/60")
        span.text-white.font-bold.uppercase.tracking-widest.text-xs.brawl-text(class="md:text-sm") {{ t('ruleOne') }}

      //- Player Hand
      div.flex.flex-col.items-center.w-full
        TradeHand(
          :cards="playerHand"
          :is-active="false"
          :class="{'opacity-50 grayscale': tradeComplete}"
        )
        span.text-blue-400.font-bold.uppercase.tracking-wider.mt-2.text-xs.brawl-text(class="md:text-base") {{ t('yourCards') }}

    //- Flying Card Overlay (aspect ratio fixed)
    Transition(name="fly")
      div.fixed.z-50.pointer-events-none(
        v-if="animatingCard"
        class="aspect-1/1 w-[100px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        :class="flyDirectionClass"
      )
        CardDisplay(:card="animatingCard")
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

.aspect-1\/1
  aspect-ratio: 1/1
</style>

<i18n lang="yaml">
en:
  win: "Victory"
  lose: "Defeat"
  draw: "Draw"
  enemyCards: "Enemy Cards"
  yourCards: "Your Cards"
  ruleOne: "Trade Rule: One"
de:
  win: "Sieg"
  lose: "Niederlage"
  draw: "Unentschieden"
  enemyCards: "Gegnerische Karten"
  yourCards: "Deine Karten"
  ruleOne: "Tauschregel: Eine"
</i18n>