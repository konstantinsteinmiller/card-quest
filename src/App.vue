<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FModal from '@/components/molecules/FModal'
import FButton from '@/components/atoms/FButton'
import { ruleModal } from '@/use/useMatch'
import { isMobileLandscape, orientation } from '@/use/useUser'
import { mobileCheck } from '@/utils/function'

const { t } = useI18n()
// if (window.location.hash !== '/') {
//   window.location.pathname = '/'
//   window.location.reload()
// }
const portraitQuery = window.matchMedia('(orientation: portrait)')
const onTouchStart = (event: any) => {
  if (event.touches.length > 1) {
    event.preventDefault() // Block multi-touch (pinch)
  }
}
const onGestureStart = (event: any) => {
  event.preventDefault() // Block specific Safari zoom gestures
}
const onOrientationChange = (event: any) => {
  if (event.matches) {
    orientation.value = 'portrait'
  } else {
    orientation.value = 'landscape'
  }
}

const onContextMenu = (event: any) => {
  event.preventDefault() // Block right-click context menu
}

onMounted(() => {
  document.addEventListener('contextmenu', onContextMenu)
  document.addEventListener('touchstart', onTouchStart, { passive: false })
  document.addEventListener('gesturestart', onGestureStart)
  portraitQuery.addEventListener('change', onOrientationChange)
})
onUnmounted(() => {
  document.removeEventListener('contextmenu', onContextMenu)
  document.removeEventListener('touchstart', onTouchStart, { passive: false })
  document.removeEventListener('gesturestart', onGestureStart)
  portraitQuery.removeEventListener('change', onOrientationChange)
})

const isPortrait = computed(() => mobileCheck() && innerWidth <= 500)

</script>

<template lang="pug">
  div.h-screen.w-screen.app-container
    RouterView

    FModal.fixed(v-model="ruleModal" :title="t('rule.' + ruleModal)" class="z-[200]")
      div.text-shadow.cursor-pointer.mt-2.flex.flex-col.pr-0(
        class="text-[14px]"
        :class="{ 'flex-row !pr-7': isMobileLandscape }"
      )
        div.mb-4.text-left.pr-2.flex-grow(class="text-[13px]" :class="{ '!mb-0': isMobileLandscape }") {{ t('rule-desc.' + ruleModal) }}
        div.icon.flex.justify-center.items-center.mb-2
          div.icon.flex.justify-center(class="landscape:w-24 landscape:h-24 landscape:sm:w-24 landscape:sm:h-24")
            img.w-full.h-full(v-if="ruleModal === 'standard'" class="w-max-[80%] bg-white rounded-sm border-3 border-black"
              src="/images/icons/rules/standard-rule_256x256.webp")
            img.w-full.h-full(v-if="ruleModal === 'low'" class="bg-white rounded-sm border-3 border-white"
              src="/images/icons/rules/low-rule_256x256.webp")
            img.w-full.h-full(v-else-if="ruleModal === 'plus'" class="bg-white rounded-sm border-3 border-amber-500"
              src="/images/icons/rules/plus-rule_256x256.webp")
            img.w-full.h-full(v-else-if="ruleModal === 'same'" class="bg-white rounded-sm border-3 border-rose-500"
              src="/images/icons/rules/same-rule_256x256.webp")
            img.w-full.h-full(v-else-if="ruleModal === 'combo'" class="bg-white rounded-sm border-3 border-blue-500"
              src="/images/icons/rules/combo-rule_256x256.webp")
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