<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import FModal from '@/components/atoms/FModal'
import FButton from '@/components/atoms/FButton'
import { playerSelection, ruleModal } from '@/use/useMatch'

const { t } = useI18n()
// if (window.location.hash !== '/') {
//   window.location.pathname = '/'
//   window.location.reload()
// }
onMounted(() => {
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) {
      event.preventDefault() // Block multi-touch (pinch)
    }
  }, { passive: false })

  document.addEventListener('gesturestart', (event) => {
    event.preventDefault() // Block specific Safari zoom gestures
  })
})
</script>

<template lang="pug">
  div.h-screen.w-screen.app-container
    RouterView

    FModal.fixed(v-model="ruleModal" :title="t('rule.' + ruleModal)" class="z-[200]")
      div.text-shadow.cursor-pointer.mt-2(class="text-[14px]")
        div.mb-4.text-left(class="text-[13px]") {{ t('rule-desc.' + ruleModal) }}
        div.icon.flex.justify-center.mb-2
          div.icon.flex.justify-center(class="landscape:w-24 landscape:h-24 landscape:sm:w-24 landscape:sm:h-24")
            img.w-full.h-full(v-if="ruleModal === 'standard'" class="bg-white rounded-sm border-3 border-black"
              src="/images/icons/rules/standard-rule_128x128.webp")
            img.w-full.h-full(v-else-if="ruleModal === 'plus'" class="bg-white rounded-sm border-3 border-amber-500"
              src="/images/icons/rules/plus-rule_128x128.webp")
            img.w-full.h-full(v-else-if="ruleModal === 'same'" class="bg-white rounded-sm border-3 border-rose-500"
              src="/images/icons/rules/same-rule_128x128.webp")
            img.w-full.h-full(v-else-if="ruleModal === 'combo'" class="bg-white rounded-sm border-3 border-blue-500"
              src="/images/icons/rules/combo-rule_128x128.webp")
            img.w-full.h-full(v-else-if="ruleModal === 'elements'" class="bg-white rounded-sm border-3 border-blue-500"
              src="/images/icons/rules/elements-rule_128x128.webp")

      template(#footer)
        FButton(:label="t('close')" @click="ruleModal = null")
</template>

<style lang="sass">
*
  font-family: 'Ribeye', cursive

img
  pointer-events: none
</style>