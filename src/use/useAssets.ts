import { ref } from 'vue'
import { modelImgPath } from '@/use/useModels.ts'
import { prependBaseUrl } from '@/utils/function.ts'

// Shared state so it can be accessed by both the loader and the progress component
const loadingProgress = ref(0)
const areAllAssetsLoaded = ref(false)

// THIS IS THE KEY: A persistent memory reference
const resourceCache = {
  images: new Map<string, HTMLImageElement>(),
  audio: new Map<string, HTMLAudioElement>()
}

const STATIC_IMAGES = [
  'images/logo/logo_512x512.webp',
  'images/bg/book_800x609.webp',
  'images/bg/campaign-map_800x710.webp',
  'images/bg/campaign-map_800x1600.webp',
  'images/bg/campaign-map_1600x800.webp',
  'images/bg/oak_600x588.webp',
  'images/board/field-inner_256x256.webp',
  'images/board/field-outer_256x256.webp',
  'images/frames/fancy-frame_512x512.png',
  'images/frames/frame_papyrus_640x64.webp',
  'images/icons/difficulty-icon_128x128.webp',
  'images/icons/settings-icon_128x128.webp',
  'images/icons/rules/all-rule_256x256.webp',
  'images/icons/rules/combo-rule_256x256.webp',
  'images/icons/rules/conquered-rule_256x256.webp',
  'images/icons/rules/elements-rule_128x128.webp',
  'images/icons/rules/high-rule_256x256.webp',
  'images/icons/rules/low-rule_256x256.webp',
  'images/icons/rules/one-rule_256x256.webp',
  'images/icons/rules/open-rule_256x256.webp',
  'images/icons/rules/plus-rule_256x256.webp',
  'images/icons/rules/random-rule_256x256.webp',
  'images/icons/rules/same-rule_256x256.webp',
  'images/icons/sound-icon_128x128.webp',
  'images/back-face_256x256.webp'
]

const BG_IMAGE = [
  '/images/board/papyrus-tile_128x128.webp',
  'images/board/papyrus-tile_128x128.webp',
  './images/board/papyrus-tile_128x128.webp',
  '/images/bg/bg_1024x1024.webp',
  'images/bg/bg_1024x1024.webp',
  './images/bg/bg_1024x1024.webp',
  '/images/back-face_256x256.webp',
  'images/back-face_256x256.webp',
  './images/back-face_256x256.webp'
]

