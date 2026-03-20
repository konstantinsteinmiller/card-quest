<script setup lang="ts">
import CardDisplay from '@/components/CardDisplay'

defineProps<{
  cards: any[]
  isActive: boolean
  selectedId?: string | null
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()
</script>

<template lang="pug">
  div.grid.gap-2.justify-items-center(
    class="grid-cols-5 landscape:grid-cols-2 md:grid-cols-5"
  )
    div.relative.transition-all.duration-300(
      v-for="card in cards"
      :key="card.instanceId || card.id"
      class="aspect-1/1 w-[14vw] h-[14vw] sm:w-[80px] sm:h-[80px] landscape:w-[12vh] landscape:h-[12vh]"
      :class="[\
      isActive ? 'cursor-pointer hover:scale-110' : '',\
      selectedId === (card.instanceId || card.id) ? 'ring-4 ring-yellow-400 rounded-lg scale-110 z-10' : ''\
    ]"
      @click="isActive && emit('select', card.instanceId || card.id)"
    )
      CardDisplay(
        :card="card"
        :is-npc="false"
      )
</template>