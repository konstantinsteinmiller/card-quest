<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  icon?: 'close' | 'left' | 'right' // Default to 'close' if not provided
}>()

const emit = defineEmits(['close'])

const selectedIcon = computed(() => {
  switch (props.icon) {
    case 'left':
      return {
        viewBox: '0 0 24 24',
        path: 'M15 19l-7-7 7-7' // Simple left arrow path
      }
    case 'right':
      return {
        viewBox: '0 0 24 24',
        path: 'M9 5l7 7-7 7' // Simple right arrow path
      }
    case 'close':
    default:
      return {
        viewBox: '0 0 24 24',
        path: 'M6 18L18 6M6 6l12 12' // Close 'X' path
      }
  }
})
</script>

<template lang="pug">
  button(
    @click="emit('close')"
    class="absolute group cursor-pointer z-10 hover:scale-[103%] transition-transform active:scale-40 sm:active:scale-90 scale-60 sm:scale-100"
  )
    div(class="relative")
      div(
        class="absolute inset-0 translate-y-1 rounded-lg bg-[#6b1212]"
        :class="{\
          '!bg-[#1a2b4b]': icon === 'right' || icon === 'left'\
        }")
      div(
        class="relative bg-[#ff3e3e] border-2 border-[#0f1a30] rounded-lg p-2 text-white font-bold"
        :class="{\
          '!border-[#1a2b4b] !bg-amber-400': icon === 'right' || icon === 'left'\
        }"
        :style="{ backgroundImage: `!linear-gradient(to bottom, '#ffcd00', '#f7a000')` }"
      )
        // Dynamically set viewBox and use computed path
        svg(
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          :viewBox="selectedIcon.viewBox"
          stroke="currentColor"
        )
          path(
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="4"
            :d="selectedIcon.path"
          )
</template>