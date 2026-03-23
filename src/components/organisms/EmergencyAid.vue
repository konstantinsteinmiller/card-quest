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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FReward from '@/components/atoms/FReward'
import CardDisplay from '@/components/CardDisplay'
import useModels, { type Card, modelImgPath } from '@/use/useModels'
import { prependBaseUrl } from '@/utils/function'
import useUser, { isMobileLandscape, isMobilePortrait } from '@/use/useUser'
import useSound from '@/use/useSound'
import { isDebug } from '@/use/useMatch.ts'

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
    ? ['asha', 'starlight', 'water-shark-middle', 'energy-female-old', 'piranha-old', 'psi-nightmare', 'dragon-old', 'eclipse', 'snowman-old']
    : [...startCollectionIdsList].sort(() => 0.5 - Math.random())
  const selectedIds = shuffledStartCollectionIdsList.slice(0, props.amount || 2)

  rewardCards.value = selectedIds.map(id => {
    const card = allCards.find(c => c.id === id)
    return {
      ...card!,
      image: modelImgPath(id),
      owner: 'player'
    } as any
  })

  playSound('card-pack-open')

  setTimeout(() => {
    canContinue.value = true
    playSound('reward-continue')
  }, 1200)
})

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

<i18n lang="yaml">
en:
  suppliesArrived: "Emergency Cards!"
de:
  suppliesArrived: "Notfall Karten!"
</i18n>