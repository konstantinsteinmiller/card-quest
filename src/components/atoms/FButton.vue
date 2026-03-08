<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string;
  type?: 'primary' | 'secondary';
  colorFrom?: string;
  colorTo?: string;
  shadowColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'NO LABEL DEFINED!',
  type: 'primary'
})

defineEmits(['click'])

// Map the theme colors based on the type prop
const theme = computed(() => {
  if (props.type === 'secondary') {
    return {
      from: props.colorFrom ?? '#50aaff', // Light Blue
      to: props.colorTo ?? '#2266ff',     // Darker Blue
      shadow: props.shadowColor ?? '#102e7a'
    };
  }
  // Default Primary (Brawl Stars Yellow)
  return {
    from: props.colorFrom ?? '#ffcd00',
    to: props.colorTo ?? '#f7a000',
    shadow: props.shadowColor ?? '#1a2b4b'
  }
})
</script>

<template lang="pug">
  button(
    type="button"
    @click="$emit('click')"
    class="group relative inline-block cursor-pointer select-none transition-all duration-75 active:scale-x-[95%] active:scale-y-[90%] active:brightness-110 touch-manipulation"
  )
    //- The "Bottom Shadow" / 3D Depth
    span(
      :style="{ backgroundColor: theme.shadow }"
      class="absolute inset-0 translate-y-[4px] md:translate-y-[4px] rounded-2xl"
    )

    //- The Main Button Body
    span(
      :style="{ backgroundImage: `linear-gradient(to bottom, ${theme.from}, ${theme.to})` }"
      class="relative block min-w-[80px] md:min-w-[140px] rounded-xl md:rounded-2xl border-[2px] border-[#0f1a30] px-4 md:px-6 py-2 md:py-3"
    )
      //- Inner Top Shine (The classic game shine)
      span(class="absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-white/25")

      //- Button Text / Content
      span(class="text relative block text-sm md:text-xl tracking-wide text-white")
        slot {{ label }}
</template>

<style scoped lang="sass">
button
  -webkit-tap-highlight-color: transparent

.text
  text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
</style>