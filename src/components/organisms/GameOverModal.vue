<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FModal from '@/components/molecules/FModal'
import FButton from '@/components/atoms/FButton'
import { activeNode, useCampaign } from '@/use/useCampaign'
import { isPracticeMatch } from '@/use/useMatch.ts'

const props = defineProps<{
  isOpen: boolean
  scores: { player: number; npc: number }
}>()

const emit = defineEmits<{
  (e: 'reset'): void
}>()

const router = useRouter()
const { t } = useI18n()
const { completeNode } = useCampaign()

const result = computed((): 'win' | 'lose' | 'draw' => {
  if (props.scores.player > props.scores.npc) return 'win'
  if (props.scores.npc > props.scores.player) return 'lose'
  return 'draw'
})

const onContinue = () => {
  if (isPracticeMatch.value || !activeNode?.value) {
    emit('reset')
    return
  }
  if (result.value === 'win') {
    completeNode(activeNode?.value?.id || '')
  }
  emit('reset')
  router.push({ name: 'campaign' })
}

onMounted(() => {

})
</script>

<template lang="pug">
  FModal(
    :model-value="isOpen"
    :is-closable="false"
    :title="t(result)"
  )
    //- Score Display
    div(class="flex items-center justify-center gap-6 my-6 sm:my-3")
      div.flex.flex-col.items-center(class="")
        span.text-red-500.text-2xl.font-bold(class="") {{ scores.npc }}

      div(class="text-2xl italic text-slate-500 font-black") VS

      div.flex.flex-col.items-center(class="")
        span.text-blue-500.text-2xl.font-bold(class="") {{ scores.player }}

    //- Action Buttons in Footer Slot
    template(#footer)
      div(class="flex flex-col gap-2 w-full max-w-[280px] text-sm md:text-xl sm:gap-1")
        FButton(@click="onContinue") {{ t('continue') }}
        FButton(
          type="secondary"
          @click="router.push({ name: 'main-menu' })"
        ) {{ t('backToMainMenu') }}
</template>

<i18n>
en:
  win: "Victory"
  lose: "Defeat"
  draw: "Draw"
  continue: "Continue"
  playAgain: "Play Again"
  backToMainMenu: "Back to Main Menu"
de:
  win: "Sieg"
  lose: "Niederlage"
  draw: "Unentschieden"
  continue: "Weiter"
  playAgain: "Nochmal spielen"
  backToMainMenu: "Zurück zum Hauptmenü"
</i18n>