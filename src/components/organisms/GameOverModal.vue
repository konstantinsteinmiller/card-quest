<template lang="pug">
  FModal(
    :model-value="isOpen"
    :is-closable="false"
    :title="t(result)"
  )
    //- Score Display
    div(class="flex items-center justify-center gap-6 my-6 sm:my-3")
      div(class="flex flex-col items-center")
        span(class="text-2xl") 👹
        span(class="text-3xl font-bold") {{ scores.npc }}

      div(class="text-2xl italic text-slate-500 font-black") VS

      div(class="flex flex-col items-center")
        span(class="text-2xl") 🧚
        span(class="text-3xl font-bold") {{ scores.player }}

    //- Action Buttons in Footer Slot
    template(#footer)
      div(class="flex flex-col gap-2 w-full max-w-[280px] text-sm md:text-xl sm:gap-1")
        FButton(@click="emit('reset')") {{ t('playAgain') }}
        FButton(
          type="secondary"
          @click="router.push({ name: 'main-menu' })"
        ) {{ t('backToMainMenu') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FModal from '@/components/molecules/FModal'
import FButton from '@/components/atoms/FButton'

const props = defineProps<{
  isOpen: boolean
  scores: { player: number; npc: number }
}>()

const emit = defineEmits<{
  (e: 'reset'): void
}>()

const router = useRouter()
const { t } = useI18n()

const result = computed((): 'win' | 'lose' | 'draw' => {
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