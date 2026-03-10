<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
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
</template>

<style lang="sass">
*
  font-family: 'Ribeye', cursive

img
  pointer-events: none

p
  color: blue
$color: red
</style>