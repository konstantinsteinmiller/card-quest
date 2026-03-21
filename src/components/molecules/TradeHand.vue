<script setup lang="ts">
import { computed, onMounted } from 'vue'
import CardDisplay from '@/components/CardDisplay'
import { mobileCheck } from '@/utils/function'
import { orientation } from '@/use/useUser'

defineProps<{
  cards: any[]
  isActive: boolean
  selectedId?: string | null
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

const isMobileLandscape = computed(() => mobileCheck() && window.innerWidth > 500 && orientation.value === 'landscape')
</script>

<template lang="pug">
  div.grid.gap-2.grid-cols-5.justify-items-center
    div.relative.transition-all.duration-300(
      v-for="card in cards"
      :key="card.instanceId"
      class="aspect-1/1 w-[14vw] h-[14vw] sm:w-[80px] sm:h-[80px] landscape:w-[12vh] landscape:h-[12vh]"
      :class="[\
      isActive ? 'cursor-pointer hover:scale-110' : '',\
      selectedId === (card.instanceId) ? 'ring-4 ring-yellow-400 rounded-lg scale-110 z-10' : ''\
    ]"
      @click="isActive && emit('select', card.instanceId)"
    )
      CardDisplay(
        :card="card"
        :is-npc="false"
      )
</template>