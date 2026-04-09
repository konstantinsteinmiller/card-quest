<template lang="pug">
  FReward(
    :model-value="isVisible"
    :show-continue="canContinue"
    @continue="handleComplete"
  )
    div.flex.flex-col.items-center.justify-center.gap-8
      h2.text-2xl.font-black.italic.text-white.text-shadow-strong.tracking-tighter(
        class="sm:text-4xl animate-bounce"
      ) {{ t('suppliesArrived') }}

      div.flex.justify-center.gap-4(class="sm:gap-8" :class="{ '!flex-col': isMobilePortrait }")
        div.reward-card-wrapper(
          v-for="(card, index) in rewardCards"
          :key="index"
          :style="{ animationDelay: `${index * 0.3}s` }"
        )
          div.w-32.h-32(class="sm:w-48 sm:h-48" :class="{ '!w-24 !h-24': isMobileLandscape }")
            CardDisplay(:card="card" :show-tint="false")

      //- Rewarded video ad button — only visible on the live CrazyGames
      //- release where canShowVideoAds() is true. Tapping it asks the SDK
      //- to play a rewarded video; on a clean playthrough we add a few
      //- bonus cards on top of the emergency aid.
      div(v-if="canShowAd && !adClaimed" class="flex flex-col items-center gap-2")
        FButton(
          type="primary"
          size="md"
          :is-disabled="adInFlight"
          @click="onWatchAd"
        )
          span.whitespace-nowrap 🎬 {{ t('watchAdBonus') }}
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FReward from '@/components/atoms/FReward'
import FButton from '@/components/atoms/FButton'
import CardDisplay from '@/components/CardDisplay'
import useModels, { type Card, modelImgPath } from '@/use/useModels'
import { prependBaseUrl } from '@/utils/function'
import useUser, { isMobileLandscape, isMobilePortrait } from '@/use/useUser'
import useSound from '@/use/useSound'
import { isDebug } from '@/use/useMatch.ts'
import { canShowVideoAds, showRewardedAd, isSdkActive } from '@/use/useCrazyGames'

const props = defineProps<{
  isVisible: boolean,
  amount?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
const { playSound } = useSound()
const { allCards, addCardToCollection, startCollectionIdsList } = useModels()

const rewardCards = ref<Card[]>([])
const canContinue = ref(false)

onMounted(() => {
  // Pick 2 random IDs from the starter list
  const shuffledStartCollectionIdsList = isDebug.value/* || true*/
    ? ['asha-old', 'starlight-old', 'shark-middle', 'female-old', 'piranha-old', 'nightmare-middle', 'dragon-old', 'eclipse-old', 'snowman-old']
    : [...startCollectionIdsList].sort(() => 0.5 - Math.random())
  const selectedIds = shuffledStartCollectionIdsList.slice(0, props.amount || 2)

  rewardCards.value = selectedIds.map(id => {
    const card = allCards.find(c => c.id === id)
    return {
      ...card!,
      image: modelImgPath(id, card?.element),
      owner: 'player'
    } as any
  })

  playSound('card-pack-open')

  setTimeout(() => {
    canContinue.value = true
    playSound('reward-continue')
  }, 1200)
})

// Rewarded ad bonus state.
//
// `canShowAd` is intentionally a computed (rather than a one-shot bool) so
// the button disappears immediately if `isSdkActive` flips off mid-session.
// We gate on `canShowVideoAds()` so dev / demo builds never trigger the
// SDK ad endpoint even if the SDK happens to be loaded.
const adInFlight = ref(false)
const adClaimed = ref(false)
const canShowAd = computed(() => isSdkActive.value && canShowVideoAds())

const onWatchAd = async () => {
  if (adInFlight.value || adClaimed.value) return
  adInFlight.value = true
  try {
    const success = await showRewardedAd()
    if (success) {
      // Reward: add 2 extra starter cards on top of the emergency aid.
      // We pull from the same starter pool the rest of this component
      // uses, but skip any cards we just gave out so the bonus actually
      // feels distinct.
      const alreadyShownIds = new Set(rewardCards.value.map(c => c.id))
      const pool = [...startCollectionIdsList]
        .filter(id => !alreadyShownIds.has(id))
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)

      const bonusCards: Card[] = pool.map(id => {
        const card = allCards.find(c => c.id === id)
        return {
          ...card!,
          image: modelImgPath(id, card?.element),
          owner: 'player'
        } as any
      })
      bonusCards.forEach(card => addCardToCollection(card))
      adClaimed.value = true
      playSound('reward-continue')
    }
  } finally {
    adInFlight.value = false
  }
}

const handleComplete = () => {
  rewardCards.value.forEach(card => addCardToCollection(card))
  emit('close')
}
</script>

<style scoped lang="sass">
.text-shadow-strong
  text-shadow: 4px 4px 0 #000, -2px -2px 0 #000

.reward-card-wrapper
  opacity: 0
  animation: card-drop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards

@keyframes card-drop
  0%
    opacity: 0
    transform: translateY(-150px) rotate(-15deg) scale(0.3)
  100%
    opacity: 1
    transform: translateY(0) rotate(0) scale(1)
</style>

<i18n>
en:
  suppliesArrived: "Emergency Cards!"
  watchAdBonus: "Watch ad for bonus cards"
de:
  suppliesArrived: "Notfall Karten!"
  watchAdBonus: "Werbung ansehen für Bonuskarten"
fr:
  suppliesArrived: "Cartes d'urgence !"
  watchAdBonus: "Regarder une pub pour des cartes bonus"
es:
  suppliesArrived: "¡Cartas de emergencia!"
  watchAdBonus: "Ver anuncio para cartas extra"
jp:
  suppliesArrived: "緊急カード！"
  watchAdBonus: "広告を見てボーナスカード"
kr:
  suppliesArrived: "긴급 카드 보급!"
  watchAdBonus: "광고 보고 보너스 카드 받기"
zh:
  suppliesArrived: "紧急卡牌！"
  watchAdBonus: "观看广告获得奖励卡牌"
ru:
  suppliesArrived: "Экстренные карты!"
  watchAdBonus: "Посмотреть рекламу за бонусные карты"
</i18n>