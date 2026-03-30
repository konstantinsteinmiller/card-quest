<template lang="pug">
  Transition(name="fade")
    //- Ensure classes with special characters are in parentheses
    div.fixed.inset-0.flex.flex-col.items-center.justify-center.backdrop-blur-md.p-4.touch-none.cursor-pointer(
      v-if="modelValue"
      class="z-[100] bg-black/60"
      @click="handleOverlayClick"
    )
      //- Use $slots directly to avoid script/template sync issues
      div.relative.mb-10.scale-90(
        v-if="$slots.ribbon"
        class="sm:scale-100"
        :class="{ '!mb-2 -mt-2': isMobileLandscape }"
      )
        div.absolute.inset-0.translate-y-1.rounded-lg(class="bg-[#1a2b4b]")
        div.relative.flex.items-center.justify-center.bg-gradient-to-b.border-4.px-10.py-2.rounded-xl(
          class="from-[#ffcd00] to-[#f7a000] border-[#0f1a30] min-w-[280px]"
        )
          slot(name="ribbon")
            span.text-white.font-black.uppercase.italic REWARDS

      div.relative.w-full.h-full.flex.flex-col.items-center.justify-center
        slot

      Transition(name="fade")
        div.absolute.bottom-8.left-0.right-0.flex.justify-center.animate-pulse.pointer-events-none(
          v-if="showContinue"
          class="sm:bottom-12"
        )
          div.text-sm.text-center.text-white.font-black.uppercase.italic.tracking-widest.brawl-text(class="md:text-2xl")
            | {{ isMobile ? t('tapToContinue') : t('clickToContinue') }}
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useI18n } from 'vue-i18n'
import { isMobileLandscape } from '@/use/useUser'

const props = defineProps<{
  modelValue: boolean
  showContinue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'continue'): void
}>()

const { t } = useI18n()
const slots = useSlots()

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
