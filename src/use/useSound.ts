import { prependBaseUrl } from '@/utils/function'
import useUser from '@/use/useUser'

import { ref, onMounted, watch, onUnmounted } from 'vue'

// We keep the audio instance outside the hook so it's a true Singleton
const bgMusic = ref<HTMLAudioElement | null>(null)
const isLoaded = ref(false)
const isPlaying = ref(false)

export const useMusic = () => {
  const { userMusicVolume } = useUser()

  watch(userMusicVolume, () => {
    if (!bgMusic.value) return
    bgMusic.value.volume = userMusicVolume.value * 0.05
  })

  const initMusic = (filename: string) => {
    onMounted(() => {
      if (bgMusic.value) return // Already initialized
      // 1. Create the audio object
      const audio = new Audio()
      audio.src = prependBaseUrl('/audio/music/' + filename)
      audio.loop = true
      audio.volume = userMusicVolume.value * 0.05
      audio.preload = 'auto'

      // 2. Wait for the browser to have enough data to play through
      audio.addEventListener('canplaythrough', () => {
        isLoaded.value = true
        bgMusic.value = audio
        playWithFade()
      }, { once: true })

      // 3. Start the lazy load
      audio.load()
    })
    onUnmounted(() => {
      bgMusic.value?.pause()
      bgMusic.value?.removeAttribute('src') // Clear the source
      bgMusic.value = null
    })
  }

  const playWithFade = () => {
    if (!bgMusic.value) return

    // Browsers block autoplay until user interaction
    bgMusic.value.play().then(() => {
      isPlaying.value = true
      fadeIn()
    }).catch(() => {
      // console.log('Autoplay blocked: Waiting for user interaction to start music.')
      // Attach a one-time listener to the window to play on first click
      window.addEventListener('click', () => {
        if (!isPlaying.value) playWithFade()
      }, { once: true })
    })
  }

  const fadeIn = () => {
    if (!bgMusic.value) return
    let vol = 0
    const interval = setInterval(() => {
      if (vol < userMusicVolume.value * 0.075) {
        vol += 0.005
        bgMusic.value!.volume = vol
      } else {
        clearInterval(interval)
      }
    }, 50)
  }


  return { initMusic, isLoaded, isPlaying }
}

const useSounds = () => {
  const { userSoundVolume } = useUser()

  const playSound = (effect: string, ratio = 0.025) => {
    const audio = new Audio(prependBaseUrl(`/audio/sfx/${effect}.ogg`))
    // iOS requires volume to be set BEFORE play()
    audio.volume = userSoundVolume.value * ratio
    audio.play().catch(e => console.warn('SFX play blocked:', e))
  }

  return {
    playSound
  }
}

export default useSounds

