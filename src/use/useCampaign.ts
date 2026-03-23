import { ref, computed, type ComputedRef, watch } from 'vue'
import useUser from '@/use/useUser'
import { useI18n } from 'vue-i18n'
import type { RuleName } from '@/use/useBattleRules'

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
  rules: RuleName[]
}

export const selectedNodeId = ref<string | null>(null)
export const campaignNodes = ref<CampaignNode[]>([])

// Dynamic active node based on selection
export const activeNode: ComputedRef<CampaignNode | null> = computed((): CampaignNode | null =>
  campaignNodes.value.find(n => n.id === selectedNodeId.value) || null
)

export const useCampaign = () => {
  const { setSettingValue, userCampaign } = useUser()
  const { t } = useI18n()

  campaignNodes.value = [
    {
      id: 'node1-1',
      name: t('node1-1.name'),
      description: t('node1-1.desc'),
      npcDeck: ['mermaid-young', 'moss', 'dragon-young', 'dragon-middle', 'piranha-young', 'mushroom-young', 'nature-butterfly-middle', 'scorpion-young', 'warrior-young', 'water-shark-young', 'yeti-young'],
      position: { x: 18, y: 64 },
      unlocked: true,
      completed: true,
      unlocks: ['node1-2'],
      knownCards: [],
      rules: ['high', 'one']
    },
    {
      id: 'node1-2',
      name: t('node1-2.name'),
      description: t('node1-2.desc'),
      npcDeck: ['asha', 'moss', 'yeti-young', 'energy-female-old', 'piranha-young'],
      position: { x: 23, y: 83 },
      unlocked: true,
      completed: false,
      unlocks: ['node1-3'],
      knownCards: [],
      rules: ['low', 'one']
    },
    {
      id: 'node1-3',
      name: t('node1-3.name'),
      description: t('node1-3.desc'),
      npcDeck: ['nature-butterfly-middle', 'dragon-middle', 'water-shark-middle', 'mushroom-middle', 'energy-female-old', 'piranha-young', 'mermaid-middle', 'mermaid-old', 'piranha-old'],
      position: { x: 39, y: 91 },
      unlocked: true,
      completed: false,
      unlocks: ['node2-1', 'node1-4'],
      knownCards: [],
      rules: ['low', 'plus', 'same', 'combo', 'one']
    },
    {
      id: 'node1-4',
      name: t('node1-4.name'),
      description: t('node1-4.desc'),
      npcDeck: ['nature-butterfly-middle', 'dragon-young', 'dragon-middle', 'water-shark-middle', 'mushroom-middle', 'energy-female-old', 'piranha-young', 'piranha-middle', 'mermaid-middle', 'mermaid-old', 'piranha-old'],
      position: { x: 60, y: 83 },
      unlocked: true,
      completed: false,
      unlocks: ['node2-1'],
      knownCards: [],
      rules: ['low', 'plus', 'same', 'combo', 'open', 'one']
    },
    {
      id: 'node2-1',
      name: t('node2-1.name'),
      description: t('node2-1.desc'),
      npcDeck: ['moss', 'psi-nightmare', 'yeti-young', 'dragon-middle', 'fire-harpy', 'energy-female-old', 'piranha-young', 'piranha-middle', 'gargoyle-young', 'snowman-young', 'gargoyle-middle'],
      position: { x: 70, y: 55 },
      unlocked: true,
      completed: false,
      unlocks: ['node2-2'],
      knownCards: [],
      rules: ['high', 'plus'/*, 'same'*/, 'all']
    },
    {
      id: 'node2-2',
      name: t('node2-2.name'),
      description: t('node2-2.desc'),
      npcDeck: ['gargoyle-young', 'gargoyle-middle', 'gargoyle-old', 'dragon-middle', 'yeti-young', 'yeti-middle', 'fire-harpy', 'energy-female-old', 'piranha-young', 'snowman-middle'],
      position: { x: 82, y: 40 },
      unlocked: true,
      completed: false,
      unlocks: ['node2-3'],
      knownCards: [],
      rules: ['high', 'same', 'conquered']
    },
    {
      id: 'node2-3',
      name: t('node2-3.name'),
      description: t('node2-3.desc'),
      npcDeck: ['asha', 'starlight', 'mushroom-middle', 'gargoyle-middle', 'gargoyle-old', 'energy-female-old', 'piranha-old', 'snowman-middle', 'yeti-middle', 'snowman-old'],
      position: { x: 90, y: 30 },
      unlocked: true,
      completed: false,
      unlocks: ['node3'],
      knownCards: [],
      rules: ['high', 'same', 'plus', 'combo', 'random']
    },
    {
      id: 'node3',
      name: t('node3.name'),
      description: t('node3.desc'),
      npcDeck: ['asha', 'starlight', 'water-shark-middle', 'energy-female-old', 'piranha-old', 'psi-nightmare', 'dragon-old', 'eclipse', 'snowman-old'],
      position: { x: 80, y: 20 },
      unlocked: false,
      completed: false,
      unlocks: [],
      knownCards: [],
      rules: ['high', 'plus', 'all']
    }
  ]

  watch(userCampaign, () => {
    if (typeof userCampaign.value === 'string') {
      const campaignList = JSON.parse(userCampaign.value)
      campaignList?.forEach((saved: any) => {
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
  }, { immediate: true })

  const completeNode = (currentNode: CampaignNode) => {
    if (!currentNode) return

    const oldNode = campaignNodes.value.find(n => n.id === currentNode.id)
    if (!oldNode) return

    oldNode.completed = true
    oldNode.knownCards = currentNode.knownCards
    oldNode.unlocks.forEach(nextId => {
      const nextNode = campaignNodes.value.find(n => n.id === nextId)
      if (nextNode) nextNode.unlocked = true
    })

    const storedNodes = campaignNodes.value.map(n => ({
      id: n.id,
      completed: n.completed,
      knownCards: n.id === currentNode.id ? currentNode?.knownCards : n.knownCards
    }))
    setSettingValue('campaign', storedNodes)
  }

  const saveCampaign = (currentNode: CampaignNode) => {
    if (!currentNode) return

    const oldNode = campaignNodes.value.find(n => n.id === currentNode.id)
    if (!oldNode) return

    const storedNodes = campaignNodes.value.map(n => ({
      id: n.id,
      completed: n.completed,
      knownCards: n.id === oldNode.id ? currentNode?.knownCards : n.knownCards
    }))
    setSettingValue('campaign', storedNodes)
  }

  return {
    campaignNodes,
    selectedNodeId,
    saveCampaign,
    activeNode,
    completeNode
  }
}

export default useCampaign