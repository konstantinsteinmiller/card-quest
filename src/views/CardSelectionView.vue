<template lang="pug">
  div.h-screen.w-screen.flex.flex-col.items-center.p-1.overflow-hidden.bg-repeat.select-none(
    class="h-[100dvh] landscape:sm:p-1 sm:p-4 landscape:md:p-4 inset-0 bg-[url('/images/board/papyrus-tile_128x128.webp')] h-full min-h-0"
    style="padding-bottom: env(safe-area-inset-bottom); padding-top: env(safe-area-inset-top);"
  )
    //- Animation Overlay
    div.flying-card(v-if="flyingCard" :style="flyingStyle")
      CardDisplay(:card="flyingCard.card" :show-tint="false")

    //- Main Layout
    div.flex-1.w-full.p-1.h-full.max-w-6xl.flex.flex-col.gap-2(class="landscape:flex-row")

      //- THE BOOK
      div.relative.shadow-inner.flex.flex-col.flex-grow.mr-2(class="overflow-hidden")
        img.absolute.inset-0.w-full.h-full.object-fill(src="/images/bg/book_512x401.webp")

        div.flex-1.relative.z-10.ml-1.px-5.pt-14.flex.flex-wrap.justify-center.content-start.overflow-y-auto.cursor-pointer(
          class="gap-x-10 gap-3 sm:gap-3 sm:gap-x-2 md:gap-4 md:px-12 md:pt-15"
        )
          div.relative.group(
            v-for="card in paginatedCollection"
            :key="card.id"
            :ref="el => cardRefs[card.id] = el"
            @click="addToDeck(card, $event)"
            class="card-container flex items-center justify-center"
            :class="{ 'out-of-stock': card.count === 0 }"
          )
            div.w-full.h-full.transition-transform.duration-200(class="group-hover:scale-105 active:scale-95")
              CardDisplay(:card="card" :is-selection="true" :show-tint="false")

            div.counter-bubble.absolute.-bottom-1.-right-1.text-white.rounded-full.flex.items-center.justify-center.font-bold.z-20(
              class="w-4 h-4 text-[9px] sm:w-5 sm:h-5 sm:text-[10px]"
              :class="card.count === 0 ? 'bg-slate-400' : 'bg-slate-600'"
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

      //- Sidebar / Deck Dock
      div.flex.flex-col.gap-1.justify-center.items-center.sidebar-container(
        class="sm:gap-2 landscape:w-32 landscape:sm:w-40 landscape:md:w-48 portrait:h-28 portrait:w-full"
      )
        div.flex.flex-col.items-center.w-full.h-full.deck-target(
          class="portrait:justify-center"
        )
          div.flex.flex-1.w-full.justify-center.relative.z-40.hand-interact-zone(
            class="landscape:flex-col landscape:items-center landscape:justify-start"
          )
            //- Added more event listeners to catch whatever the component emits
            PlayerHandCard(
              :cards="selectedDeck"
              :is-active="true"
              :selected-id="null"
              @select="removeFromDeck"
              @click-card="removeFromDeck"
              @remove="removeFromDeck"
            )

        div.flex.gap-2.mb-4.justify-center(class="landscape:flex-col landscape:sm:flex-col")
          FButton.text-xs(type="secondary" class="sm:text-sm" @click="router.push({ name: 'main-menu'})") ◀ {{ t('back') }}
          FButton.text-xs.btn-battle(
            class="sm:text-sm"
            :disabled="selectedDeck.length < 5"
            :class="{ 'is-ready': selectedDeck.length === 5, 'opacity-50 grayscale': selectedDeck.length < 5 }"
            @click="onNext"
          ) {{ t(isCampaignMatch ? 'ready' : 'battle') }} ({{ selectedDeck.length }}/5)
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { GameCard } from '@/types/game'
import FButton from '@/components/atoms/FButton'
import CardDisplay from '@/components/CardDisplay'
import PlayerHandCard from '@/components/PlayerHandCard'
import { playerSelection, isCampaignMatch } from '@/use/useMatch'
import { modelImgPath, useModels } from '@/use/useModels'
import useUser from '@/use/useUser'

const { setSettingValue, userHand } = useUser()
const { t } = useI18n()
const router = useRouter()
const { allCards } = useModels()

const inventory = ref(allCards.map(c => ({ ...c, count: 2 })))
const selectedDeck = ref<GameCard[]>([])
const currentPage = ref(0)
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

const cardRefs = ref<Record<string, any>>({})
const flyingCard = ref<{ card: any; start: DOMRect; end: DOMRect } | null>(null)
const flyingStyle = ref<Record<string, string>>({})

const updateDimensions = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  const hand = typeof userHand.value === 'string' ? JSON.parse(userHand.value) : userHand.value
  selectedDeck.value = Array.isArray(hand) ? [...hand] : []

  selectedDeck.value.forEach(card => {
    const inv = inventory.value.find(i => i.id === card.id)
    if (inv && inv.count > 0) inv.count--
  })

  window.addEventListener('resize', updateDimensions)
  window.scrollTo(0, 0)
})

