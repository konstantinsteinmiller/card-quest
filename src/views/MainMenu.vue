<template lang="pug">
  div.h-screen.w-screen.bg-slate-200.flex.items-center.justify-center.p-4(class="bg-[url('/images/bg/bg_1024x1024.webp')] bg-cover bg-center")
    img.absolute(class="left-1/2 top-12 -translate-x-1/2 w-32 h-32 sm:top-4 sm:w-[8rem] sm:h-[8rem] md:w-[10rem] md:h-[10rem] landscape:left-2 landscape:top-2 landscape:-translate-x-0 landscape:md:left-1/2 landscape:md:top-12 landscape:md:-translate-x-1/2" src="/images/logo/logo_512x512.webp" alt="logo")

    // UI Bottom Right (Mute + Version)
    div.absolute.bottom-2.right-2.flex.flex-col.items-end.gap-1
      // Mute Toggle Button
      button.p-2.rounded-full.backdrop-blur-sm.transition-all.cursor-pointer(
        v-if="!mobileCheck()"
        class="bg-black/20 hover:bg-black/40 active:scale-95 pointer-events-auto"
        @click="toggleMute"
      )
        span.text-2xl(v-if="isMuted") 🔇
        span.text-2xl(v-else) 🔊

      div.text-xs.text-slate-200.opacity-70.text-shadow {{ isNative && false ? 'native:': ''}} v.{{ version }}{{ isDemo ? '-demo': ''}}

    // Menu box
    div.relative.p-10.flex.flex-col.gap-4.text-center.self-end(
      class="min-w-[320px] max-w-lg mb-15 sm:mb-8"
    )
      // Menu
      div.flex.flex-col.gap-4.relative.z-10
        FButton(@click="onCampaign") {{ t('play') }}
        FButton(@click="onPracticeClick") {{ t('practice') }}
        FButton(type="secondary" @click="showOptions = true") {{ t('settings') }}
        FButton(v-if="isNative" type="secondary" @click="handleExit") {{ t('quitApp') }}

    OptionsModal(
      :is-open="showOptions"
      @close="showOptions = false"
    )
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import OptionsModal from '@/components/organisms/OptionsModal'
import FButton from '@/components/atoms/FButton'
import { activeRules, isPracticeMatch } from '@/use/useMatch'
import useUser, { version, isDemo, isNative } from '@/use/useUser'
import { mobileCheck } from '@/utils/function'

const router = useRouter()
const { t } = useI18n()
const { userSoundVolume, userMusicVolume, setSettingValue } = useUser()

const showOptions = ref(false)

// Logic to determine if muted based on current volumes
const isMuted = computed(() => userMusicVolume.value === 0 && userSoundVolume.value === 0)

// Store previous volumes to restore them when unmuting
const prevMusicVol = ref(userMusicVolume.value || 0.5)
const prevSoundVol = ref(userSoundVolume.value || 0.7)

onMounted(() => {
  isPracticeMatch.value = false
  activeRules.value = ['high']
})

const toggleMute = () => {
  if (!isMuted.value) {
    // Save current values before muting
    prevMusicVol.value = userMusicVolume.value
    prevSoundVol.value = userSoundVolume.value
    // Mute
    setSettingValue('music', 0)
    setSettingValue('sound', 0)
  } else {
    // Restore previous values (or defaults if previous was somehow 0)
    setSettingValue('music', prevMusicVol.value || 0.5)
    setSettingValue('sound', prevSoundVol.value || 0.7)
  }
}

const onCampaign = () => {
  router.push({ name: 'deck' })
}

const onPracticeClick = () => {
  isPracticeMatch.value = true
  router.push({ name: 'deck', query: isPracticeMatch.value ? { practice: 'true' } : undefined })
}

const handleExit = () => {
  // Check if we are actually in Electron to avoid errors in browser
  if (window?.electronAPI) {
    window.electronAPI?.quitApp()
  } else {
    console.log('Exit requested (Browser mode - no action taken)')
  }
}
</script>

<style lang="sass" scoped>
.text-outline
  text-shadow: 3px 3px 0 #000

.text-shadow
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8)
</style>

<i18n>
en:
  play: "Play"
  practice: "Practice"
  settings: "Settings"
  quitApp: "Quit Game"
de:
  play: "Spielen"
  practice: "Trainieren"
  settings: "Einstellungen"
  quitApp: "Spiel beenden"
fr:
  play: "Jouer"
  practice: "S'entraîner"
  settings: "Paramètres"
  quitApp: "Quitter le jeu"
es:
  play: "Jugar"
  practice: "Practicar"
  settings: "Ajustes"
  quitApp: "Salir del juego"
jp:
  play: "プレイ"
  practice: "練習"
  settings: "設定"
  quitApp: "ゲームを終了"
kr:
  play: "플레이"
  practice: "연습"
  settings: "설정"
  quitApp: "게임 종료"
zh:
  play: "开始游戏"
  practice: "练习"
  settings: "设置"
  quitApp: "退出游戏"
ru:
  play: "Играть"
  practice: "Тренировка"
  settings: "Настройки"
  quitApp: "Выйти из игры"
</i18n>