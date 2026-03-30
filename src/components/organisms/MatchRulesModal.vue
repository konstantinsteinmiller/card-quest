<template lang="pug">
  FModal(
    :model-value="isOpen"
    :title="t('matchRules')"
    :is-closable="true"
    @update:model-value="emit('close')"
  )
    div.p-2.flex.flex-col.items-center.gap-3(class="sm:gap-4")
      div.flex.flex-row.items-center.gap-5.mt-2
        div.relative.flex.flex-row.items-center.gap-2(v-for="rule in rules" :key="rule")
          div.absolute.inset-0.bg-amber-400.blur-xl.opacity-20.animate-pulse
          RuleIcon.attention-5(:rule="rule")

      //- Divider
      div(class="w-full h-1 bg-[#0f1a30] rounded-full opacity-20")

      //- Skip Rules Switch
      FSwitch(
        :model-value="userSkipRulesModal"
        @update:model-value="setSettingValue('skipRulesModal', $event)"
      )
        div(class="text-[10px]") {{ t('doNotBother') }}

    template(#footer)
      FButton.w-full.max-w-xs(
        @click="emit('close')"
      ) {{ t('close') }}
</template>

<script setup lang="ts">
import type { RuleName } from '@/use/useBattleRules'
import FModal from '@/components/molecules/FModal'
import FButton from '@/components/atoms/FButton'
import FSwitch from '@/components/atoms/FSwitch'
import RuleIcon from '@/components/atoms/RuleIcon'
import { useI18n } from 'vue-i18n'
import useUser from '@/use/useUser'

defineProps<{
  isOpen: boolean
  rules: RuleName[]
}>()

const emit = defineEmits(['close'])
const { t } = useI18n()
const { userSkipRulesModal, setSettingValue } = useUser()
</script>

<style lang="sass" scoped>
.brawl-text
  text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
</style>

<i18n lang="yaml">
en:
  matchRules: "Match Rules"
  doNotBother: "Don't show again"
de:
  matchRules: "Kampfregeln"
  doNotBother: "Nicht mehr anzeigen"
fr:
  matchRules: "Règles du match"
  doNotBother: "Ne plus afficher"
es:
  matchRules: "Reglas del juego"
  doNotBother: "No volver a mostrar"
jp:
  matchRules: "対戦ルール"
  doNotBother: "再表示しない"
kr:
  matchRules: "경기 규칙"
  doNotBother: "다시 보지 않기"
zh:
  matchRules: "比赛规则"
  doNotBother: "不再显示"
ru:
  matchRules: "Правила боя"
  doNotBother: "Больше не показывать"
</i18n>