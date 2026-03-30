import { createRouter, createWebHashHistory } from 'vue-router'
import MainMenu from '@/views/MainMenu'
import CardSelectionView from '@/views/CardSelectionView'
import GameField from '@/views/GameField'
import CampaignMap from '@/views/CampaignMap'
import useUser, { isWeb } from '@/use/useUser'

const routes = [
  { path: '/', name: 'main-menu', component: MainMenu },
  { path: '/deck', name: 'deck', component: CardSelectionView },
  { path: '/campaign', name: 'campaign', component: CampaignMap },
  { path: '/match', name: 'match', component: GameField }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

// --- THE ROUTER HOOK ---
router.beforeEach((to, from) => {
  const { userUnlocked, setSettingValue } = useUser()

  const url = window.location.href
  const storedUnlock: string = (localStorage.getItem('full_unlocked') as string)
  const parsedStoredUnlock: boolean = typeof storedUnlock === 'string' && storedUnlock?.length ? (JSON.parse(storedUnlock) as boolean) : false
  const isUnlocked = to.query.unlocked === 'true' || from.query.unlocked === 'true' || parsedStoredUnlock === true

  // Only apply restrictions if it's the Web version
  if (isWeb) {
    const isFullVersion = url.includes('konstantinsteinmiller.github.io/card-quest/') && !url.includes('/card-quest/demo/') && !url.includes('/card-quest/develop/')
    const isDevelopVersion = url.includes('konstantinsteinmiller.github.io/card-quest/develop/')
    const isDev = url.includes('localhost:5173/')

    if (isDev) {
      return true
    }

    // If user is on Full or Develop without the unlock param, boot them to Demo
    if ((isFullVersion || isDevelopVersion) && !isUnlocked) {
      window.location.href = 'https://konstantinsteinmiller.github.io/card-quest/demo/'
      return false// Stop execution
    } else if (isUnlocked && (isFullVersion || isDevelopVersion)) {
      localStorage.setItem('full_unlocked', 'true')
    }
  }

  return true
})

export default router