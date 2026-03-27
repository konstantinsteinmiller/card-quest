<template lang="pug">
  div.flex.flex-col.items-center.p-1.overflow-hidden.bg-repeat.select-none(
    data-darkmode-ignore="true"
    class="h-[100dvh] landscape:p-1 landscape:md:p-4 inset-0 bg-[url('/images/board/papyrus-tile_128x128.webp')]"
    style="padding-top: env(safe-area-inset-top);"
    :class="{ 'p-0': isMobilePortrait }"
  )
    //- Emergency Aid Overlay
    EmergencyAid(
      v-if="showEmergencyAid"
      :is-visible="showEmergencyAid"
      :amount="aidAmount"
      @close="showEmergencyAid = false"
    )

    //- Animation Overlay
    div.flying-card(v-if="flyingCard" :style="flyingStyle")
      CardDisplay(:card="flyingCard.card" :show-tint="false")

    //- Main Layout: flex-col for mobile portrait, flex-row for landscape
    div.flex.w-full.max-w-6xl.min-h-0(
      class="flex-col landscape:flex-row gap-1 sm:gap-4 h-full"
    )
      //- THE BOOK (Flex grow but must be able to shrink to avoid pushing buttons out)
      div.relative.shadow-inner.flex.flex-col.flex-grow.min-h-0(class="overflow-hidden")
        img.absolute.inset-0.w-full.h-full.object-fill(src="/images/bg/book_512x401.webp")

        //- Inner scrollable area for cards
        div.flex-1.relative.z-10.ml-1.px-5.pt-12.flex.flex-wrap.justify-center.content-start.overflow-y-auto(
          class="gap-x-4 gap-y-4 sm:gap-x-10 sm:pt-12 md:px-12 md:pt-16 pb-12"
          :class="{ 'gap-y-6': isMobileLandscape, ' !pt-13 !gap-x-2': isMobilePortrait, 'sm:pt-14 md:pt-[5rem] !gap-x-4': !isMobileLandscape && windowHeight > 600 && windowWidth > 700 }"
        )
          div.relative.group(
            v-for="card in paginatedCollection"
            :key="card.id"
            :ref="el => cardRefs[card.id] = el"
            @click="addToDeck(card, $event)"
            class="card-container flex items-center justify-center cursor-pointer"
            :class="[\
              card.count === 0 ? 'out-of-stock' : '',\
              (showHint && !isHintDisabled && selectedDeck.length < 5 && card.id === hintTargetId) ? 'hint-bounce' : ''\
            ]"
          )
            div.w-full.h-full.transition-transform.duration-200(class="group-hover:scale-105 active:scale-95")
              CardDisplay(:card="card" :is-selection="true" :show-tint="false")

            div.counter-bubble.absolute.-bottom-1.-right-1.text-white.rounded-full.flex.items-center.justify-center.font-bold.z-20(
              class="w-4 h-4 text-[9px] sm:w-5 sm:h-5 sm:text-[10px]"
              :class="card.count === 0 ? 'bg-slate-400' : 'bg-slate-600'"
            )
              span {{ card.count }}

        //- Pagination Controls (Absolute positioned within the book container)
        FIconButton(
          icon="left"
          class="absolute !right-auto !top-1/2 -translate-y-[100%] text-orange-900 hover:scale-125 transition-transform disabled:opacity-20"
          :class="{ '!left-[1%] !scale-70 !-translate-y-[70%]': isMobileLandscape, '!left-[0%] !-translate-y-[80%]': isMobilePortrait, '!left-[2.5%]': !isMobileLandscape && !isMobilePortrait }"
          @click="prevPage"
          :disabled="currentPage === 0"
        )

        div(
          class="bottom-[8%]"
          :class="{ '!bottom-[9%]': !isMobileLandscape && windowWidth > 800 }"
        ).absolute.left-0.right-0.flex.justify-center.items-center.gap-6.z-30

          div.text-center.font-bold.text-shadow(class="text-amber-500 text-[10px] sm:text-xs")
            | {{ currentPage + 1 }} / {{ totalPages }}

        FIconButton(
          icon="right"
          class="absolute !right-[3%] !top-1/2 -translate-y-[100%] text-orange-900 hover:scale-125 transition-transform disabled:opacity-20"
          :class="{ '!right-[0%] -mr-[2%] !scale-70 !-translate-y-[70%]': isMobileLandscape, '!right-[0%] -mr-[4%] !-translate-y-[80%]': isMobilePortrait, '!right-[2%] -mr-[.5%]': !isMobileLandscape && !isMobilePortrait }"
          @click="nextPage"
          :disabled="currentPage >= totalPages - 1"
        )

      //- Sidebar / Deck Dock (Shrink-0 prevents this being squeezed on small screens)
      div.flex.flex-col.gap-0.shrink-0.items-center.justify-between(
        class="portrait:w-full portrait:h-auto portrait:pb-2 landscape:w-32 landscape:sm:w-40 landscape:md:w-48"
      )
        //- Deck Area
        div.flex.flex-col.items-center.w-full.deck-target(
          class="portrait:justify-center min-h-[80px]"
        )
          div.flex.w-full.justify-center.relative.z-40.hand-interact-zone(
            class="landscape:flex-col landscape:items-center landscape:justify-start"
          )
            PlayerHandCard(
              :cards="selectedDeck"
              :is-active="true"
              :selected-id="null"
              @select="removeFromDeck"
              @click-card="removeFromDeck"
              @remove="removeFromDeck"
            )

        //- Action Buttons (Always at bottom in portrait)
        div.flex.gap-1.w-full.px-2(class="portrait:flex-row landscape:flex-col landscape:mb-4")
          FButton.text-xs.flex-1(
            type="secondary"
            :size="'md'"
            class="sm:text-sm"
            @click="router.push({ name: 'main-menu'})"
          ) {{ t('back') }}
          FButton.text-xs.flex-1.btn-battle(
            :size="'md'"
            class="sm:text-sm"
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
import type { GameCard } from '@/types/game'
import FButton from '@/components/atoms/FButton'
import CardDisplay from '@/components/CardDisplay'
import PlayerHandCard from '@/components/PlayerHandCard'
import EmergencyAid from '@/components/organisms/EmergencyAid'
import { playerSelection, isPracticeMatch, isDbInitialized, isDebug, isCampaignTest } from '@/use/useMatch'
import useModels, { modelImgPath, type StoredCollectionCard } from '@/use/useModels'
import useUser, { orientation, isMobilePortrait, isMobileLandscape } from '@/use/useUser'
import { windowWidth, windowHeight } from '@/use/useUser'
import { mobileCheck } from '@/utils/function'
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

// Hint state
const showHint = ref<boolean>(false)
const isHintDisabled = ref<boolean>(false)
let hintTimeout: ReturnType<typeof setTimeout> | null = null

const startHintTimer = () => {
  clearHint()
  if (!isHintDisabled.value && selectedDeck.value.length < 5) {
    hintTimeout = setTimeout(() => {
      showHint.value = true
    }, 5000)
  }
}

const clearHint = () => {
  if (hintTimeout) {
    clearTimeout(hintTimeout)
    hintTimeout = null
  }
  showHint.value = false
}

// Find the first card on the current page that has at least 1 count
const hintTargetId = computed(() => {
  return paginatedCollection.value.find(c => c.count > 0)?.id || null
})

const updateDimensions = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', updateDimensions)
  window.scrollTo(0, 0)
  const isPractice: boolean = route?.query?.practice === true
  isPracticeMatch.value = isPractice || isPracticeMatch.value

  // Start the interaction hint timer
  startHintTimer()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions)
  // window.removeEventListener('orientationchange', delayedResize)
  clearHint()
})

