import { ref, computed, type ComputedRef } from 'vue'
import type { GameCard, BoardSlot } from '@/types/game'
import useModels, { modelImgPath } from '@/use/useModels'
import { useBattleRules, type BattleRuleName } from '@/use/useBattleRules'
import { useRouter } from 'vue-router'
import { setupDebugBoard } from '../../tests/fixtures/debugBoard'
import type { CampaignNode } from '@/use/useCampaign'

const debugSaved = localStorage.getItem('debug') || 'false'
export const isDebug = ref(!!JSON.parse(debugSaved))

const isSplashScreenVisible = ref<boolean>(false)
const isDbInitialized = ref<boolean>(false)
export const ruleModal = ref<string | null | any>(null)
export const isPracticeMatch = ref<boolean>(false)

export const playerSelection = ref<GameCard[]>([])

export const playerHand = ref<GameCard[]>([])
export const npcHand = ref<GameCard[]>([])
export const originalPlayerHand = ref<GameCard[]>([])
export const originalNpcHand = ref<GameCard[]>([])

export const board = ref<BoardSlot[][]>(Array.from({ length: 3 }, (_, y) =>
  Array.from({ length: 3 }, (_, x) => ({ x, y, card: null }))
))

export const activeRules = ref<BattleRuleName[]>(['standard'])

export const useMatch = () => {
  const turn = ref<'player' | 'npc'>('player')
  const isThinking = ref(false)
  const { allCards } = useModels()
  const { evaluateMatchRules } = useBattleRules()
  const router = useRouter()

  const isBoardFull = computed(() => board.value.every(row => row.every(slot => slot.card !== null)))

  const generateRandomCard = (owner: 'player' | 'npc'): GameCard => {
    const randomModel = Math.floor(Math.random() * allCards.length)
    const card = allCards[randomModel]

    return {
      id: card.id,
      instanceId: Math.random().toString(36).substring(2, 11),
      name: card.name,
      values: { ...card.values },
      owner,
      image: modelImgPath(card?.id || 'missing_id'),
      lastRuleTrigger: null
    }
  }

  const setupGame = (npcDeck: any) => {
    board.value.forEach(row => row.forEach(slot => {
      slot.card = null
    }))
    originalPlayerHand.value = JSON.parse(JSON.stringify(playerSelection.value))
    playerHand.value = JSON.parse(JSON.stringify(originalPlayerHand.value))
    if (playerHand.value.length === 0) {
      return router.replace({ name: 'deck', query: isPracticeMatch.value ? { practice: 'true' } : undefined })
    }

    originalNpcHand.value = npcDeck
    npcHand.value = JSON.parse(JSON.stringify(originalNpcHand.value))
  }

  const resetGame = (activeNode: ComputedRef<CampaignNode | null>) => {
    if (isDebug?.value) {
      board.value.forEach(row => row.forEach(slot => {
        slot.card = null
      }))
      setupDebugBoard()
      setTimeout(() => {
        try {
          const func = async () => {
            const useUser = await import(`@/use/useUser`)
            const { setSettingValue } = useUser.default()
            setSettingValue('hand', [...originalPlayerHand.value])
          }
          func()
        } catch (e) {
          console.error('error fetching useUser: ', e)
        }
      }, 300)
    } else {
      // setup correct npc deck based on active node and pick 5 random cards from the npc deck
      // if no active node (like in free play), generate random npc deck
      if (activeNode.value) {
        const npcDeckCopy = JSON.parse(JSON.stringify(activeNode.value.npcDeck))?.reverse().sort(() => 0.5 - Math.random())
        const npcDeck = npcDeckCopy.map((cardId: string) => {
          const cardData = allCards.find(c => c.id === cardId)
          return {
            ...cardData,
            instanceId: Math.random().toString(36).substring(2, 11),
            owner: 'npc',
            image: modelImgPath(cardData?.id || 'missing_id'),
            lastRuleTrigger: null
          }
        }).slice(0, 5)

        setupGame(npcDeck)
      } else {
        const npcDeck = Array.from({ length: 5 }, () => generateRandomCard('npc'))
        setupGame(npcDeck)
      }
    }

    // turn.value = 'player'
    turn.value = Math.random() > 0.5 ? 'player' : 'npc'
    isThinking.value = false
  }

  const evaluateCapture = (x: number, y: number): boolean => {
    const attackerCard = board.value[y][x].card
    if (!attackerCard) return false
    return evaluateMatchRules(activeRules.value, { x, y, board: board.value, attacker: attackerCard })
  }

  const placeCard = async (card: GameCard, x: number, y: number) => {
    if (board.value[y][x].card || isThinking.value) return false

    isThinking.value = true
    card.lastRuleTrigger = null

    if (card.owner === 'player') {
      playerHand.value = playerHand.value.filter(c => c.instanceId !== card.instanceId)
    } else {
      npcHand.value = npcHand.value.filter(c => c.instanceId !== card.instanceId)
    }

    board.value[y][x].card = card

    // Check if a special rule was triggered
    const hasSpecialTrigger = evaluateCapture(x, y)

    // Only add thinking time if a special rule (Same, Plus, Combo) happened
    if (hasSpecialTrigger) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    turn.value = turn.value === 'player' ? 'npc' : 'player'
    isThinking.value = false
    return true
  }

  return {
    turn,
    playerHand,
    npcHand,
    originalPlayerHand,
    originalNpcHand,
    board,
    resetGame,
    placeCard,
    isBoardFull,
    isSplashScreenVisible,
    isDbInitialized,
    activeRules,
    isThinking
  }
}

export default useMatch