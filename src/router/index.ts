import { createRouter, createWebHistory } from 'vue-router'
import MainMenu from '@/views/MainMenu'
import CardSelectionView from '@/views/CardSelectionView'
import GameField from '@/views/GameField'

const routes = [
  { path: '/', name: 'main-menu', component: MainMenu },
  { path: '/card-selection', name: 'card-selection', component: CardSelectionView },
  { path: '/match', name: 'match', component: GameField }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router