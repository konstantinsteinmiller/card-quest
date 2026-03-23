<template lang="pug">
  Transition(name="fade")
    div.fixed.inset-0.flex.flex-col.items-center.justify-center.backdrop-blur-md.p-4.touch-none.cursor-pointer(
      v-if="modelValue"
      class="z-[100] bg-black/60"
      @click="handleOverlayClick"
    )
      div.relative.w-full.h-full.flex.flex-col.items-center.justify-center
        slot

      //- Centered Continue Text
      Transition(name="fade")
        div.absolute.bottom-8.left-0.right-0.flex.justify-center.animate-pulse.pointer-events-none(
          v-if="showContinue"
          class="sm:bottom-12"
        )
          div.text-sm.text-center.text-white.font-black.uppercase.italic.tracking-widest.brawl-text(class="md:text-2xl")
            | {{ isMobile ? t('tapToContinue') : t('clickToContinue') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'


const props = defineProps<{
  modelValue: boolean
  showContinue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'continue'): void
}>()

const { t } = useI18n()

const isMobile = computed(() => {
  return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
})

const handleOverlayClick = () => {
  if (props.showContinue) emit('continue')
}
</script>

<style scoped lang="sass">
.fade-enter-active, .fade-leave-active
  transition: opacity 0.4s ease

.fade-enter-from, .fade-leave-to
  opacity: 0

.brawl-text
  text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
</style>

<i18n lang="yaml">
en:
  tapToContinue: "Tap to continue"
  clickToContinue: "Click to continue"
de:
  tapToContinue: "Tippen zum Fortfahren"
  clickToContinue: "Klicken zum Fortfahren"
</i18n>