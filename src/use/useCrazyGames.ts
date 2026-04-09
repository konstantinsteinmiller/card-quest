// ─── CrazyGames SDK integration ────────────────────────────────────────────
//
// Encapsulates everything the rest of the app needs to talk to the
// CrazyGames SDK loaded via a <script> tag in index.html:
//
//   1. initCrazyGames() — probes `window.CrazyGames.SDK`, calls SDK.init(),
//      and flips `isSdkActive` to true iff the SDK reports a real CrazyGames
//      environment ('crazygames' for live iframe, 'local' for local dev
//      tooling) AND the build-time `isCrazyWeb` flag is set
//      (VITE_APP_CRAZY_WEB=true).
//
//   2. SDK data persistence — `getSdkItem` / `setSdkItem` / `removeSdkItem`
//      wrap the SDK's data module so the rest of the app can mirror its
//      indexedDB writes into the cloud-synced CrazyGames key/value store
//      when the SDK is active. They're no-ops outside CrazyGames.
//
//   3. Gameplay lifecycle — `startGameplay()` / `stopGameplay()` wrap the
//      SDK's `game.gameplayStart()` / `gameplayStop()` hooks, which let
//      CrazyGames know when the player is actually in a match (vs menus).
//
//   4. `showRewardedAd()` — a Promise-based wrapper around the SDK's
//      `ad.requestAd('rewarded', …)` callback API. Resolves `true` only when
//      the video played all the way through, so callers can safely grant the
//      reward on success and be silent on failure. Gated by both
//      `isSdkActive` and `isCrazyGamesFullRelease` so we never serve ads in
//      a non-live build.
//
//   5. Mute / user / locale capture — best-effort reads of
//      `sdk.game.muteAudio`, `sdk.user.getUser()`, and
//      `sdk.user.systemInfo.locale` for components to mirror the platform
//      mute toggle, display the player's CrazyGames username, and pre-select
//      the user's preferred language.
//
// Outside of a CrazyGames build the module is inert: `isSdkActive` stays
// false, the data helpers no-op, and `showRewardedAd()` resolves false.

import { ref } from 'vue'

// Read these directly from import.meta.env (rather than re-importing them
// from `useUser` / `useMatch`) to avoid a circular import: `useUserDb`
// imports the data helpers from this module, and `useUser` eagerly
// instantiates `useUserDb` at module load.
const isCrazyWeb = import.meta.env.VITE_APP_CRAZY_WEB === 'true'
const isCrazyGamesFullRelease = import.meta.env.VITE_APP_CRAZY_GAMES_FULL_RELEASE === 'true'

// The CrazyGames SDK is loaded globally via a script tag in index.html.
// We interact with it entirely through `window.CrazyGames.SDK`, so the
// types are intentionally loose — we only touch the members we need.
declare global {
  interface Window {
    CrazyGames?: {
      SDK?: any
    }
  }
}

/** Reactive: true when the SDK finished init AND we're in a crazy-web build. */
export const isSdkActive = ref(false)

/**
 * Last known mute state reported by the CrazyGames SDK. `null` until we've
 * either read `sdk.game.muteAudio` at init time or received an event from
 * `sdk.game.addMuteListener`. Components can mirror this into their own
 * volume settings to keep the platform-level mute toggle in sync.
 */
export const isSdkMuted = ref<boolean | null>(null)

/**
 * CrazyGames-side display name for the current player, when available.
 * Falls back to `null` for anonymous sessions or non-crazy builds — callers
 * should default to a generic label.
 */
export const crazyPlayerName = ref<string | null>(null)

/**
 * Two-letter language code derived from `sdk.user.systemInfo.locale`
 * (e.g. `en` from `en-US`). `null` when the SDK didn't expose one.
 */
export const crazyLocale = ref<string | null>(null)

// Internal handles — captured during init() and reused by the rest of the
// module. Keeping them here (rather than re-reading window.CrazyGames.SDK on
// every call) makes the intent explicit and lets us no-op cleanly when the
// script tag never loaded.
let sdk: any = null
let initialized = false
let gameplayActive = false

