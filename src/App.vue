<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import GameField from '@/components/GameField'
import MainMenu from '@/components/MainMenu'

const { t } = useI18n()
const view = ref<'menu' | 'game'>('menu')
</script>

<template lang="pug">
  MainMenu(
    v-if="view === 'menu'"
    @play="view = 'game'"
  )
  GameField(
    v-else
    @backToMainMenu="view = 'menu'"
  )
  //GameField
</template>

<style lang="sass">
*
  font-family: 'Ribeye', cursive

p
  color: blue
$color: red
</style>

<i18n>
</i18n>