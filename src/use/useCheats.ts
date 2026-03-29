import { onMounted, onUnmounted, ref } from 'vue'
import useModels from '@/use/useModels'
import useUser from '@/use/useUser'
import useCampaign from '@/use/useCampaign'
import type { GameCard } from '@/types/game'

const storedCheat = localStorage.getItem('cheat') || 'false'
const isCheat = ref<boolean>(JSON.parse(storedCheat))


const useCheats = () => {
  if (!isCheat.value) return {}

  const { allCards } = useModels()
  const { setSettingValue } = useUser()
  const { campaignNodes } = useCampaign()

  /**
   * ACTIONS
   */
  const unlockAllCards = () => {
    const allCardsCollectionDebug = allCards.map((card: GameCard) => ({
      id: card.id,
      count: 1
    }))
    setSettingValue('collection', allCardsCollectionDebug)
    console.warn('[CHEAT] All cards unlocked.')
  }

  const unlockAllCampaignNodes = () => {
    campaignNodes.value = campaignNodes.value.map(node => ({ ...node, completed: true }))
    console.warn('[CHEAT] All campaign nodes completed.')
  }

  const printAllIds = () => {
    const youngIds = allCards.filter((card: GameCard) => card.id.includes('-young'))
    const middleIds = allCards.filter((card: GameCard) => card.id.includes('-middle'))
    const oldIds = allCards.filter((card: GameCard) => card.id.includes('-old'))
    console.warn('[CHEAT] All sorted ids.', youngIds, middleIds, oldIds)
  }

  const resetCampaign = () => {
    setSettingValue('campaign', [])
    setSettingValue('quest-campaign', false)
    console.warn('[CHEAT] Campaign progress reset.')
  }

  /**
   * CHEAT MAPPING
   * Define your shortcuts here.
   * Format: 'ctrl+shift+key' or just 'key'
   * Note: 'ctrl' also catches 'meta' (Cmd on Mac) for better UX.
   */
  const cheatsMap: Record<string, () => void> = {
    'ctrl+shift+c': unlockAllCards,
    'ctrl+shift+b': unlockAllCampaignNodes,
    'ctrl+shift+r': resetCampaign,
    'ctrl+shift+k': printAllIds,
    'ctrl+shift+d': () => console.log('[DEBUG] Cards:', allCards)
  }

  /**
   * EVENT HANDLER
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    const keys = []

    // 1. Build the modifier prefix
    if (e.ctrlKey || e.metaKey) keys.push('ctrl')
    if (e.shiftKey) keys.push('shift')
    if (e.altKey) keys.push('alt')

    // 2. Add the actual key (normalized to lowercase)
    const mainKey = e.key.toLowerCase()

    // console.log('keys: ', keys)
    // Avoid adding 'control', 'shift', etc., as the main key if they are modifiers
    if (!['control', 'shift', 'alt', 'meta'].includes(mainKey)) {
      keys.push(mainKey)
    }

    // 3. Join and match
    const shortcut = keys.join('+')

    if (cheatsMap[shortcut]) {
      e.preventDefault()
      cheatsMap[shortcut]()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    isCheat
  }
}

export default useCheats