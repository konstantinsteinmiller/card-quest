<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCampaign, type CampaignNode } from '@/use/useCampaign'
import NodePopup from '@/components/organisms/NodePopup'
import FButton from '@/components/atoms/FButton'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { isPracticeMatch, activeRules } from '@/use/useMatch'
import type { BattleRuleName } from '@/use/useBattleRules.ts'

const { t } = useI18n()
const router = useRouter()
const { campaignNodes, selectedNodeId, activeNode } = useCampaign()

isPracticeMatch.value = false

const isLandscape = ref(window.innerWidth > window.innerHeight)
const updateOrientation = () => {
  isLandscape.value = window.innerWidth > window.innerHeight
}

const getCurvePath = (startNode: CampaignNode, targetId: string) => {
  const endNode = campaignNodes.value.find(n => n.id === targetId)
  if (!endNode) return ''

  const x1 = startNode.position.x
  const y1 = startNode.position.y
  const x2 = endNode.position.x
  const y2 = endNode.position.y

  const cx = (x1 + x2) / 2 + (y2 - y1) * 0.1
  const cy = (y1 + y2) / 2 - (x2 - x1) * 0.1

  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
}

const getPathClass = (startNode: CampaignNode, targetId: string) => {
  const endNode = campaignNodes.value.find(n => n.id === targetId)
  if (!endNode) return 'opacity-0'

  if (endNode.unlocked) return 'opacity-100 stroke-yellow-400'
  return 'opacity-50 stroke-grey-500'
}

onMounted(() => {
  selectedNodeId.value = null
  window.addEventListener('resize', updateOrientation)
  updateOrientation()
})

onUnmounted(() => window.removeEventListener('resize', updateOrientation))

const startBattle = (rules: BattleRuleName[]) => {
  activeRules.value = !rules.length ? ['standard'] : rules
  router.push({ name: 'match' })
}
</script>

<template lang="pug">
  div.relative.w-screen.h-screen.bg-slate-900.overflow-hidden.flex.items-center.justify-center
    //- 1. Backgrounds
    img.absolute.inset-0.w-full.h-full.object-cover.select-none(
      src="/images/bg/oak_600x588.webp"
      alt="table-image"
    )
    img.absolute.inset-0.w-full.h-full.object-contain.select-none(
      src="/images/bg/campaign_map_800x710.webp"
      alt="campaign-map"
    )

    //- 2. The Interactive Node Layer
    div.relative.node-layer-container(
      :style="{ aspectRatio: '800 / 710' }"
      class="max-w-full max-h-full"
      :class="isLandscape ? 'h-full w-auto' : 'w-full h-auto'"
    )
      //- SVG Path Layer
      svg.absolute.inset-0.w-full.h-full.pointer-events-none.overflow-visible(
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      )
        defs
          filter#glow
            feGaussianBlur(stdDeviation="0.5" result="coloredBlur")
            feMerge
              feMergeNode(in="coloredBlur")
              feMergeNode(in="SourceGraphic")

        template(v-for="node in campaignNodes" :key="'paths-' + node.id")
          path(
            v-for="targetId in node.unlocks"
            :key="node.id + '-' + targetId"
            :d="getCurvePath(node, targetId)"
            fill="none"
            stroke="white"
            stroke-width="0.5"
            stroke-dasharray="1, 1"
            :class="getPathClass(node, targetId)"
            style="filter: url(#glow)"
          )

      //- The Stations (Nodes)
      button.absolute.transform.transition-all.duration-300(
        v-for="node in campaignNodes"
        :key="node.id"
        :style="{ left: node.position.x + '%', top: node.position.y + '%' }"
        @click="node.unlocked && (selectedNodeId = node.id)"
        :class="[\
          '-translate-x-1/2 -translate-y-1/2',\
          node.unlocked ? 'scale-80 hover:scale-100 cursor-pointer' : 'scale-65 opacity-50 cursor-not-allowed grayscale',\
          selectedNodeId === node.id ? 'z-30' : 'z-10'\
        ]"
      )
        div.relative.w-8.h-8.rounded-full.flex.items-center.justify-center.shadow-2xl.border-2(
          class="sm:w-12 sm:h-12 sm:border-3 md:border-4 md:w-16 md:h-16 bg-slate-800/50"
          :class="node.completed ? 'border-green-600' : 'border-yellow-500'"
        )
          span.text-base(v-if="node.completed" class="sm:text-xl") ✅
          span.text-base(v-else-if="!node.unlocked" class="sm:text-xl") 🔒
          span.text-base.animate-pulse(v-else class="sm:text-xl") ⚔️
          div.absolute.inset-0.rounded-full.animate-ping.bg-yellow-400.opacity-40(v-if="node.unlocked && !node.completed")

      //- 4. NodePopup placed inside the relative container to expand from map center
      NodePopup(
        v-if="activeNode"
        :node="activeNode"
        @close="selectedNodeId = null"
        @start="startBattle(activeNode.rules)"
      )

    //- 3. UI Overlays (Back Button)
    div.fixed.bottom-0.left-0.z-40.p-6(
      style="padding-bottom: calc(1.5rem + env(safe-area-inset-bottom)); padding-left: calc(1.5rem + env(safe-area-inset-left));"
    )
      FButton(
        type="secondary"
        size="lg"
        @click="router.push({ name: 'deck' })"
      ) {{ t('back') }}
</template>

<style lang="sass" scoped>
.node-layer-container
  pointer-events: none

  button
    pointer-events: auto

path
  transition: all 0.5s ease

  &.stroke-yellow-400
    stroke-dashoffset: 100
    animation: flow 20s linear infinite

@keyframes flow
  to
    stroke-dashoffset: 0
</style>