onUnmounted(() => window.removeEventListener('resize', updateDimensions))

const itemsPerPage = computed(() => {
  if (windowHeight.value > 600 && windowWidth.value > 600) return 16
  return windowWidth.value < 801 ? 8 : 16
})

const collection = computed(() => inventory.value.map(item => ({
  ...item, owner: 'player' as const, image: modelImgPath(item.id)
})))

const totalPages = computed(() => Math.ceil(collection.value.length / itemsPerPage.value))
const paginatedCollection = computed(() => {
  const start = currentPage.value * itemsPerPage.value
  return collection.value.slice(start, start + itemsPerPage.value)
})

const animateFlight = (card: any, startRect: DOMRect, endRect: DOMRect) => {
  flyingCard.value = { card, start: startRect, end: endRect }
  flyingStyle.value = {
    top: `${startRect.top}px`, left: `${startRect.left}px`,
    width: `${startRect.width}px`, height: `${startRect.height}px`,
    transition: 'none', opacity: '1', zIndex: '9999'
  }
  nextTick(() => {
    setTimeout(() => {
      flyingStyle.value = {
        top: `${endRect.top}px`, left: `${endRect.left}px`,
        width: `${endRect.width}px`, height: `${endRect.height}px`,
        opacity: '0', transform: 'rotate(10deg) scale(0.8)',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }, 20)
    setTimeout(() => {
      flyingCard.value = null
    }, 520)
  })
}

const addToDeck = (cardTemplate: any, event: MouseEvent) => {
  if (selectedDeck.value.length >= 5 || cardTemplate.count <= 0) return
  const targetEl = document.querySelector('.deck-target')
  if (targetEl) {
    animateFlight(cardTemplate, (event.currentTarget as HTMLElement).getBoundingClientRect(), targetEl.getBoundingClientRect())
  }
  const invItem = inventory.value.find(inv => inv.id === cardTemplate.id)
  if (invItem) {
    invItem.count--
    selectedDeck.value.push({ ...cardTemplate, instanceId: Math.random().toString(36).substring(2, 9) })
  }
}

const removeFromDeck = (payload: any) => {
  // Debug: console.log('Payload from component:', payload)

  // Robust identification
  let idToFind = ''
  if (typeof payload === 'string') idToFind = payload
  else if (payload?.instanceId) idToFind = payload.instanceId
  else if (payload?.id) idToFind = payload.id

  const index = selectedDeck.value.findIndex(c => c.instanceId === idToFind || c.id === idToFind)

  if (index !== -1) {
    const card = selectedDeck.value[index]
    const invItem = inventory.value.find(inv => inv.id === card.id)
    const bookEl = cardRefs.value[card.id]
    const startEl = document.querySelector('.deck-target')

    if (bookEl && startEl) {
      animateFlight(card, startEl.getBoundingClientRect(), bookEl.getBoundingClientRect())
    }

    if (invItem) invItem.count++
    selectedDeck.value.splice(index, 1)
    setSettingValue('hand', [...selectedDeck.value])
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 0) currentPage.value--
}
const onNext = () => {
  playerSelection.value = [...selectedDeck.value]
  setSettingValue('hand', [...selectedDeck.value])

  if (isCampaignMatch.value) {
    router.push({ name: 'campaign' })
  } else {
    router.push({ name: 'match' })
  }
}
</script>

<style lang="sass" scoped>
.out-of-stock
  filter: grayscale(1) brightness(0.6)
  opacity: 0.5
  cursor: not-allowed !important
  pointer-events: none

.flying-card
  position: fixed
  z-index: 9999
  pointer-events: none

.card-container
  width: calc(32% - 4px)
  aspect-ratio: 1 / 1
  @media (max-width: 800px) and (orientation: landscape)
    width: calc(21% - 8px)
  @media (min-width: 801px)
    width: calc(20% - 12px)

.sidebar-container
  flex-shrink: 0
  flex-grow: 0


.hand-interact-zone
  pointer-events: auto !important

  :deep(*)
    pointer-events: auto !important

:deep(.card-wrapper)
  width: 60px !important
  height: 60px !important
  transition: transform 0.2s ease
  cursor: pointer !important
  pointer-events: auto !important

  &:hover
    z-index: 100
    transform: scale(1.1)

  @media (max-width: 800px) and (orientation: landscape)
    width: 50px !important
    height: 50px !important
    margin-top: -22px
    &:first-child
      margin-top: 0
  @media (min-width: 801px)
    width: 90px !important
    height: 90px !important
    .landscape &
      margin-top: -40px

      &:first-child
        margin-top: 0
</style>

<i18n>
en:
  ready: "Ready"
  battle: "Battle"
de:
  ready: "Bereit"
  battle: "Kampf"
</i18n>