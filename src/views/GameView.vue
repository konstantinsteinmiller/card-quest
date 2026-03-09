<script setup lang="ts">
import { useRouter } from 'vue-router'
import GameField from '@/components/GameField'

const router = useRouter()
</script>

<template lang="pug">
  GameField(@backToMainMenu="router.push('main-menu')")
</template>

<style scoped lang="sass">

</style>