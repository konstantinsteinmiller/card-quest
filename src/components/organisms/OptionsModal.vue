<template lang="pug">
  FModal(
    :model-value="isOpen"
    :is-closable="false"
    :title="t('options')"
    :tabs="[{ label: t('general'), value: 'general', icon: '/images/icons/settings-icon_128x128.webp' },\
            { label: t('difficulty'), value: 'diff', icon: '/images/icons/difficulty-icon_128x128.webp' },\
            { label: t('audio'), value: 'sound', icon: '/images/icons/sound-icon_128x128.webp' }]"
    v-model:activeTab="currentTab"
    @update:model-value="emit('close')"
  )
    //- General Tab
    div(v-if="currentTab === 'general'")
      div(class="flex flex-col gap-4 p-2")
        div(class="flex items-center justify-between")
          span(class="text-sm font-medium text-slate-200") {{ t('showRulesModal') }}
          FSwitch(
            :model-value="!userSkipRulesModal"
            @update:model-value="setSettingValue('skipRulesModal', !$event)"
          )
        hr(class="border-slate-600 my-1 md:my-2 pt-0")

    //- Difficulty Tab
    div(v-else-if="currentTab === 'diff'")
      div(class="flex flex-col gap-1")
        FButton(
          v-for="difficulty in [DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD]"
          :key="difficulty"
          :type="userDifficulty === difficulty ? 'primary' : 'secondary'"
          @click="setSettingValue('difficulty', difficulty)"
        ) {{ t(difficulty) }}
        hr(class="border-slate-600 my-1 md:my-2 pt-0")

    //- Audio Tab
    div(v-else)
      div(class="p-4 text-center italic text-slate-400") {{ t('audioSettingsPlaceholder') }}
      hr(class="border-slate-600 my-1 md:my-2 pt-0")

    template(#footer)
      FButton.w-full(@click="emit('close')") {{ t('close') }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import useUser from '@/use/useUser'
import FModal from '@/components/molecules/FModal'
import FButton from '@/components/atoms/FButton'
import FSwitch from '@/components/atoms/FSwitch.vue'
import { DIFFICULTY } from '@/utils/enums'
import { ref } from 'vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
const { setSettingValue, userDifficulty, userSkipRulesModal } = useUser()

const currentTab = ref('general')
</script>

<style lang="sass" scoped>
.diff-btn
  @apply py-3 px-6 rounded-lg uppercase font-bold transition-all hover:brightness-125
</style>

<i18n lang="yaml">
en:
  options: "Options"
  general: "General"
  difficulty: "Difficulty"
  audio: "Audio"
  showRulesModal: "Show Match Rules before game"
  audioSettingsPlaceholder: "Audio Settings coming soon..."
  easy: "Novice"
  medium: "Squire"
  hard: "Master"
  close: "Save & Close"
de:
  options: "Optionen"
  general: "Allgemein"
  difficulty: "Schwierigkeit"
  audio: "Audio"
  showRulesModal: "Kampfregeln vor dem Spiel anzeigen"
  audioSettingsPlaceholder: "Audio-Einstellungen folgen in Kürze..."
  easy: "Anfänger"
  medium: "Knappe"
  hard: "Meister"
  close: "Speichern & Schließen"
</i18n>