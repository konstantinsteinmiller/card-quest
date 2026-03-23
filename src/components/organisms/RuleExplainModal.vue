<script setup lang="ts">
import { ruleModal } from '@/use/useMatch'
import FModal from '@/components/molecules/FModal'
import { computed } from 'vue'
import { mobileCheck } from '@/utils/function'
import { isMobileLandscape, orientation } from '@/use/useUser'
import FButton from '@/components/atoms/FButton'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isPortrait = computed(() => mobileCheck() && innerWidth <= 500)
</script>

<template lang="pug">
  FModal.fixed(v-model="ruleModal" :title="t('rule.' + ruleModal)" class="z-[200]")
    div.text-shadow.cursor-pointer.mt-2.flex.flex-col.pr-0(
      class="text-[14px]"
      :class="{ 'flex-row !pr-7': isMobileLandscape }"
    )
      div.mb-4.text-left.pr-2.flex-grow(class="text-[13px]" :class="{ '!mb-0': isMobileLandscape }") {{ t('rule-desc.' + ruleModal) }}
      div.icon.flex.justify-center.items-center.mb-2
        div.icon.flex.justify-center(class="landscape:w-24 landscape:h-24 landscape:sm:w-24 landscape:sm:h-24")
          img.w-full.h-full(v-if="ruleModal === 'high'" class="w-max-[80%] bg-white rounded-sm border-3 border-black"
            src="/images/icons/rules/high-rule_256x256.webp")
          img.w-full.h-full(v-if="ruleModal === 'low'" class="bg-white rounded-sm border-3 border-white"
            src="/images/icons/rules/low-rule_256x256.webp")
          img.w-full.h-full(v-else-if="ruleModal === 'plus'" class="bg-white rounded-sm border-3 border-amber-500"
            src="/images/icons/rules/plus-rule_256x256.webp")
          img.w-full.h-full(v-else-if="ruleModal === 'same'" class="bg-white rounded-sm border-3 border-rose-500"
            src="/images/icons/rules/same-rule_256x256.webp")
          img.w-full.h-full(v-else-if="ruleModal === 'combo'" class="bg-white rounded-sm border-3 border-blue-500"
            src="/images/icons/rules/combo-rule_256x256.webp")
          img.w-full.h-full(v-else-if="ruleModal === 'elements'" class="bg-white rounded-sm border-3 border-blue-500"
            src="/images/icons/rules/elements-rule_128x128.webp")
          img.w-full.h-full(v-else-if="ruleModal === 'one'" class="bg-white border-dashed border-3 border-green-700"
            src="/images/icons/rules/one-rule_256x256.webp")
          img.w-full.h-full(v-else-if="ruleModal === 'all'" class="bg-white border-dashed border-3 border-green-700"
            src="/images/icons/rules/all-rule_256x256.webp")
          img.w-full.h-full(v-else-if="ruleModal === 'conquered'" class="bg-white border-dashed border-3 border-green-700"
            src="/images/icons/rules/conquered-rule_256x256.webp")
          img.w-full.h-full(v-else-if="ruleModal === 'random'" class="bg-white border-dashed border-3 border-green-700"
            src="/images/icons/rules/random-rule_256x256.webp")
    template(#footer)
      FButton(:label="t('close')" @click="ruleModal = null")
</template>

<style scoped lang="sass">

</style>