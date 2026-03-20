<script setup lang="ts">
import type { BattleRuleName } from '@/use/useBattleRules'
import { ruleModal } from '@/use/useMatch'

defineProps<{
  rule: BattleRuleName
  iconOnly?: boolean
}>()
</script>

<template lang="pug">
  div.relative.text-shadow.cursor-pointer(class="text-[8px] hover:scale-[105%]" @click="ruleModal = rule")
    div(v-if="!iconOnly") {{ $t('rule.' + rule) }}
    div.w-8.h-8
      img(v-if="rule === 'standard'" class="border-black bg-white rounded-sm border-3"
        src="/images/icons/rules/standard-rule_256x256.webp")
      img(v-if="rule === 'low'" class="border-white bg-white rounded-sm border-3"
        src="/images/icons/rules/low-rule_256x256.webp")
      img(v-else-if="rule === 'plus'" class="border-amber-500 bg-white rounded-sm border-3"
        src="/images/icons/rules/plus-rule_256x256.webp")
      img(v-else-if="rule === 'same'" class="border-rose-500 bg-white rounded-sm border-3"
        src="/images/icons/rules/same-rule_256x256.webp")
      img.w-full.h-full(v-else-if="rule === 'combo'" class="border-blue-500 bg-white rounded-sm border-3"
        src="/images/icons/rules/combo-rule_256x256.webp")
      img.w-full.h-full(v-else-if="ruleModal === 'elements'" class="border-blue-500 bg-white rounded-sm border-3"
        src="/images/icons/rules/elements-rule_128x128.webp")
      div.absolute.-right-3.-bottom-4.text-white.text-lg(@click="ruleModal = rule" v-if="!iconOnly") &#9432;
</template>