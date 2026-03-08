import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import useUserDb from '@/use/useUserDb'
import { type Difficulties, DIFFICULTY } from '@/utils/enums'

const userDifficulty: Ref<Difficulties> = ref(DIFFICULTY.HARD)
const userSoundVolume: Ref<number> = ref(0.7)
const userMusicVolume: Ref<number> = ref(0.05)
const userLanguage: Ref<string> = ref(navigator?.language?.split('-')[0] || 'en')

const userTutorialsDoneMap: Ref<any> = ref('{}')
const tutorialPhase: Ref<string> = ref('')
const allowTutorial: Ref<boolean> = ref(true)
const isOptionsModalOpen: Ref<boolean> = ref(false)

/* just for after the indexDB has loaded */
watch(
  userTutorialsDoneMap,
  (newValue: any) => {
    if (newValue) {
      allowTutorial.value = !Object.keys(userTutorialsDoneMap.value)?.some(key => key !== 'none')
    }
  },
  { deep: true, once: true }
)

const { storeUser } = useUserDb({
  userDifficulty,
  userSoundVolume,
  userMusicVolume,
  userLanguage,
  userTutorialsDoneMap
})

const useUser = () => {
  const setSettingValue = (name: string, value: any) => {
    switch (name) {
      case 'sound':
        userSoundVolume.value = value
        break
      case 'music':
        userMusicVolume.value = value
        break
      case 'language':
        userLanguage.value = value
        break
      case 'difficulty':
        userDifficulty.value = value
        break
      case 'tutorialsDoneMap':
        userTutorialsDoneMap.value = JSON.stringify(value)
        break
    }

    storeUser({
      userDifficulty: userDifficulty.value,
      userSoundVolume: +userSoundVolume.value,
      userMusicVolume: +userMusicVolume.value,
      userLanguage: userLanguage.value,
      userTutorialsDoneMap: userTutorialsDoneMap.value
    })
  }

  return {
    userDifficulty,
    userSoundVolume,
    userMusicVolume,
    userLanguage,
    userTutorialsDoneMap,
    tutorialPhase,
    allowTutorial,
    setSettingValue,
    isOptionsModalOpen
  }
}

export default useUser