const getSdk = (): any => (typeof window !== 'undefined' ? window.CrazyGames?.SDK ?? null : null)

const isActiveEnv = (s: any): boolean => {
  if (!s) return false
  const env = s.environment
  // 'crazygames' — running inside an iframe on crazygames.com
  // 'local'      — local dev via `crazygames-sdk` CLI tool
  // 'disabled'   — plain localhost, no SDK tooling
  return (env === 'crazygames' || env === 'local') && isCrazyWeb
}

// ─── Init ──────────────────────────────────────────────────────────────────

/**
 * Initialize the SDK. Should be awaited from main.ts *before* the Vue app
 * is created so that downstream module-level code (in particular the
 * useUserDb hydration step) can synchronously consult `isSdkActive` and
 * pull persisted state from the SDK before any other module reads it.
 *
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export const initCrazyGames = async (): Promise<void> => {
  if (initialized) return
  initialized = true

  const candidate = getSdk()
  if (!candidate) {
    // Script tag didn't load (blocked, offline, or plain non-CG build).
    return
  }

  try {
    await candidate.init?.()
  } catch (e) {
    console.warn('[crazygames] SDK init failed', e)
    return
  }

  if (!isActiveEnv(candidate)) {
    // Non-crazy-web build, or running in a 'disabled' environment.
    // Leave persistence alone and keep `isSdkActive` false.
    return
  }

  sdk = candidate
  isSdkActive.value = true

  await captureSdkProfile()
  registerMuteListener()
}

// ─── Profile / settings capture ───────────────────────────────────────────

/**
 * Best-effort read of mute state, player identity, and locale from the SDK.
 * All branches are wrapped in try/catch so a single missing field doesn't
 * abort the rest — the SDK surface differs slightly between builds.
 */
const captureSdkProfile = async (): Promise<void> => {
  // Initial mute state. Per the CG SDK v3 docs, the canonical read path is
  // the property `sdk.game.settings.muteAudio` ("please disable the game
  // audio if this is true"). We also defensively check `sdk.game.muteAudio`
  // and an `isMuted()` method in case the SDK surface drifts between
  // builds, but the `settings.muteAudio` path is the documented one.
  try {
    let m: unknown = sdk?.game?.settings?.muteAudio
    if (typeof m !== 'boolean') m = sdk?.game?.muteAudio
    if (typeof m !== 'boolean' && typeof sdk?.game?.isMuted === 'function') {
      m = sdk.game.isMuted()
    }
    if (typeof m === 'boolean') isSdkMuted.value = m
  } catch (e) {
    console.warn('[crazygames] read settings.muteAudio failed', e)
  }

  // Player display name. `sdk.user.getUser()` resolves to `null` for
  // anonymous sessions, so we only fill the ref when a real username comes
  // back.
  try {
    const u = await sdk?.user?.getUser?.()
    const name = typeof u?.username === 'string' ? u.username.trim() : ''
    if (name) crazyPlayerName.value = name
  } catch (e) {
    console.warn('[crazygames] getUser failed', e)
  }

  // Locale. Newer SDK builds expose `systemInfo` as a property; older ones
  // expose a `getSystemInfo()` async accessor. We try the property first and
  // fall back to the method, then normalize whatever we find to its
  // language sub-tag (`en-US` → `en`).
  try {
    let info: any = sdk?.user?.systemInfo
    if (!info && typeof sdk?.user?.getSystemInfo === 'function') {
      info = await sdk.user.getSystemInfo()
    }
    const raw =
      info?.locale ??
      info?.userLocale ??
      info?.language ??
      null
    if (typeof raw === 'string' && raw.length >= 2) {
      crazyLocale.value = raw.split(/[-_]/)[0]!.toLowerCase()
    }
  } catch (e) {
    console.warn('[crazygames] systemInfo locale read failed', e)
  }
}

// ─── SDK data module ──────────────────────────────────────────────────────
//
// Thin wrappers around `sdk.data.{getItem,setItem,removeItem}`. They are
// safe to call regardless of SDK state — when inactive they no-op (and
// `getSdkItem` resolves to null) so callers don't need their own guards.

