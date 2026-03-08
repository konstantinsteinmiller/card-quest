<template lang="pug">
  Modal(:is-open="isOpen")
    h2.text-2xl.font-black.uppercase.italic.mb-3.text-outline.text-blue-300(class="md:mb-6") {{ t('difficulty') }}

    div.flex.flex-col.gap-1
      FButton(
        v-for="difficulty in [DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD]"
        :key="difficulty"
        :type="userDifficulty === difficulty ? 'primary' : 'secondary'"
        @click="setSettingValue('difficulty', difficulty)"
      ) {{ t(difficulty) }}

      hr.border-slate-600.my-1(class="md:my-2 pt-0")

      FButton(@click="emit('close')") {{ t('close') }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import useMatch from '@/use/useMatch'
import useUser from '@/use/useUser'
import Modal from '@/components/molecules/Modal'
import FButton from '@/components/atoms/FButton'
import { DIFFICULTY } from '@/utils/enums.ts'

defineProps<{
  isOpen: boolean
}>()
const emit = defineEmits(['close'])

const { t } = useI18n()
const { setSettingValue, userDifficulty } = useUser()
</script>

<style lang="sass" scoped>
.diff-btn
  @apply py-3 px-6 rounded-lg uppercase font-bold transition-all hover:brightness-125
</style>

<i18n>
en:
  difficulty: "AI Difficulty"
  easy: "Novice"
  medium: "Squire"
  hard: "Master"
  close: "Save & Close"
de:
  difficulty: "KI Schwierigkeit"
  easy: "Anfänger"
  medium: "Knappe"
  hard: "Meister"
  close: "Speichern & Schließen"
</i18n>