// 1. We define the raw paths without any prefixes
const RAW_MODEL_DATA = [
  {
    'id': 'angel-old',
    'element': 'air'
  },
  {
    'id': 'gorilla-middle',
    'element': 'air'
  },
  {
    'id': 'gorilla-old',
    'element': 'air'
  },
  {
    'id': 'griffin-middle',
    'element': 'air'
  },
  {
    'id': 'postman-middle',
    'element': 'air'
  },
  {
    'id': 'asha-old',
    'element': 'dark'
  },
  {
    'id': 'cat-middle',
    'element': 'dark'
  },
  {
    'id': 'cosmica-young',
    'element': 'dark'
  },
  {
    'id': 'demon-middle',
    'element': 'dark'
  },
  {
    'id': 'demon-young',
    'element': 'dark'
  },
  {
    'id': 'eclipse-old',
    'element': 'dark'
  },
  {
    'id': 'hag-middle',
    'element': 'dark'
  },
  {
    'id': 'harbringer-middle',
    'element': 'dark'
  },
  {
    'id': 'bear-middle',
    'element': 'earth'
  },
  {
    'id': 'gargoyle-middle',
    'element': 'earth'
  },
  {
    'id': 'gargoyle-old',
    'element': 'earth'
  },
  {
    'id': 'gargoyle-young',
    'element': 'earth'
  },
  {
    'id': 'gruffalo-young',
    'element': 'earth'
  },
  {
    'id': 'deer-middle',
    'element': 'energy'
  },
  {
    'id': 'eel-middle',
    'element': 'energy'
  },
  {
    'id': 'eel-young',
    'element': 'energy'
  },
  {
    'id': 'female-middle',
    'element': 'energy'
  },
  {
    'id': 'female-old',
    'element': 'energy'
  },
  {
    'id': 'female-young',
    'element': 'energy'
  },
  {
    'id': 'dragon-middle',
    'element': 'fire'
  },
  {
    'id': 'dragon-old',
    'element': 'fire'
  },
  {
    'id': 'dragon-young',
    'element': 'fire'
  },
  {
    'id': 'fox-middle',
    'element': 'fire'
  },
  {
    'id': 'fox-old',
    'element': 'fire'
  },
  {
    'id': 'harpy-middle',
    'element': 'fire'
  },
  {
    'id': 'mammoth-middle',
    'element': 'ice'
  },
  {
    'id': 'mammoth-young',
    'element': 'ice'
  },
  {
    'id': 'snowflower-middle',
    'element': 'ice'
  },
  {
    'id': 'snowman-middle',
    'element': 'ice'
  },
  {
    'id': 'snowman-old',
    'element': 'ice'
  },
  {
    'id': 'snowman-young',
    'element': 'ice'
  },
  {
    'id': 'yeti-middle',
    'element': 'ice'
  },
  {
    'id': 'yeti-young',
    'element': 'ice'
  },
  {
    'id': 'cosmic-middle',
    'element': 'light'
  },
  {
    'id': 'cosmic-old',
    'element': 'light'
  },
  {
    'id': 'cosmic-young',
    'element': 'light'
  },
  {
    'id': 'pegasus-middle',
    'element': 'light'
  },
  {
    'id': 'puppet-young',
    'element': 'light'
  },
  {
    'id': 'starlight-old',
    'element': 'light'
  },
  {
    'id': 'armadillo-middle',
    'element': 'metal'
  },
  {
    'id': 'armadillo-old',
    'element': 'metal'
  },
  {
    'id': 'scorpion-middle',
    'element': 'metal'
  },
  {
    'id': 'scorpion-old',
    'element': 'metal'
  },
  {
    'id': 'scorpion-young',
    'element': 'metal'
  },
  {
    'id': 'butterfly-middle',
    'element': 'nature'
  },
  {
    'id': 'butterfly-young',
    'element': 'nature'
  },
  {
    'id': 'imp-middle',
    'element': 'nature'
  },
  {
    'id': 'imp-old',
    'element': 'nature'
  },
  {
    'id': 'moss-young',
    'element': 'nature'
  },
  {
    'id': 'mushroom-middle',
    'element': 'nature'
  },
  {
    'id': 'mushroom-young',
    'element': 'nature'
  },
  {
    'id': 'household-young',
    'element': 'neutral'
  },
  {
    'id': 'mouse-middle',
    'element': 'neutral'
  },
  {
    'id': 'mouse-old',
    'element': 'neutral'
  },
  {
    'id': 'mouse-young',
    'element': 'neutral'
  },
  {
    'id': 'porcupine-middle',
    'element': 'neutral'
  },
  {
    'id': 'warrior-middle',
    'element': 'neutral'
  },
  {
    'id': 'warrior-young',
    'element': 'neutral'
  },
  {
    'id': 'nightmare-middle',
    'element': 'psi'
  },
  {
    'id': 'tardigrade-middle',
    'element': 'psi'
  },
  {
    'id': 'tardigrade-old',
    'element': 'psi'
  },
  {
    'id': 'tardigrade-young',
    'element': 'psi'
  },
  {
    'id': 'wulfberry-middle',
    'element': 'psi'
  },
  {
    'id': 'mermaid-middle',
    'element': 'water'
  },
  {
    'id': 'mermaid-old',
    'element': 'water'
  },
  {
    'id': 'mermaid-young',
    'element': 'water'
  },
  {
    'id': 'piranha-middle',
    'element': 'water'
  },
  {
    'id': 'piranha-old',
    'element': 'water'
  },
  {
    'id': 'piranha-young',
    'element': 'water'
  },
  {
    'id': 'shark-middle',
    'element': 'water'
  },
  {
    'id': 'shark-young',
    'element': 'water'
  },
  {
    'id': 'sirene-young',
    'element': 'water'
  },
  {
    'id': 'turtoise-middle',
    'element': 'water'
  },
  {
    'id': 'turtoise-old',
    'element': 'water'
  },
  {
    'id': 'turtoise-young',
    'element': 'water'
  }
]

