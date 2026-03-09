import { createRouter, createWebHashHistory } from 'vue-router'
import MainMenu from '@/views/MainMenu'
import CardSelectionView from '@/views/CardSelectionView'
import GameField from '@/views/GameField'

const routes = [
  { path: '/', name: 'main-menu', component: MainMenu },
  { path: '/card-selection', name: 'card-selection', component: CardSelectionView },
  { path: '/match', name: 'match', component: GameField }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router