export const getSdkItem = async (key: string): Promise<string | null> => {
  if (!sdk?.data?.getItem) return null
  try {
    const v = await sdk.data.getItem(key)
    return v == null ? null : String(v)
  } catch (e) {
    console.warn(`[crazygames] data.getItem("${key}") failed`, e)
    return null
  }
}

export const setSdkItem = (key: string, value: string): void => {
  if (!sdk?.data?.setItem) return
  try {
    sdk.data.setItem(key, value)
  } catch (e) {
    console.warn(`[crazygames] data.setItem("${key}") failed`, e)
  }
}

export const removeSdkItem = (key: string): void => {
  if (!sdk?.data?.removeItem) return
  try {
    sdk.data.removeItem(key)
  } catch (e) {
    console.warn(`[crazygames] data.removeItem("${key}") failed`, e)
  }
}

// ─── Gameplay lifecycle ───────────────────────────────────────────────────

/**
 * Notify CrazyGames that interactive gameplay is starting. Idempotent.
 * Call when the player enters a match (after assets are loaded and the
 * game is actually playable).
 */
export const startGameplay = (): void => {
  if (!sdk || gameplayActive) return
  try {
    sdk.game?.gameplayStart?.()
    gameplayActive = true
  } catch (e) {
    console.warn('[crazygames] gameplayStart failed', e)
  }
}

/**
 * Notify CrazyGames that gameplay has ended. Idempotent.
 * Call when leaving the arena, opening a blocking menu, or mid-ad.
 */
export const stopGameplay = (): void => {
  if (!sdk || !gameplayActive) return
  try {
    sdk.game?.gameplayStop?.()
    gameplayActive = false
  } catch (e) {
    console.warn('[crazygames] gameplayStop failed', e)
  }
}

// ─── Mute sync ────────────────────────────────────────────────────────────

type MuteCallback = (muted: boolean) => void
const muteListeners = new Set<MuteCallback>()

const registerMuteListener = (): void => {
  // Per the CG SDK v3 docs, the supported way to react to mute changes is
  // `sdk.game.addSettingsChangeListener(listener)`, where `listener` is
  // called with the *full settings object* (not just a boolean) every time
  // any game setting changes. We extract `muteAudio` from that object.
  //
  // We keep a defensive `addMuteListener` branch for older shims, but the
  // settings-change path is the documented one and the only one that
  // actually fires in the live SDK.
  if (!sdk?.game) return

  const handleMuteChange = (muted: boolean) => {
    if (isSdkMuted.value === muted) return
    isSdkMuted.value = muted
    muteListeners.forEach(cb => {
      try {
        cb(muted)
      } catch (e) {
        console.warn('[crazygames] mute callback threw', e)
      }
    })
  }

  if (typeof sdk.game.addSettingsChangeListener === 'function') {
    try {
      sdk.game.addSettingsChangeListener((newSettings: any) => {
        const m = newSettings?.muteAudio
        if (typeof m === 'boolean') handleMuteChange(m)
      })
    } catch (e) {
      console.warn('[crazygames] addSettingsChangeListener failed', e)
    }
  } else if (typeof sdk.game.addMuteListener === 'function') {
    // Legacy / shim fallback.
    try {
      sdk.game.addMuteListener((muted: boolean) => handleMuteChange(!!muted))
    } catch (e) {
      console.warn('[crazygames] addMuteListener failed', e)
    }
  }
}

/**
 * Subscribe to CrazyGames-side mute toggles. The listener fires whenever
 * the platform chrome (or another part of the page) flips the mute state,
 * letting components mirror it into their own audio settings.
 *
 * Returns an unsubscribe function. When the SDK isn't active, the callback
 * is never invoked and the unsubscribe is a no-op.
 */
export const onCrazyMuteChange = (cb: MuteCallback): (() => void) => {
  muteListeners.add(cb)
  // Replay the current state to the new subscriber so it doesn't miss the
  // initial mute (the addMuteListener callback only fires on subsequent
  // changes, and subscribers may attach after captureSdkProfile finished).
  if (isSdkMuted.value !== null) {
    try {
      cb(isSdkMuted.value)
    } catch (e) {
      console.warn('[crazygames] mute replay callback threw', e)
    }
  }
  return () => muteListeners.delete(cb)
}

