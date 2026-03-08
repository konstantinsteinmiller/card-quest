<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  isClosable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isClosable: true
})

const emit = defineEmits(['update:modelValue']);

const close = () => {
  emit('update:modelValue', false);
};
</script>

<template lang="pug">
  Transition(name="pop")
    div(v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4")
      //- Backdrop
      div(class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="close")

      //- Modal Container
      div(class="relative w-full max-w-lg")

        //- Header Ribbon (The yellow title bar)
        div(class="absolute -top-6 left-1/2 -translate-x-1/2 z-10 scale-70 sm:scale-100")
          div(class="relative")
            //- Shadow of the ribbon
            div(class="absolute inset-0 translate-y-1 rounded-lg bg-[#1a2b4b]")
            //- Main Ribbon Body
            div(class="relative flex items-center justify-center bg-gradient-to-b from-[#ffcd00] to-[#f7a000] border-4 border-[#0f1a30] px-10 py-2 rounded-xl")
              span(class="brawl-text text-2xl md:text-3xl text-white uppercase tracking-wider whitespace-nowrap")
                | {{ title }}

        //- The Main Frame
        div(class="relative")
          //- The "Bottom Shadow" of the whole modal
          div(class="absolute inset-0 translate-y-2 rounded-[1.5rem] sm:rounded-[2.5rem] bg-[#0c1626]")

          //- The Modal Body
          div(class="relative bg-[#1a2b4b] border-[5px] border-[#0f1a30] rounded-[1.5rem] sm:rounded-[2.5rem] pt-7 pb-4 px-2 sm:px-4 sm:pt-6 sm:pb-4 md:p-8 md:pb-6 md:pt-10")

            //- Close Button (X)
            button(
              v-if="isClosable"
              @click="close"
              class="absolute top-0 right-0 group cursor-pointer transition-transform active:scale-40 sm:active:scale-90 scale-60 sm:scale-100 sm:top-4 sm:right-4 "
            )
              div(class="relative")
                div(class="absolute inset-0 translate-y-1 rounded-lg bg-[#6b1212]")
                div(class="relative bg-[#ff3e3e] border-2 border-[#0f1a30] rounded-lg p-2 text-white font-bold")
                  svg(xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor")
                    path(stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12")

            //- Content Slot
            div(class="text-white text-center")
              slot

            //- Footer Area for Actions
            div(class="mt-3 flex justify-center gap-4")
              slot(name="footer")
</template>

<style scoped lang="sass">
// Pop animation for the Brawl Stars feel
.pop-enter-active
  animation: bounce-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)

.pop-leave-active
  animation: bounce-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) reverse

@keyframes bounce-in
  0%
    transform: scale(0.5)
    opacity: 0
  100%
    transform: scale(1)
    opacity: 1

.brawl-text
  text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
</style>