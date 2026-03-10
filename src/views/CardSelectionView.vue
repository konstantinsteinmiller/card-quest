<template lang="pug">
  div.h-screen.w-screen.flex.flex-col.items-center.p-1.overflow-hidden.bg-repeat.select-none(
    class="h-[100dvh] landscape:sm:p-1 sm:p-4 landscape:md:p-4 inset-0 bg-[url('/images/board/papyrus-tile_128x128.webp')] h-full min-h-0"
    style="padding-bottom: env(safe-area-inset-bottom); padding-top: env(safe-area-inset-top);"
  )
    //- Main Layout
    div.flex-1.w-full.p-1.h-full.max-w-6xl.flex.flex-col.gap-2(class="landscape:flex-row")

      //- THE BOOK (Added flex-grow to ensure it takes all available space)
      div.relative.shadow-inner.flex.flex-col.flex-grow.mr-2(class="overflow-hidden")
        img.absolute.inset-0.w-full.h-full.object-fill(src="/images/bg/book_512x401.webp")

        //- Collection Container
        div.flex-1.relative.z-10.ml-1.px-5.pt-14.flex.flex-wrap.justify-center.content-start.overflow-y-auto.cursor-pointer(
          class="gap-x-10 gap-2 sm:gap-2 sm:gap-x-2 md:gap-4 md:px-12 md:pt-15"
        )
          div.relative.group(
            v-for="card in paginatedCollection"
            :key="card.id"
            @click="addToDeck(card)"
            class="card-container flex items-center justify-center"
          )
            div.w-full.h-full.transition-transform.duration-200(class="group-hover:scale-105 active:scale-95")
              CardDisplay(:card="card" :show-tint="false")

            //- Counter Badge
            div.counter-bubble.absolute.-bottom-1.-right-1.bg-slate-500.text-white.rounded-full.flex.items-center.justify-center.font-bold.z-20(
              class="w-4 h-4 text-[9px] sm:w-5 sm:h-5 sm:text-[10px]"
            )
              span {{ card.count }}

        //- Bottom Controls
        div(class="bottom-7 landscape:bottom-8 sm:bottom-9").absolute.left-0.flex.justify-center.items-center.gap-6.py-2.z-30.relative
          button.p-1.cursor-pointer(
            class="text-orange-900 hover:scale-125 transition-transform disabled:opacity-20"
            @click="prevPage"
            :disabled="currentPage === 0"
          )
            span.text-xl(class="sm:text-2xl") ◀

          div.text-center.font-bold(class="text-orange-900/50 text-[10px] sm:text-xs")
            | {{ currentPage + 1 }} / {{ totalPages }}

          button.p-1.cursor-pointer(
            class="text-orange-900 hover:scale-125 transition-transform disabled:opacity-20"
            @click="nextPage"
            :disabled="currentPage >= totalPages - 1"
          )
            span.text-xl(class="sm:text-2xl") ▶

      //- Sidebar / Deck Dock (FIXED DIMENSIONS ADDED HERE)
      div.flex.flex-col.flex-grow.gap-1.justify-center.items-center.sidebar-container(
        class="landscape:w-28 landscape:sm:w-36 sm:w-36 portrait:h-24 portrait:w-full"
      )
        div.rounded-xl.flex.flex-col.items-center.w-full.h-full(
          class="bg-slate-800/50 portrait:justify-center"
        )
          div.flex.flex-1.w-full.justify-center.relative.z-40(
            class="landscape:flex-col landscape:items-center landscape:justify-start"
          )
            PlayerHandCard(
              :cards="selectedDeck"
              :is-active="true"
              :selected-id="null"
              @select="removeFromDeck"
            )

        div.flex.gap-2.mb-4.justify-center(class="landscape:flex-col landscape:sm:flex-col")
          FButton.text-xs(
            type="secondary"
            class="sm:text-sm"
            @click="router.push({ name: 'main-menu'})"
          ) {{ t('back') }}
          FButton.text-xs.btn-battle(
            class="sm:text-sm"
            :disabled="selectedDeck.length < 5"
            :class="{ 'is-ready': selectedDeck.length === 5, 'opacity-50 grayscale': selectedDeck.length < 5 }"
            @click="startMatch"
          ) {{ t('battle') }} ({{ selectedDeck.length }}/5)
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { GameCard } from '@/types/game'
import FButton from '@/components/atoms/FButton'
import CardDisplay from '@/components/CardDisplay'
import PlayerHandCard from '@/components/PlayerHandCard'
import { playerSelection } from '@/use/useMatch'
import { modelImgPath, useModels } from '@/use/useModels'
import useUser from '@/use/useUser.ts'

