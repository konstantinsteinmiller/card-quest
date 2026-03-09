import { createRouter, createWebHistory } from 'vue-router'
import GameView from '@/views/GameView'
import MainMenu from '@/views/MainMenu'
import CardSelectionView from '@/views/CardSelectionView'

const routes = [
  { path: '/', name: 'main-menu', component: MainMenu },
  { path: '/match', name: 'match', component: GameView },
  { path: '/card-selection', name: 'card-selection', component: CardSelectionView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router