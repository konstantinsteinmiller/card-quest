<template lang="pug">
  div(
    class="fixed inset-0 flex flex-col items-center overflow-hidden bg-repeat select-none bg-[url('/images/board/papyrus-tile_128x128.webp')]"
    style="padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);"
    data-darkmode-ignore="true"
  )
    EmergencyAid(
      v-if="showEmergencyAid"
      :is-visible="showEmergencyAid"
      :amount="aidAmount"
      @close="showEmergencyAid = false"
    )

    div.flying-card(v-if="flyingCard" :style="flyingStyle")
      CardDisplay(:card="flyingCard.card" :show-tint="false")

    //- Main Layout
    div(class="flex flex-col landscape:flex-row w-full max-w-7xl h-full gap-2 p-1 sm:p-2 min-h-0")

      //- THE BOOK
      div(class="relative flex flex-col flex-grow min-h-0 shadow-2xl overflow-hidden rounded-lg")
        img(class="absolute inset-0 w-full h-full object-fill" src="/images/bg/book_800x609.webp")

        div(
          ref="gridArea"
          class="relative z-10 flex-1 px-[10%] pt-[14%] pb-[12%] lg:pt-[10%] overflow-hidden scrollbar-hide"
          :class="{ '!pt-[8%] ': isMobileLandscape }"
        )
          div(
            class="grid gap-3 sm:gap-4 content-start justify-items-center w-full h-full"
            :style="{ \
              gridTemplateColumns: `repeat(${gridLayout.cols}, 1fr)`, \
              gridTemplateRows: `repeat(${gridLayout.rows}, min-content)` \
            }"
          )
            div(
              v-for="(card, index) in paginatedCollection"
              :key="card.id + index"
              :ref="el => cardRefs[card.id] = el"
              @click="addToDeck(card, $event)"
              class="relative group aspect-square cursor-pointer transition-transform duration-200 active:scale-95 hover:scale-105 min-w-0 w-full"
              :class="[\
                card.count === 0 ? 'out-of-stock' : '',\
                card?.invisible ? 'invisible pointer-events-none': '',\
                (showHint && !isHintDisabled && selectedDeck.length < 5 && card.id === hintTargetId) ? 'hint-bounce' : ''\
              ]"
            )
              CardDisplay(:card="card" :is-selection="true" :show-tint="false")
              div(
                class="absolute -bottom-1 -right-1 text-white rounded-full flex items-center justify-center font-bold z-20 w-5 h-5 text-[10px] sm:w-6 sm:h-6 sm:text-xs"
                :class="card.count === 0 ? 'bg-slate-400' : 'bg-slate-600'"
              )
                span {{ card.count }}

        FIconButton(
          icon="left"
          class="absolute left-[1%] top-1/2 -translate-y-1/2 text-orange-900 transition-transform hover:scale-110 disabled:opacity-20 z-30"
          @click="prevPage"
          :disabled="currentPage === 0"
        )

        div(class="absolute bottom-[5%] left-0 right-0 flex justify-center items-center z-30")
          div(class="bg-black/30 text-shadow backdrop-blur-sm px-3 py-0.5 rounded-full font-bold text-amber-500 text-[10px] sm:text-xs")
            | {{ currentPage + 1 }} / {{ totalPages }}

        FIconButton(
          icon="right"
          class="absolute right-[1%] top-1/2 -translate-y-1/2 text-orange-900 transition-transform hover:scale-110 disabled:opacity-20 z-30"
          @click="nextPage"
          :disabled="currentPage >= totalPages - 1"
        )

      //- Sidebar / Deck Area
      div(class="flex flex-col shrink-0 items-center justify-between landscape:w-32 landscape:md:w-44 landscape:h-full portrait:w-full portrait:h-40 min-h-0 overflow-hidden")

        //- Deck Target - Ultimate Fix: absolute positioning avoids nested flex auto-height collapse
        div(class="deck-target relative flex-1 min-h-0 min-w-0 w-full")
          PlayerHandCard(
            :cards="selectedDeck"
            :is-active="true"
            :selected-id="null"
            @select="removeFromDeck"
            @click-card="removeFromDeck"
            @remove="removeFromDeck"
            class="absolute inset-0"
          )

        //- Buttons
        div(class="flex shrink-0 w-full portrait:flex-row landscape:flex-col portrait:pb-2")
          FButton(
            type="secondary"
            size="md"
            class="flex-1 text-xs sm:text-sm !pb-1"
            @click="router.push({ name: 'main-menu'})"
          ) {{ t('back') }}

          FButton(
            size="md"
            class="flex-1 btn-battle text-xs sm:text-sm"
            :disabled="selectedDeck.length < 5"
            :attention="selectedDeck.length === 5"
            :class="{ 'opacity-50 grayscale': selectedDeck.length < 5 }"
            @click="onNext"
          )
            span.whitespace-nowrap {{ t(isPracticeMatch ? 'battle': 'ready' ) }} ({{ selectedDeck.length }}/5)