const { setSettingValue, userHand } = useUser()

const { t } = useI18n()
const router = useRouter()
const { allCards } = useModels()

const inventory = ref(allCards.map(c => ({ ...c, count: 2 })))
const selectedDeck = ref<GameCard[]>([])
const currentPage = ref(0)

const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

const updateDimensions = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  const hand = typeof userHand.value === 'string' ? JSON.parse(userHand.value) : userHand.value
  selectedDeck.value = [...hand]
  window.addEventListener('resize', updateDimensions)
  window.scrollTo(0, 0)
})
onUnmounted(() => window.removeEventListener('resize', updateDimensions))

const itemsPerPage = computed(() => {
  if ((windowHeight.value > 600 && windowWidth.value > 600)) return 16
  if ((windowWidth.value < 801)) return 8
  return 16
})

const collection = computed(() => {
  return inventory.value.map(item => ({
    ...item,
    id: item.id,
    owner: 'player' as const,
    image: modelImgPath(item.id)
  }))
})

const totalPages = computed(() => Math.ceil(collection.value.length / itemsPerPage.value))

const paginatedCollection = computed(() => {
  const start = currentPage.value * itemsPerPage.value
  return collection.value.slice(start, start + itemsPerPage.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 0) currentPage.value--
}

const addToDeck = (cardTemplate: any) => {
  if (selectedDeck.value.length >= 5) return
  const invItem = inventory.value.find(inv => inv.id === cardTemplate.id)
  if (invItem && invItem.count > 0) {
    invItem.count--
    selectedDeck.value.push({ ...cardTemplate, instanceId: Math.random().toString(36).substring(2, 9) })
  }
}

const removeFromDeck = (cardId: string) => {
  const index = selectedDeck.value.findIndex(c => c.instanceId === cardId || c.id === cardId)
  if (index !== -1) {
    const card = selectedDeck.value[index]
    const invItem = inventory.value.find(inv => inv.id === card.id)
    if (invItem) invItem.count++
    selectedDeck.value.splice(index, 1)
  }
}

const startMatch = () => {
  playerSelection.value = [...selectedDeck.value]
  setSettingValue('hand', [...selectedDeck.value])
  router.push({ name: 'match' })
}
</script>

<style lang="sass" scoped>
.counter-bubble
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.6)
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.9)
  border: 1px solid rgba(255, 255, 255, 0.4)

.card-container
  width: calc(32% - 4px)
  aspect-ratio: 1 / 1
  @media (max-width: 800px) and (orientation: landscape)
    width: calc(21% - 8px)
  @media (min-width: 801px)
    width: calc(20% - 12px)

.sidebar-container
  flex-shrink: 0
  // Prevent the sidebar from being squeezed
  flex-grow: 0
// Prevent the sidebar from expanding

.btn-battle
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)

  &.is-ready
    animation: battle-bounce 1s infinite alternate
    box-shadow: 0 0 15px rgba(255, 165, 0, 0.4)
    cursor: pointer

    &:hover
      transform: scale(1.1)

    &:active
      transform: scale(0.95)

@keyframes battle-bounce
  0%
    transform: scale(1)
  100%
    transform: scale(1.08)

:deep(.game-card)
  aspect-ratio: 1 / 1 !important
  width: 100% !important
  height: 100% !important

:deep(.card-wrapper)
  width: 48px !important
  height: 48px !important
  transition: transform 0.2s ease
  cursor: pointer
  pointer-events: auto !important

  &:hover
    z-index: 100
    transform: scale(1.1)

  @media (max-width: 800px) and (orientation: landscape)
    width: 52px !important
    height: 52px !important
    margin-top: -20px
    &:first-child
      margin-top: 0
  @media (min-width: 801px)
    width: 80px !important
    height: 80px !important
    .landscape &
      margin-top: -25px

      &:first-child
        margin-top: 0
</style>