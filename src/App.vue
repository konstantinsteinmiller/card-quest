<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import useUser, { isCrazyWeb, orientation } from '@/use/useUser'
import { mobileCheck } from '@/utils/function'
import RuleExplainModal from '@/components/organisms/RuleExplainModal'
import { useMusic } from '@/use/useSound'
import { useExtensionGuard } from '@/use/useExtensionGuard'
import { windowWidth, windowHeight } from '@/use/useUser'
import useCheats from '@/use/useCheats'
import useAssets from '@/use/useAssets'
import { isDbInitialized } from '@/use/useMatch'
import {
  isSdkActive,
  setCrazyMuted,
  onCrazyMuteChange
} from '@/use/useCrazyGames'

const { initMusic, pauseMusic, continueMusic } = useMusic()
useExtensionGuard()
useCheats()
const { resourceCache } = useAssets()

// ─── CrazyGames mute sync (global, route-independent) ──────────────────────
//
// Lives in App.vue (rather than MainMenu) so the platform-side mute toggle
// from the CrazyGames chrome controls in-game audio no matter which view
// the player is currently on.
//
// Direction of truth: the CG SDK is the source of truth for the mute state
// — there's no public setter, the platform chrome owns it. We listen for
// changes and mirror them into our local sound/music volumes, remembering
// the previous values so we can restore them on unmute. We also propagate
// in-game mute toggles into our shared `isSdkMuted` ref so any other code
// reading it stays consistent (the SDK side won't change, but our app
// state does).

const { userSoundVolume, userMusicVolume, setSettingValue } = useUser()

const isMuted = computed(() =>
  userMusicVolume.value === 0 && userSoundVolume.value === 0
)
const prevMusicVol = ref(userMusicVolume.value || 0.5)
const prevSoundVol = ref(userSoundVolume.value || 0.7)

const applyLocalMuteToVolumes = (muted: boolean) => {
  if (muted && !isMuted.value) {
    // Save current values before zeroing them so we can restore on unmute.
    if (userMusicVolume.value > 0) prevMusicVol.value = userMusicVolume.value
    if (userSoundVolume.value > 0) prevSoundVol.value = userSoundVolume.value
    setSettingValue('music', 0)
    setSettingValue('sound', 0)
  } else if (!muted && isMuted.value) {
    setSettingValue('music', prevMusicVol.value || 0.5)
    setSettingValue('sound', prevSoundVol.value || 0.7)
  }
}

let unsubscribeCrazyMute: (() => void) | null = null

// Subscribe to platform-side mute toggles. `onCrazyMuteChange` immediately
// replays the *current* SDK mute state to the new subscriber (when known),
// so this single hook covers both the initial sync and future toggles —
// no separate "apply once" watcher needed.
//
// We do still gate on `isDbInitialized` for the very first apply so we
// don't fight the indexedDB hydration: if the DB isn't ready, we defer
// the apply until it is. After that, every subsequent SDK toggle goes
// through immediately.
const pendingInitialMute = ref<boolean | null>(null)

const handleSdkMute = (muted: boolean) => {
  if (!isDbInitialized.value) {
    pendingInitialMute.value = muted
    return
  }
  applyLocalMuteToVolumes(muted)
}

watch(isDbInitialized, (ready) => {
  if (!ready || pendingInitialMute.value === null) return
  applyLocalMuteToVolumes(pendingInitialMute.value)
  pendingInitialMute.value = null
})

onMounted(() => {
  unsubscribeCrazyMute = onCrazyMuteChange(handleSdkMute)
})
onUnmounted(() => {
  unsubscribeCrazyMute?.()
  unsubscribeCrazyMute = null
})

// Forward in-game mute toggles into the shared `isSdkMuted` ref so the
// rest of the app stays coherent. There's no platform-side setter to call.
watch(isMuted, (muted) => {
  if (isSdkActive.value) setCrazyMuted(muted)
})


initMusic('adventure_main-menu.mp3')

const portraitQuery = window.matchMedia('(orientation: portrait)')
const onTouchStart = (event: any) => {
  if (event.touches.length > 1) {
    event.preventDefault() // Block multitouch (pinch)
  }
}

const onGestureStart = (event: any) => {
  event.preventDefault() // Block specific Safari zoom gestures
}
const onOrientationChange = (event: any) => {
  if (event.matches) {
    orientation.value = 'portrait'
  } else {
    orientation.value = 'landscape'
  }
}

const onContextMenu = (event: any) => {
  event.preventDefault() // Block right-click context menu
}

const handleVisibilityChange = async () => {
  try {
    if (document.hidden) {
      pauseMusic()
      // console.log('App moved to background - Pausing Music')
    } else {
      continueMusic()
      // console.log('App back in focus - Resuming Music')
    }
  } catch (error) {
    // console.log('error: ', error)
  }
}

const updateGlobalDimensions = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
  orientation.value = mobileCheck() && windowWidth.value > windowHeight.value ? 'landscape' : 'portrait'
}

const dimensionsInterval = ref<any | null>(null)
// Ensure listeners are active
const delayedUpdateGlobalDimensions = () => setTimeout(updateGlobalDimensions, 300)
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateGlobalDimensions)

    dimensionsInterval.value = setInterval(() => {
      windowWidth.value = window.innerWidth
      windowHeight.value = window.innerHeight
    }, 400)
    window.addEventListener('orientationchange', delayedUpdateGlobalDimensions)
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }
})
onUnmounted(() => {
  window.removeEventListener('resize', updateGlobalDimensions)
  window.removeEventListener('orientationchange', delayedUpdateGlobalDimensions)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  clearInterval(dimensionsInterval.value)
})

onMounted(() => {
  document.addEventListener('contextmenu', onContextMenu)
  document.addEventListener('touchstart', onTouchStart, { passive: false })
  document.addEventListener('gesturestart', onGestureStart)
  portraitQuery.addEventListener('change', onOrientationChange)
})
onUnmounted(() => {
  document.removeEventListener('contextmenu', onContextMenu)
  document.removeEventListener('touchstart', onTouchStart, { passive: false })
  document.removeEventListener('gesturestart', onGestureStart)
  portraitQuery.removeEventListener('change', onOrientationChange)
})

function isCrazyGamesUrl() {
  const hostname = window.location.hostname
  const parts = hostname.split('.')
  if (parts.includes('localhost')) return true
  const idx = parts.indexOf('crazygames')
  return idx !== -1 && idx >= parts.length - 3
}

const allowedToShow = computed(() => (isCrazyWeb && isCrazyGamesUrl()) || !isCrazyWeb)
</script>

<template lang="pug">
  div(v-if="allowedToShow" id="app-root").h-screen.w-screen.app-container.root-protection.game-ui-immune
    RouterView

    RuleExplainModal
  div.relative.w-full.h-full(v-else-if="isCrazyWeb")
    h1.absolute(class="left-1/2 -translate-x-[50%] top-1/2 -translate-y-[50%] text-3xl") This game is only available on
      span.ml-2.text-amber-500 CrazyGames.com
</template>

<style lang="sass">
*
  font-family: 'Ribeye', cursive
  user-select: none
  // Standard
  -webkit-user-select: none
  // Safari
  -moz-user-select: none
  // Firefox
  -ms-user-select: none
  // IE10+

  // Optional: prevent the "tap highlight" color on mobile
  -webkit-tap-highlight-color: transparent

img
  pointer-events: none
</style>