// 2. Dynamic Model Assets (Recursive Algorithm via Vite)
// This finds all webp/png/jpg files in any subfolder of /public/models/
// const modelModules = import.meta.glob([
//   '/public/models/**/*.webp',
//   '/public/models/**/*.png',
//   '/public/models/**/*.jpg'
// ])

// Clean the paths to be usable as browser URLs (remove '/public')
// const MODEL_IMAGES = Object.keys(modelModules).map(path => path.replace('/public', ''))

const SOUND_ASSETS = [
  'audio/sfx/plus.ogg',
  'audio/sfx/same.ogg',
  'audio/sfx/combo.ogg',
  'audio/sfx/turn-card.ogg',
  'audio/sfx/hover-card.ogg',
  'audio/sfx/place-card.ogg',
  'audio/sfx/draw.ogg',
  'audio/sfx/win.ogg',
  'audio/sfx/lose.ogg',
  'audio/sfx/card-pack-open.ogg',
  'audio/sfx/reward-continue.ogg'
]

const MUSIC_ASSETS = [
  'audio/music/battle.ogg',
  'audio/music/adventure_main-menu.mp3'
]

export default () => {
  const preloadAssets = async () => {
    if (areAllAssetsLoaded.value) return

    // Combine static list with the recursively found model images
    const allImages = [
      ...BG_IMAGE,
      ...STATIC_IMAGES.map(src => prependBaseUrl(src)),
      ...RAW_MODEL_DATA.map(m => modelImgPath(m.id, m.element))
    ]

    const allAssets = [
      ...allImages.map(src => ({ src, type: 'image' })),
      ...SOUND_ASSETS.map(src => prependBaseUrl(src)).map(src => ({ src, type: 'audio' })),
      ...MUSIC_ASSETS.map(src => prependBaseUrl(src)).map(src => ({ src, type: 'audio' }))
    ]

    let loadedCount = 0
    const totalCount = allAssets.length

    const updateProgress = () => {
      loadedCount++
      loadingProgress.value = Math.floor((loadedCount / totalCount) * 100)
    }

    const loadAsset = ({ src, type }: { src: string, type: string }) => {
      // If the string is already in our Map, it's already preloaded
      if (type === 'image' && resourceCache.images.has(src)) {
        loadedCount++
        loadingProgress.value = Math.floor((loadedCount / totalCount) * 100)
        return Promise.resolve()
      }

      return new Promise((resolve) => {
        if (type === 'image') {
          const img = new Image()
          img.onload = () => {
            resourceCache.images.set(src, img)
            loadedCount++
            loadingProgress.value = Math.floor((loadedCount / totalCount) * 100)
            resolve(img)
          }
          img.onerror = () => {
            console.error('Preload fail:', src)
            resolve(null)
          }
          img.src = src // This string is exactly what modelImgPath returns
        } else {
          const audio = new Audio()
          audio.oncanplaythrough = () => {
            resourceCache.audio.set(src, audio)
            loadedCount++
            loadingProgress.value = Math.floor((loadedCount / totalCount) * 100)
            resolve(audio)
          }
          audio.onerror = resolve
          audio.src = src
          audio.load()
        }
      })
    }

    try {
      // Load in chunks of 10 to avoid hammering the connection
      // which some portals flag as suspicious/DDOS
      for (let i = 0; i < allAssets.length; i += 10) {
        const chunk = allAssets.slice(i, i + 10)
        await Promise.all(chunk.map(loadAsset))
      }

      areAllAssetsLoaded.value = true
      loadingProgress.value = 100
      // console.log('resourceCache: ', resourceCache)
    } catch (error) {
      console.error('Preload failed:', error)
      loadingProgress.value = 100
    }
  }

  return {
    loadingProgress,
    areAllAssetsLoaded,
    preloadAssets,
    resourceCache // Export this if you want to debug memory usage
  }
}