watch(userCollection, () => {
  if (!userCollection.value) return

  inventory.value = getSortedCollection()
}, { immediate: true })

watch(userHand, () => {
  const hand = typeof userHand.value === 'string' ? JSON.parse(userHand.value) : userHand.value
  selectedDeck.value = Array.isArray(hand) ? [...hand] : []
}, { immediate: true })

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
  const totalCount = coll?.reduce((sum, c) => sum + c.count, 0) || 0
  const hand = typeof userHand.value === 'string' ? JSON.parse(userHand.value) : userHand.value
  const totalInSelection = hand.length
  return Math.min(7 - (totalCount + totalInSelection), 3)
})
const isStackedSize = ref('50px')
const isStackedMargin = ref('-22px')

const itemsPerPage = computed(() => {
  const isLandScape = mobileCheck() && windowWidth.value > windowHeight.value ? 'landscape' : 'portrait'

  if (isLandScape) {
    isStackedSize.value = '50px'
    isStackedMargin.value = '-22px'
  } else {
    isStackedSize.value = '70px'
    isStackedMargin.value = '0px'
  }
  if (windowHeight.value > 600 && windowWidth.value > 1100) return 24
  if (windowHeight.value > 600 && windowWidth.value > 980) return 20
  if (windowHeight.value > 600 && windowWidth.value > 600) return 16
  if (isMobilePortrait || isMobileLandscape) return 12
  return windowWidth.value < 801 ? 8 : 16
})

const collection = computed(() => inventory.value.map(card => ({
  ...card, owner: 'player' as const, image: modelImgPath(card.id, card.element)
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
    saveCollection(inventory.value)

    // Resume hint timer if we just dropped below full capacity and haven't manually interacted with collection yet
    if (selectedDeck.value.length < 5 && !isHintDisabled.value) {
      startHintTimer()
    }
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

  if (isPracticeMatch.value) {
    router.push({ name: 'match' })
  } else {
    router.push({ name: 'campaign' })
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
  width: calc(30% - 8px)
  aspect-ratio: 1 / 1
  @media (min-width: 450px)
    width: calc(27% - 8px)
  @media (max-width: 800px) and (orientation: landscape)
    width: calc(15% - 8px)
  @media (min-width: 801px)
    width: calc(24% - 18px)
  @media (min-width: 980px)
    width: calc(18% - 18px)
  @media (min-width: 1100px)
    width: calc(15% - 18px)

.hand-interact-zone
  pointer-events: auto !important

  :deep(*)
    pointer-events: auto !important

:deep(.card-wrapper)
  width: 52px !important
  height: 52px !important
  transition: transform 0.2s ease
  cursor: pointer !important
  pointer-events: auto !important

  &:hover
    z-index: 100
    transform: scale(1.1)

  @media (max-width: 800px) and (orientation: landscape)
    width: v-bind(isStackedSize) !important
    height: v-bind(isStackedSize) !important
    margin-top: v-bind(isStackedMargin)
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
de:
  ready: "Bereit"
</i18n>