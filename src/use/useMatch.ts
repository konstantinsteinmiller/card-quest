import { ref, computed } from 'vue'
import type { GameCard, BoardSlot } from '@/types/game'
import { useModels, modelImgPath } from '@/use/useModels'
import { useBattleRules, type BattleRuleName } from '@/use/useBattleRules'
import { useRouter } from 'vue-router'

const isSplashScreenVisible = ref<boolean>(false)
const isDbInitialized = ref<boolean>(false)
export const ruleModal = ref<string | null>(null)
export const isCampaignMatch = ref<boolean>(false)

export const playerSelection = ref<GameCard[]>([])
export const playerHand = ref<GameCard[]>([])
export const npcHand = ref<GameCard[]>([])

export const activeRules = ref<BattleRuleName[]>(['standard'])

export const useMatch = () => {
  const turn = ref<'player' | 'npc'>('player')
  const { allCards } = useModels()
  const { evaluateMatchRules } = useBattleRules()
  const router = useRouter()

  const board = ref<BoardSlot[][]>(Array.from({ length: 3 }, (_, y) =>
    Array.from({ length: 3 }, (_, x) => ({ x, y, card: null }))
  ))

  const isBoardFull = computed(() => {
    return board.value.every(row => row.every(slot => slot.card !== null))
  })

  const generateRandomCard = (owner: 'player' | 'npc'): GameCard => {
    const randomModel = Math.floor(Math.random() * allCards.length)
    const card = allCards[randomModel]

    return {
      id: card.id,
      instanceId: Math.random().toString(36).substring(2, 11),
      name: `${card?.name || 'Fairy'}`,
      values: { ...card.values },
      owner,
      image: modelImgPath(card?.id || 'missing_id')
    }
  }

  const resetGame = () => {
    board.value.forEach(row => row.forEach(slot => {
      slot.card = null
    }))

    playerHand.value = [...playerSelection.value]
    if (playerHand.value.length === 0) {
      //back to main menu
      return router.replace({ name: 'deck', params: isCampaignMatch.value ? { campaign: true } : undefined })
    }
    npcHand.value = Array.from({ length: 5 }, () => generateRandomCard('npc'))
    turn.value = 'player'
  }

  /**
   * Use the flexible Rule Engine
   */
  const evaluateCapture = (x: number, y: number) => {
    const attackerCard = board.value[y][x].card
    if (!attackerCard) return

    evaluateMatchRules(activeRules.value, {
      x,
      y,
      board: board.value,
      attacker: attackerCard
    })
  }

  const placeCard = (card: GameCard, x: number, y: number) => {
    if (board.value[y][x].card) return false

    if (card.owner === 'player') {
      playerHand.value = playerHand.value.filter(c => c.instanceId !== card.instanceId)
    } else {
      npcHand.value = npcHand.value.filter(c => c.instanceId !== card.instanceId)
    }

    board.value[y][x].card = card
    evaluateCapture(x, y)

    // Switch turns
    turn.value = turn.value === 'player' ? 'npc' : 'player'
    return true
  }

  return {
    turn,
    playerHand,
    npcHand,
    board,
    resetGame,
    placeCard,
    isBoardFull,
    isSplashScreenVisible,
    isDbInitialized,
    activeRules // Exposed so the UI or Campaign can adjust them
  }
}

export default useMatch