</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useResizeObserver } from '@vueuse/core'
import type { GameCard } from '@/types/game'
import FButton from '@/components/atoms/FButton'
import CardDisplay from '@/components/CardDisplay'
import PlayerHandCard from '@/components/PlayerHandCard'
import EmergencyAid from '@/components/organisms/EmergencyAid'
import { playerSelection, isPracticeMatch, isDbInitialized, isCampaignTest } from '@/use/useMatch'
import useModels, { modelImgPath } from '@/use/useModels'
import useUser from '@/use/useUser'
import { isMobileLandscape } from '@/use/useUser'
import FIconButton from '@/components/atoms/FIconButton.vue'

const { setSettingValue, userHand, userCollection } = useUser()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { getSortedCollection, cardCollection, saveCollection } = useModels()

const inventory = ref(cardCollection)
const selectedDeck = ref<GameCard[]>([])
const currentPage = ref(0)
const showEmergencyAid = ref(false)

const cardRefs = ref<Record<string, any>>({})
const flyingCard = ref<{ card: any; start: DOMRect; end: DOMRect } | null>(null)
const flyingStyle = ref<Record<string, string>>({})

const showHint = ref<boolean>(false)
const isHintDisabled = ref<boolean>(false)
let hintTimeout: ReturnType<typeof setTimeout> | null = null

const gridArea = ref<HTMLElement | null>(null)
const gridInnerWidth = ref(0)
const gridInnerHeight = ref(0)

useResizeObserver(gridArea, (entries) => {
  const entry = entries[0]
  gridInnerWidth.value = Math.floor(entry.contentRect.width)
  gridInnerHeight.value = Math.floor(entry.contentRect.height)
})

const gridLayout = computed(() => {
  if (gridInnerWidth.value <= 0 || gridInnerHeight.value <= 0) return { cols: 3, rows: 2, count: 6 }
  const gap = isMobileLandscape.value ? 12 : 16
  const minW = isMobileLandscape.value ? 60 : 80
  const cols = Math.floor((gridInnerWidth.value + gap) / (minW + gap))
  const safeCols = Math.max(cols, 2)
  const actualCardW = (gridInnerWidth.value - (safeCols - 1) * gap) / safeCols
  const rows = Math.floor((gridInnerHeight.value + gap) / (actualCardW + gap + 4))
  return { cols: safeCols, rows: Math.max(rows, 1), count: safeCols * Math.max(rows, 1) }
})

const itemsPerPage = computed(() => gridLayout.value.count)

watch(itemsPerPage, () => {
  if (currentPage.value >= totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value - 1
  }
})

const startHintTimer = () => {
  clearHint()
  if (!isHintDisabled.value && selectedDeck.value.length < 5) {
    hintTimeout = setTimeout(() => {
      showHint.value = true
    }, 5000)
  }
}

const clearHint = () => {
  if (hintTimeout) clearTimeout(hintTimeout)
  showHint.value = false
}

const hintTargetId = computed(() => paginatedCollection.value.find(c => c.count > 0)?.id || null)

onMounted(() => {
  isPracticeMatch.value = route?.query?.practice === true || isPracticeMatch.value
  startHintTimer()
})

onUnmounted(() => clearHint())

watch(userCollection, () => {
  if (userCollection.value) inventory.value = getSortedCollection()
}, { immediate: true })

watch(userHand, () => {
  const hand = typeof userHand.value === 'string' ? JSON.parse(userHand.value) : userHand.value
  selectedDeck.value = Array.isArray(hand) ? [...hand] : []
}, { immediate: true })

const collection = computed(() => inventory.value.map(card => ({
  ...card, owner: 'player' as const, image: modelImgPath(card.id, card.element)
})))

const totalPages = computed(() => Math.ceil(collection.value.length / itemsPerPage.value))

