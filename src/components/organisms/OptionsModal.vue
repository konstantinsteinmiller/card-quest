<template lang="pug">
  FModal(
    :model-value="isOpen"
    :is-closable="false"
    :title="t('difficulty')"
    :tabs="[{ label: t('difficulty'), value: 'diff' }, { label: t('audio'), value: 'sound' }]"
    v-model:activeTab="currentTab"
    @update:model-value="emit('close')"
  )
    div(v-if="currentTab === 'diff'")
      div(class="flex flex-col gap-1")
        FButton(
          v-for="difficulty in [DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD]"
          :key="difficulty"
          :type="userDifficulty === difficulty ? 'primary' : 'secondary'"
          @click="setSettingValue('difficulty', difficulty)"
        ) {{ t(difficulty) }}

        hr(class="border-slate-600 my-1 md:my-2 pt-0")
    div(v-else) Audio Settings...
      hr(class="border-slate-600 my-1 md:my-2 pt-0")
    FButton(@click="emit('close')") {{ t('close') }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import useUser from '@/use/useUser'
import FModal from '@/components/molecules/FModal'
import FButton from '@/components/atoms/FButton'
import { DIFFICULTY } from '@/utils/enums'
import { ref } from 'vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
const { setSettingValue, userDifficulty } = useUser()

const currentTab = ref('diff')
</script>

<style lang="sass" scoped>
.diff-btn
  @apply py-3 px-6 rounded-lg uppercase font-bold transition-all hover:brightness-125
</style>

<i18n>
en:
  difficulty: "Difficulty"
  easy: "Novice"
  medium: "Squire"
  hard: "Master"
  close: "Save & Close"
de:
  difficulty: "Schwierigkeit"
  easy: "Anfänger"
  medium: "Knappe"
  hard: "Meister"
  close: "Speichern & Schließen"
</i18n>