import { prependBaseUrl } from '@/utils/function'
import useUser from '@/use/useUser'


const useModels = () => {
  const { userSoundVolume } = useUser()

  const playSound = (effect: string) => {
    const audio = new Audio(prependBaseUrl(`/audio/sfx/${effect}.ogg`))
    audio.volume = userSoundVolume.value * 0.025
    audio.play().catch(e => console.warn('Audio play blocked:', e))
  }

  return {
    playSound
  }
}

export default useModels