const paginatedCollection = computed(() => {
  const start = currentPage.value * itemsPerPage.value
  const pageItems = collection.value.slice(start, start + itemsPerPage.value)
  if (pageItems.length < itemsPerPage.value) {
    const missingCount = itemsPerPage.value - pageItems.length
    const addedItems = Array(missingCount).fill(null).map(() => ({ invisible: true }))
    return [...pageItems, ...addedItems]
  }
  return pageItems
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
        opacity: '0', transform: 'rotate(12deg) scale(0.6)',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }, 20)
    setTimeout(() => (flyingCard.value = null), 520)
  })
}

const addToDeck = (cardTemplate: any, event: MouseEvent) => {
  if (selectedDeck.value.length >= 5 || cardTemplate.count <= 0) return

  // Disable hint on first interaction
  isHintDisabled.value = true
  clearHint()

  const targetEl = document.querySelector('.deck-target')
  if (targetEl) {
    animateFlight(cardTemplate, (event.currentTarget as HTMLElement).getBoundingClientRect(), targetEl.getBoundingClientRect())
  }
  const invItem = inventory.value.find(inv => inv.id === cardTemplate.id)
  if (invItem) {
    invItem.count--
    selectedDeck.value.push({ ...cardTemplate, instanceId: Math.random().toString(36).substring(2, 9) })
    setSettingValue('hand', [...selectedDeck.value])
    if (/*true || */isCampaignTest.value && false) {
      const failDeck = JSON.parse(JSON.parse('""'))
      console.log('failDeck: ', failDeck)
      saveCollection(failDeck)
    } else {
      saveCollection(inventory.value)
    }
  }
}

const removeFromDeck = (payload: any) => {
  const idToFind = payload?.instanceId || payload?.id || payload
  const index = selectedDeck.value.findIndex(c => c.instanceId === idToFind || c.id === idToFind)
  if (index !== -1) {
    const card = selectedDeck.value[index]
    const invItem = inventory.value.find(inv => inv.id === card.id)
    const bookEl = cardRefs.value[card.id]
    const startEl = document.querySelector('.deck-target')
    if (bookEl && startEl) animateFlight(card, startEl.getBoundingClientRect(), bookEl.getBoundingClientRect())
    if (invItem) invItem.count++
    selectedDeck.value.splice(index, 1)
    setSettingValue('hand', [...selectedDeck.value])
    saveCollection(inventory.value)
    if (selectedDeck.value.length < 5 && !isHintDisabled.value) startHintTimer()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 0) currentPage.value--
}

const onNext = () => {
  if (selectedDeck.value.length < 5) return
  playerSelection.value = [...selectedDeck.value]
  setSettingValue('hand', [...selectedDeck.value])
  router.push({ name: isPracticeMatch.value ? 'match' : 'campaign' })
}

// Watch for the "Bankrupt" state
watch(inventory, (newInv) => {
  if (!isDbInitialized.value) return

  setTimeout(() => {
    const coll = typeof userCollection.value === 'string' ? JSON.parse(userCollection.value) : userCollection.value
    const totalCount = coll?.reduce((sum, c) => sum + c.count, 0) || 0
    const hand = typeof userHand.value === 'string' ? JSON.parse(userHand.value) : userHand.value
    const totalInSelection = hand.length

    // Trigger if player has less than 5 cards total, and we aren't already showing the aid
    if (totalCount + totalInSelection < 5 && !showEmergencyAid.value) {
      setTimeout(() => {
        showEmergencyAid.value = true
      }, 1200)
    }
  }, 300)
}, { deep: true, immediate: true })

const aidAmount = computed(() => {
  const coll = typeof userCollection.value === 'string' ? JSON.parse(userCollection.value) : userCollection.value
  const totalCount = coll?.reduce((sum: number, c: any) => sum + c.count, 0) || 0
  const hand = typeof userHand.value === 'string' ? JSON.parse(userHand.value) : userHand.value
  return Math.min(7 - (totalCount + (hand?.length || 0)), 3)
})
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

.scrollbar-hide
  -ms-overflow-style: none
  scrollbar-width: none

  &::-webkit-scrollbar
    display: none


:deep(.player-hand)
  gap: 0 !important

:deep(.card-wrapper)
  transition: transform 0.2s ease

  &:hover
    z-index: 100
    transform: scale(1.1)
</style>