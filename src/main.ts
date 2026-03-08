import { createApp, ref } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/css/tailwind.css'
import '@/assets/css/index.sass'
import { createI18n } from 'vue-i18n'
import translations from '@/i18n'
import { GAME_USER_LANGUAGE } from '@/utils/constants.ts'

const userLanguage = ref(sessionStorage.getItem(GAME_USER_LANGUAGE) || navigator.language?.split('-')[0])

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
