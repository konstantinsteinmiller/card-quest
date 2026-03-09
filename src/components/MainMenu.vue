<template lang="pug">
  div.h-screen.w-screen.bg-slate-200.flex.items-center.justify-center.p-4(class="bg-[url('/images/bg/bg_1024x1024.webp')] bg-cover bg-center")
    img.absolute(class="left-1/2 top-12 -translate-x-1/2 w-32 h-32 sm:top-4 sm:w-[8rem] sm:h-[8rem] md:w-[10rem] md:h-[10rem] landscape:left-2 landscape:top-2 landscape:-translate-x-0 landscape:md:left-1/2 landscape:md:top-12 landscape:md:-translate-x-1/2" src="/images/logo/logo_256x256.webp" alt="logo")

    // Menu box
    div.relative.p-10.flex.flex-col.gap-4.text-center.shadow-2xl(
      class="bg-black/30 min-w-[320px] max-w-lg"
    )
      // Menu
      div.flex.flex-col.gap-4.relative.z-10
        FButton(@click="emit('play')") {{ t('play') }}
        FButton(type="secondary" @click="showOptions = true") {{ t('settings') }}
        //FButton(v-if="!isWeb" class="secondary" @click="quitGame") {{ t('quit') }}

    //FModal(v-model="showOptions" title="New Fairy!")
    //  div(class="flex flex-col items-center")
    //
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
import { isWeb } from '@/utils/function'

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
  settings: "Settings"
  quit: "Abandon"
  confirmQuit: "Do you wish to leave the realm?"
de:
  play: "Spielen"
  settings: "Einstellungen"
  quit: "Aufgeben"
  confirmQuit: "Möchtest du das Reich verlassen?"
</i18n>