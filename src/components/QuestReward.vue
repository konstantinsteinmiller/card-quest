<template lang="pug">
  FReward(
    :modelValue="modelValue"
    :showContinue="canContinue"
    @continue="handleClose"
  )
    template(#ribbon)
      h2.text-2xl.font-black.text-white.uppercase.italic.brawl-text(
        class="md:text-4xl"
      ) {{ t('congratulations') }}
      span.text-4xl.mb-2(class="md:text-6xl") 🏆
    div.flex.flex-col.items-center.justify-center.max-w-2xl.text-center.p-8.text-shadow(
      class="gap-6 mx-4"
    )

      p.text-white.font-bold.leading-relaxed(
        class="text-lg md:text-2xl"
      ) {{ message }}

      //- Visual timer indicator
      div.w-full.h-1.rounded-full.overflow-hidden(v-if="!canContinue" class="bg-white/10")
        div.h-full.bg-yellow-500.transition-all.duration-100(
          :style="{ width: `${progress}%` }"
        )
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FReward from '@/components/atoms/FReward'
import useSound from '@/use/useSound'

const props = defineProps<{
  modelValue: boolean
  type: 'campaign' | 'cards'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
const { playSound } = useSound()
const canContinue = ref(false)
const progress = ref(0)

const message = computed(() => {
  return props.type === 'campaign' ? t('campaignFinished') : t('cardsFinished')
})

const startTimer = () => {
  canContinue.value = false
  progress.value = 0

  const duration = 5000
  const interval = 50
  const step = (interval / duration) * 100

  const timer = setInterval(() => {
    progress.value += step
    if (progress.value >= 100) {
      clearInterval(timer)
      canContinue.value = true
    }
  }, interval)
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) startTimer()
})

onMounted(() => {
  if (props.modelValue) startTimer()
  playSound('win', 0.1)
})

const handleClose = () => {
  emit('close')
}
</script>

<style scoped lang="sass">
.brawl-text
  text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
</style>

<i18n lang="yaml">
en:
  congratulations: "Congratulations!"
  campaignFinished: "You have finished the campaign! Congratulation! You are a worthy card tactician! But have you collected every card yet? Only the best trading card collectors achieve this ultimate goal!"
  cardsFinished: "Congratulation! You have collected every card. You are the greatest card collector of all time!"
de:
  congratulations: "Glückwunsch!"
  campaignFinished: "Du hast die Kampagne beendet! Glückwunsch! Du bist ein würdiger Kartentaktiker! Aber hast du schon jede Karte gesammelt? Nur die besten Trading-Card-Sammler erreichen dieses ultimative Ziel!"
  cardsFinished: "Glückwunsch! Du hast jede Karte gesammelt. Du bist der größte Karten Sammler aller Zeiten!"
</i18n>