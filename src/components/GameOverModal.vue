<template lang="pug">
  Modal(:is-open="isOpen")
    //- Result Header
    h2.font-black.uppercase.italic.tracking-tighter.mb-2.text-outline(
      class="text-2xl sm::text-3xl md:text-5xl"
      :class="[result === 'win' ? 'text-blue-400' : result === 'lose' ? 'text-red-400' : 'text-slate-300']"
    ) {{ t(result) }}

    //- Score Display
    div.flex.items-center.justify-center.gap-6.my-6(class="sm:my-3")
      div.flex.flex-col.items-center
        span.text-2xl 👹
        span.text-3xl.font-bold {{ scores.npc }}
      div.text-2xl.font-italic.text-slate-500 VS
      div.flex.flex-col.items-center
        span.text-2xl 🧚
        span.text-3xl.font-bold {{ scores.player }}

    //- Action Buttons
    div.flex.flex-col.gap-2(class="text-sm md:text-xl sm:gap-1")
      FButton(@click="emit('reset')") {{ t('playAgain') }}
      FButton(type="secondary" @click="emit('reset'); emit('backToMainMenu')") {{ t('backToMainMenu') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '@/components/molecules/Modal'
import FButton from '@/components/atoms/FButton.vue'

const { t } = useI18n()

const props = defineProps<{
  isOpen: boolean
  scores: { player: number; npc: number }
}>()

const emit = defineEmits(['reset', 'backToMainMenu'])

const result = computed(() => {
  if (props.scores.player > props.scores.npc) return 'win'
  if (props.scores.npc > props.scores.player) return 'lose'
  return 'draw'
})
</script>

<i18n>
en:
  win: "Victory"
  lose: "Defeat"
  draw: "Draw"
  playAgain: "Play Again"
  backToMainMenu: "Back to Main Menu"
de:
  win: "Sieg"
  lose: "Niederlage"
  draw: "Unentschieden"
  playAgain: "Nochmal spielen"
  backToMainMenu: "Zurück zum Hauptmenü"
</i18n>