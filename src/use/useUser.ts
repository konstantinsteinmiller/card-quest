import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import useUserDb from '@/use/useUserDb'
import { type Difficulties, DIFFICULTY } from '@/utils/enums'
import { mobileCheck } from '@/utils/function'

const windowWidth = ref(window.innerWidth)
export const orientation = ref(mobileCheck() && windowWidth.value > 500 ? 'landscape' : 'portrait')
export const isMobileLandscape = computed(() => mobileCheck() && windowWidth.value > 500 && orientation.value === 'landscape')
export const isMobilePortrait = computed(() => mobileCheck() && windowWidth.value <= 500)

export const version: string = import.meta.env.VITE_APP_VERSION

const userDifficulty: Ref<Difficulties> = ref(DIFFICULTY.HARD)
const userSoundVolume: Ref<number> = ref(0.7)
const userMusicVolume: Ref<number> = ref(0.05)
const userLanguage: Ref<string> = ref(navigator?.language?.split('-')[0] || 'en')

const userTutorialsDoneMap: Ref<any> = ref('{}')
const tutorialPhase: Ref<string> = ref('')
const allowTutorial: Ref<boolean> = ref(true)
const isOptionsModalOpen: Ref<boolean> = ref(false)
const userHand: Ref<any> = ref('[]')
const userCampaign: Ref<any> = ref('[]')
const userSkipRulesModal: Ref<boolean> = ref(false)

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
  userTutorialsDoneMap,
  userHand,
  userCampaign,
  userSkipRulesModal
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
      case 'skipRulesModal':
        userSkipRulesModal.value = value
        break
      case 'tutorialsDoneMap':
        userTutorialsDoneMap.value = JSON.stringify(value)
        break
      case 'hand':
        userHand.value = JSON.stringify(value)
        break
      case 'campaign':
        userCampaign.value = JSON.stringify(value)
        break
    }

    storeUser({
      userDifficulty: userDifficulty.value,
      userSoundVolume: +userSoundVolume.value,
      userMusicVolume: +userMusicVolume.value,
      userLanguage: userLanguage.value,
      userSkipRulesModal: userSkipRulesModal.value,
      userTutorialsDoneMap: userTutorialsDoneMap.value,
      userHand: userHand.value,
      userCampaign: userCampaign.value
    })
  }

  return {
    userDifficulty,
    userSoundVolume,
    userMusicVolume,
    userLanguage,
    userTutorialsDoneMap,
    userHand,
    userCampaign,
    userSkipRulesModal,
    tutorialPhase,
    allowTutorial,
    setSettingValue,
    isOptionsModalOpen
  }
}

export default useUser