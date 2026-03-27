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

      div.text-xs.text-slate-200.opacity-70.text-shadow  v.{{ version }}

    // Menu box
    div.relative.p-10.flex.flex-col.gap-4.text-center.self-end(
      class="min-w-[320px] max-w-lg mb-15 sm:mb-8"
    )
      // Menu
      div.flex.flex-col.gap-4.relative.z-10
        FButton(@click="onCampaign") {{ t('play') }}
        FButton(@click="onPracticeClick") {{ t('practice') }}
        FButton(type="secondary" @click="showOptions = true") {{ t('settings') }}

    FModal(v-if="false" v-model="showOptions" title="New Card!")
      div(class="flex flex-col items-center")
        //img(src="/path/to/card.png" class="w-40 h-40 object-contain mb-4")
        p(class="text-lg opacity-90") You've unlocked a rare model!

      template(#footer)
        FButton(label="AWESOME!" @click="showOptions = false")

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
import useUser, { version } from '@/use/useUser'
import FModal from '@/components/molecules/FModal'
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
</script>

<style lang="sass" scoped>
.text-outline
  text-shadow: 3px 3px 0 #000

.text-shadow
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8)
</style>

<i18n>
en:
  play: "Spielen"
  practice: "Practice"
  settings: "Settings"
de:
  play: "Spielen"
  practice: "Trainieren"
  settings: "Einstellungen"
</i18n>