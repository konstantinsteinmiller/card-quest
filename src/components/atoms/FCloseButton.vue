<script setup lang="ts">
const emit = defineEmits(['close'])
</script>

<template lang="pug">
  button(
    @click="emit('close')"
    class="absolute top-0 right-0 group cursor-pointer hover:scale-[103%] transition-transform active:scale-40 sm:active:scale-90 scale-60 sm:scale-100 sm:top-4 sm:right-4 "
  )
    div(class="relative")
      div(class="absolute inset-0 translate-y-1 rounded-lg bg-[#6b1212]")
      div(class="relative custom-red-bg border-2 border-[#0f1a30] rounded-lg p-2 text-white font-bold")
        svg(xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor")
          path(stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12")
</template>

<style scoped lang="sass">

</style>