import { ref, computed } from 'vue'
import type { GameCard } from '@/types/game'
import useUser from '@/use/useUser'
import { useI18n } from 'vue-i18n'
import type { BattleRuleName, RuleContext } from '@/use/useBattleRules'

export interface CampaignNode {
  id: string
  name: string
  description: string
  npcDeck: string[]
  position: { x: number; y: number }
  unlocked: boolean
  completed: boolean
  unlocks: string[]
  knownCards: string[]
  rules: BattleRuleName[]
}

export const useCampaign = () => {
  const { t } = useI18n()
  const { setSettingValue, userCampaign } = useUser()

  const campaignNodes = ref<CampaignNode[]>([
    {
      id: 'node1-1',
      name: t('node1-1.name'),
      description: t('node1-1.desc'),
      npcDeck: ['asha', 'moss', 'eclipse', 'energy-female-old', 'piranha-young'],
      position: { x: 18, y: 64 },
      unlocked: true,
      completed: true,
      unlocks: ['node1-2'],
      knownCards: [],
      rules: ['standard']
    },
    {
      id: 'node1-2',
      name: t('node1-2.name'),
      description: t('node1-2.desc'),
      npcDeck: ['asha', 'moss', 'eclipse', 'energy-female-old', 'piranha-young'],
      position: { x: 23, y: 83 },
      unlocked: true,
      completed: false,
      unlocks: ['node1-3'],
      knownCards: [],
      rules: ['low']
    },
    {
      id: 'node1-3',
      name: t('node1-3.name'),
      description: t('node1-3.desc'),
      npcDeck: ['asha', 'moss', 'eclipse', 'energy-female-old', 'piranha-young'],
      position: { x: 39, y: 91 },
      unlocked: true,
      completed: false,
      unlocks: ['node2-1'],
      knownCards: [],
      rules: ['low', 'plus', 'same', 'combo']
    },
    {
      id: 'node2-1',
      name: t('node2-1.name'),
      description: t('node2-1.desc'),
      npcDeck: ['golem-1', 'golem-1', 'rock-1', 'rock-1', 'eagle-1'],
      position: { x: 70, y: 55 },
      unlocked: true,
      completed: false,
      unlocks: ['node2-2'],
      knownCards: [],
      rules: ['standard', 'plus'/*, 'same'*/]
    },
    {
      id: 'node2-2',
      name: t('node2-2.name'),
      description: t('node2-2.desc'),
      npcDeck: ['golem-1', 'golem-1', 'rock-1', 'rock-1', 'eagle-1'],
      position: { x: 82, y: 40 },
      unlocked: true,
      completed: false,
      unlocks: ['node2-3'],
      knownCards: [],
      rules: ['standard', 'same']
    },
    {
      id: 'node2-3',
      name: t('node2-3.name'),
      description: t('node2-3.desc'),
      npcDeck: ['golem-1', 'golem-1', 'rock-1', 'rock-1', 'eagle-1'],
      position: { x: 90, y: 30 },
      unlocked: true,
      completed: false,
      unlocks: ['node3'],
      knownCards: [],
      rules: ['standard', 'same', 'plus', 'combo']
    },
    {
      id: 'node3',
      name: t('node3.name'),
      description: t('node3.desc'),
      npcDeck: ['knight-1', 'knight-1', 'dragon-1', 'dragon-1', 'king-1'],
      position: { x: 80, y: 20 },
      unlocked: false,
      completed: false,
      unlocks: [],
      knownCards: [],
      rules: ['standard', 'plus']
    }
  ])

  // Sync with User Storage on initialization
  const syncProgress = () => {
    if (!userCampaign.value || !userCampaign.value.length || userCampaign.value === '[]') {
      setSettingValue('campaign', campaignNodes.value.map(node => ({
        id: node.id,
        completed: node.completed,
        knownCards: node.knownCards
      })))
    } else if (userCampaign.value.constructor === Array) {
      userCampaign.value?.forEach((saved: any) => {
        const node = campaignNodes.value.find(n => n.id === saved.id)
        if (node) {
          node.completed = saved.completed
          node.knownCards = saved.knownCards || []
          // If a node is completed, unlock its children
          if (node.completed) {
            node.unlocks.forEach(childId => {
              const child = campaignNodes.value.find(c => c.id === childId)
              if (child) child.unlocked = true
            })
          }
        }
      })
    }
  }

  syncProgress()

  const selectedNodeId = ref<string | null>(null)

  // Dynamic active node based on selection
  const activeNode = computed(() =>
    campaignNodes.value.find(n => n.id === selectedNodeId.value) || null
  )

  const completeNode = (id: string) => {
    const node = campaignNodes.value.find(n => n.id === id)
    if (node) {
      node.completed = true
      node.unlocks.forEach(nextId => {
        const nextNode = campaignNodes.value.find(n => n.id === nextId)
        if (nextNode) nextNode.unlocked = true
      })
      setSettingValue('campaign', campaignNodes.value.map(n => ({ id: n.id, completed: n.completed })))
    }
  }

  return {
    campaignNodes,
    selectedNodeId,
    activeNode,
    completeNode
  }
}