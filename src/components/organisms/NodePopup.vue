<template lang="pug">
  div.fixed.inset-0.z-50.flex.items-center.justify-center.p-4(
    @click.self="emit('close')"
  )
    //- The Popover Content.bg-slate-800
    div.relative.border-4.border-slate-600.rounded-2xl.w-full.max-w-xs.shadow-2xl(
      class="bg-black/80 transform transition-all animate-in zoom-in-95 duration-200"
    )
      //- Close Button (Top Right)
      FCloseButton.absolute.w-8.h-8.flex(
        class="!top-2 !right-2 scale-100"
        @close="emit('close')"
      )

      //- Header
      div.bg-slate-700.p-3.pr-10.text-center.rounded-t-xl
        h2.text-xl.font-black.text-yellow-400.uppercase.tracking-wide.text-shadow {{ node.name }}

      div.p-5.text-center
        p.text-sm.text-white.mb-4.italic.shadow-md.text-shadow "{{ node.description }}"

        //- Tiny Deck Preview
        div.flex.justify-center.gap-1.mb-5
          div.w-8.h-8(v-for="i in 5")
            img.object-fill.shadow-md(
              src="/images/backside/backside-1_256x256.webp"
              alt="Card Back"
            )

      //- Action
      div.p-4.pt-0
        FButton.w-full(
          @click="emit('start')"
        ) {{ t('battle') }}
</template>

<script setup lang="ts">
import type { CampaignNode } from '@/use/useCampaign'
import FCloseButton from '@/components/atoms/FCloseButton'
import FButton from '@/components/atoms/FButton'
import { useI18n } from 'vue-i18n'

defineProps<{ node: CampaignNode }>()
const emit = defineEmits(['close', 'start'])
const { t } = useI18n()
</script>

<style lang="sass" scoped>
.shadow-brutal
  box-shadow: 0 5px 0 0 #166534
  transition: all 0.1s ease

  &:active
    transform: translateY(3px)
    box-shadow: 0 2px 0 0 #166534
</style>

<i18n>
en:
  battle: "Fight!"
de:
  battle: "Kämpfen!"
</i18n>