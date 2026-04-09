import { createApp, ref } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/css/tailwind.css'
import '@/assets/css/index.sass'
import { createI18n } from 'vue-i18n'
import translations from '@/i18n'
import { GAME_USER_LANGUAGE } from '@/utils/constants.ts'
import { initCrazyGames, crazyLocale } from '@/use/useCrazyGames'

// Initialize the CrazyGames SDK *before* creating the Vue app: useUserDb
// instantiates eagerly when the user composable is first imported, and we
// want it to consult `isSdkActive` from inside its async init() callback
// so any cloud-synced progress can override the local indexedDB cache.
const bootstrap = async () => {
  await initCrazyGames()

  // Prefer an explicit per-tab override; otherwise fall back to the
  // CrazyGames system locale (set by initCrazyGames above), then the
  // browser's navigator.language. Translations are keyed by 2-letter
  // language code (e.g. 'en'), so we always strip any region tag.
  const sessionLang = sessionStorage.getItem(GAME_USER_LANGUAGE)
  const navLang = navigator.language?.split('-')[0]
  const initialLang = sessionLang || crazyLocale.value || navLang || 'en'
  const userLanguage = ref(initialLang)

  const i18n: any = createI18n({
    locale: userLanguage.value || 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: translations,
    missingWarn: false,
    fallbackWarn: false
  })

  const app = createApp(App)

  app.use(router)
  app.use(i18n)

  app.mount('#app')
}

bootstrap()
