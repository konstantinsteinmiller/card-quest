<script setup lang="ts">
import { RouterView } from 'vue-router'
// if (window.location.hash !== '/') {
//   window.location.pathname = '/'
//   window.location.reload()
// }
</script>

<template lang="pug">
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