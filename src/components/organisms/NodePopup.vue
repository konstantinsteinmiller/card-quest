<template lang="pug">
  Transition(
    name="pop"
    appear
    enter-active-class="transition-all duration-[250ms] ease-[cubic-bezier(0.18,0.89,0.32,1.28)]"
    leave-active-class="transition-all duration-[150ms] ease-[cubic-bezier(0.6,-0.28,0.735,0.045)]"
    enter-from-class="opacity-0 scale-0 translate-y-8"
    leave-to-class="opacity-0 scale-0 translate-y-8"
  )
    div.absolute.inset-0.z-50.flex.items-center.justify-center.pointer-events-none
      div.relative.border-4.rounded-2xl.w-full.max-w-xs.shadow-2xl.overflow-hidden.pointer-events-auto(
        class="border-slate-600/80 bg-black/80"
      )
        //- Close Button
        FCloseButton.absolute.w-8.h-8.flex(
          class="!top-2 !right-2 z-10 hover:scale-[103%]"
          @close="emit('close')"
        )

        //- Header
        div.p-3.pr-10.text-center(class="bg-slate-700/70 border-b-2 border-slate-600/50")
          h2.text-xl.font-black.text-yellow-400.uppercase.tracking-wide.text-shadow {{ node.name }}

        div.p-5.text-center
          p.text-sm.text-white.mb-4.italic.text-shadow "{{ node.description }}"

          //- Tiny Deck Preview
          div.flex.justify-center.gap-1.mb-5
            div.w-8.h-8(v-for="i in 5" :key="i")
              img.w-full.h-full.object-fill.shadow-md.rounded-sm(
                src="/images/backside/backside-1_256x256.webp"
                alt="Card Back"
              )

          div.flex.justify-center.gap-4.text-white.text-shadow.items-center
            div.text-amber-300.text-sm {{ t('rules') }}:
            RuleIcon(
              v-for="rule in node.rules"
              :key="rule"
              :rule="rule"
              class="mb-2"
            )

        //- Action
        div.p-4.pt-0
          FButton(
            :attention="true"
            @click="emit('start', )"
          ) {{ t('battle') }}
</template>

<script setup lang="ts">
import type { CampaignNode } from '@/use/useCampaign'
import FCloseButton from '@/components/atoms/FCloseButton'
import FButton from '@/components/atoms/FButton'
import { useI18n } from 'vue-i18n'
import RuleIcon from '@/components/atoms/RuleIcon'

defineProps<{ node: CampaignNode }>()
const emit = defineEmits(['close', 'start'])
const { t } = useI18n()
</script>

<style lang="sass" scoped>
.text-shadow
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5)

.pop-enter-to, .pop-leave-from
  opacity: 1
  transform: scale(1) translateY(0)
</style>