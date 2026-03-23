<template lang="pug">
  //- Container with dynamic glow and border colors
  div.flex.items-center.rounded-md.border.transition-all.duration-500(
    class="px-2 gap-1.5 py-0.5"
    :class="[\
      isGrandmaster ? 'bg-amber-900/30 border-amber-500/50' : 'bg-slate-800/40 border-indigo-600/50',\
      isThinking ? (isGrandmaster ? 'shadow-amber-glow' : 'shadow-indigo-glow') : (isGrandmaster ? 'shadow-[0_0_8px_rgba(245,158,11,0.2)]' : '')\
    ]"
  )
    //- Status Indicator Dot
    div.rounded-full(
      class="w-1.5 h-1.5"
      :class="isGrandmaster ? 'bg-amber-400 animate-pulse' : 'bg-indigo-800/80'"
    )

    //- Mode Label
    span.font-black.tracking-tighter.uppercase.text-shadow-light(
      :class="isGrandmaster ? 'text-amber-400' : 'text-indigo-800'"
      class="text-[10px]"
    ) {{ isGrandmaster ? t('grandmaster') : t('tactician') }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  isGrandmaster: boolean
  isThinking: boolean
}>()

const { t } = useI18n()
</script>

<style lang="sass" scoped>
span
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5)

.shadow-amber-glow
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.6)
  animation: pulse-glow-amber 1.5s infinite ease-in-out

.shadow-indigo-glow
  box-shadow: 0 0 15px rgba(79, 70, 229, 0.6)
  animation: pulse-glow-indigo 1.5s infinite ease-in-out

@keyframes pulse-glow-amber
  0%, 100%
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.4)
  50%
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.8)

@keyframes pulse-glow-indigo
  0%, 100%
    box-shadow: 0 0 8px rgba(79, 70, 229, 0.4)
  50%
    box-shadow: 0 0 20px rgba(79, 70, 229, 0.8)
</style>

<i18n>
en:
  grandmaster: 'Grandmaster'
  tactician: 'Tactician'
de:
  grandmaster: 'Großmeister'
  tactician: 'Taktiker'
</i18n>