/**
 * Record an in-game mute toggle so any code reading `isSdkMuted` sees the
 * new value. NOTE: the CrazyGames SDK v3 has no public setter for the
 * platform-level mute — that toggle is owned by CG chrome and only flows
 * one-way (platform → game) through `addMuteListener`. We update our local
 * ref so internal consumers stay coherent, but we no longer attempt to
 * write back into the SDK (the previous property assignments were silently
 * failing on the real SDK surface). Safe to call when the SDK is inactive.
 */
export const setCrazyMuted = (muted: boolean): void => {
  isSdkMuted.value = muted
}

// ─── Rewarded video ads ───────────────────────────────────────────────────

/**
 * True only when we're allowed to actually play SDK video ads: the SDK
 * must be initialized and the build flag for the public CrazyGames release
 * must be set. Use this to gate UI that triggers ads (e.g. "watch ad for
 * cards" buttons) so we don't show them in dev or demo builds.
 */
export const canShowVideoAds = (): boolean =>
  isSdkActive.value && isCrazyGamesFullRelease

/**
 * Shows a rewarded video ad via the CrazyGames SDK. Resolves `true` iff the
 * ad played all the way through — callers should only grant the reward on
 * a `true` result.
 *
 * Always resolves `false` (and is a no-op) outside the full CrazyGames
 * release or when the SDK is not active, so callers can use it
 * unconditionally without guard checks.
 */
export const showRewardedAd = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!canShowVideoAds() || !sdk) {
      resolve(false)
      return
    }

    // CrazyGames recommends pausing gameplay while an ad plays so that
    // sounds + timers don't run behind the video. We explicitly restart
    // gameplay on both the success and error paths so we never leave the
    // game stuck in a paused state.
    const wasInGameplay = gameplayActive
    const resumeAfterAd = () => {
      if (wasInGameplay) startGameplay()
    }

    try {
      sdk.ad?.requestAd?.('rewarded', {
        adStarted: () => {
          if (wasInGameplay) stopGameplay()
        },
        adFinished: () => {
          resumeAfterAd()
          resolve(true)
        },
        adError: (err: unknown) => {
          console.warn('[crazygames] rewarded ad error', err)
          resumeAfterAd()
          resolve(false)
        }
      })
    } catch (e) {
      console.warn('[crazygames] requestAd threw', e)
      resumeAfterAd()
      resolve(false)
    }
  })
}

/**
 * Shows a midgame (interstitial) video ad via the CrazyGames SDK. Resolves
 * when the ad finishes or errors out — callers should `await` it before
 * continuing to the next match so gameplay doesn't resume behind the ad.
 *
 * Like `showRewardedAd`, this is gated on `canShowVideoAds()` so it's a
 * silent no-op outside the full CrazyGames release.
 */
export const showMidgameAd = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!canShowVideoAds() || !sdk) {
      resolve()
      return
    }

    const wasInGameplay = gameplayActive
    const resumeAfterAd = () => {
      if (wasInGameplay) startGameplay()
      resolve()
    }

    try {
      sdk.ad?.requestAd?.('midgame', {
        adStarted: () => {
          if (wasInGameplay) stopGameplay()
        },
        adFinished: () => {
          resumeAfterAd()
        },
        adError: (err: unknown) => {
          console.warn('[crazygames] midgame ad error', err)
          resumeAfterAd()
        }
      })
    } catch (e) {
      console.warn('[crazygames] requestAd(midgame) threw', e)
      resumeAfterAd()
    }
  })
}

// ─── Default export (composable-style convenience) ───────────────────────

const useCrazyGames = () => ({
  isSdkActive,
  isSdkMuted,
  crazyPlayerName,
  crazyLocale,
  initCrazyGames,
  startGameplay,
  stopGameplay,
  showRewardedAd,
  showMidgameAd,
  canShowVideoAds,
  onCrazyMuteChange,
  setCrazyMuted,
  getSdkItem,
  setSdkItem,
  removeSdkItem
})

export default useCrazyGames
