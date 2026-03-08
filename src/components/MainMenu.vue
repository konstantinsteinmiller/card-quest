<template lang="pug">
  div.h-screen.w-screen.bg-slate-200.flex.items-center.justify-center.p-4
    div.relative.p-10.flex.flex-col.gap-4.text-center.shadow-2xl(
      class="bg-black/30 min-w-[320px] max-w-lg"
    )
      div.flex.flex-col.gap-4.relative.z-10
        FButton(@click="emit('play')") {{ t('play') }}
        FButton(type="secondary" @click="showOptions = true") {{ t('options') }}
        //FButton(v-if="!isWeb" class="secondary" @click="quitGame") {{ t('quit') }}

    //FModal(v-model="showOptions" title="New Fairy!")
    //  div(class="flex flex-col items-center")
    //    //img(src="/path/to/fairy.png" class="w-40 h-40 object-contain mb-4")
    //    p(class="text-lg opacity-90") You've unlocked a rare model!
    //
    //  template(#footer)
    //    FButton(label="AWESOME!" @click="showOptions = false")
    OptionsModal(
      :is-open="showOptions"
      @close="showOptions = false"
    )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import OptionsModal from '@/components/organisms/OptionsModal'
import FButton from '@/components/atoms/FButton'
import FModal from '@/components/atoms/FModal.vue'
import {isWeb} from '@/utils/function'

const { t } = useI18n()
const emit = defineEmits(['play'])

const showOptions = ref(false)

const quitGame = () => {
  if (window.confirm(t('confirmQuit'))) window.close()
}
</script>

<style lang="sass" scoped>
.text-outline
  text-shadow: 3px 3px 0 #000
</style>

<i18n>
en:
  play: "Play"
  options: "Options"
  quit: "Abandon"
  confirmQuit: "Do you wish to leave the realm?"
de:
  play: "Spielen"
  options: "Optionen"
  quit: "Aufgeben"
  confirmQuit: "Möchtest du das Reich verlassen?"
</i18n>