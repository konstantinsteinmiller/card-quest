import { ref, computed, type ComputedRef, watch } from 'vue'
import useUser from '@/use/useUser'
import { useI18n } from 'vue-i18n'
import type { RuleName } from '@/use/useBattleRules'
import { isCampaignTest, isDebug } from '@/use/useMatch'

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
  isCampaignTest.value ? true : false

  campaignNodes.value = [
    // --- TRACK 1: WESTERN COAST ---
    {
      id: 'node-w1',
      name: t('node-w1.name'),
      description: t('node-w1.desc'),
      // Focus: Young Nature & Water (Starting Tier)
      npcDeck: ['mermaid-young', 'moss-young', 'mushroom-young', 'piranha-young', 'sirene-young', 'turtoise-young', 'mouse-young', 'butterfly-young', 'dragon-young', 'snowman-young'],
      position: { x: 16, y: 81 },
      unlocked: true,
      completed: false,
      unlocks: ['node-w1-b', 'node-w-chal'],
      knownCards: [],
      rules: ['high', 'one']
    },
    {
      id: 'node-w1-b',
      name: t('node-w1-b.name'),
      description: t('node-w1-b.desc'),
      // Focus: Young Metal, Neutral, Earth
      npcDeck: ['scorpion-young', 'piranha-young', 'warrior-young', 'dragon-young', 'mouse-young', 'gruffalo-young', 'snowman-young', 'cosmic-young', 'tardigrade-young', 'eel-young'],
      position: { x: 42, y: 82 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-w2'],
      knownCards: [],
      rules: ['high', 'one']
    },
    {
      id: 'node-w-chal',
      name: t('node-w-chal.name'),
      description: t('node-w-chal.desc'),
      // High difficulty early: Middle Air/Nature. Uses Groz (Bear) for 'Same' rule logic.
      npcDeck: ['postman-middle', 'butterfly-middle', 'sirene-young', 'turtoise-middle', 'griffin-middle', 'imp-middle', 'bear-middle', 'female-middle', 'pegasus-middle', 'eel-middle'],
      position: { x: 38, y: 68 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-w2'],
      knownCards: [],
      rules: ['high', 'plus', 'same', 'one']
    },
    {
      id: 'node-w2',
      name: t('node-w2.name'),
      description: t('node-w2.desc'),
      // Focus: Middle Water & Nature
      npcDeck: ['mermaid-middle', 'shark-young', 'shark-middle', 'piranha-middle', 'turtoise-middle', 'mushroom-middle', 'imp-middle', 'puppet-young', 'porcupine-middle', 'mouse-middle'],
      position: { x: 60, y: 65 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-w2-b'],
      knownCards: [],
      rules: ['high', 'same', 'one']
    },
    {
      id: 'node-w2-b',
      name: t('node-w2-b.name'),
      description: t('node-w2-b.desc'),
      // Aquatic Middle Tier
      npcDeck: ['mermaid-middle', 'shark-middle', 'piranha-middle', 'turtoise-middle', 'eel-middle', 'mammoth-middle', 'snowflower-middle', 'pegasus-middle', 'warrior-middle', 'hag-middle'],
      position: { x: 45, y: 60 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-w3', 'node-c0'],
      knownCards: [],
      rules: ['high', 'open', 'one']
    },
    {
      id: 'node-w3',
      name: t('node-w3.name'),
      description: t('node-w3.desc'),
      // First glimpse of "Old" cards
      npcDeck: ['mermaid-old', 'shark-middle', 'piranha-old', 'starlight-old', 'warrior-middle', 'turtoise-old', 'eel-middle', 'griffin-middle', 'bear-middle', 'cat-middle'],
      position: { x: 28, y: 45 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-s1'],
      knownCards: [],
      rules: ['high', 'plus', 'combo', 'open', 'random']
    },

    // --- TRACK 2: EASTERN DESERT ---
    {
      id: 'node-e1',
      name: t('node-e1.name'),
      description: t('node-e1.desc'),
      // Young Fire/Metal
      npcDeck: ['dragon-young', 'scorpion-young', 'warrior-young', 'household-young', 'mouse-young', 'gruffalo-young', 'snowman-young', 'piranha-young', 'demon-young', 'cosmica-young'],
      position: { x: 75, y: 84 },
      unlocked: true,
      completed: false,
      unlocks: ['node-e1-b', 'node-e2'],
      knownCards: [],
      rules: ['high', 'one']
    },
    {
      id: 'node-e1-b',
      name: t('node-e1-b.name'),
      description: t('node-e1-b.desc'),
      // Neutral and Metal focus
      npcDeck: ['warrior-young', 'household-young', 'mouse-young', 'scorpion-young', 'dragon-young', 'gruffalo-young', 'demon-young', 'cosmic-young', 'female-young', 'eel-young'],
      position: { x: 92, y: 80 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-e2', 'node-e-chal'],
      knownCards: [],
      rules: ['high', 'one']
    },
    {
      id: 'node-e-chal',
      name: t('node-e-chal.name'),
      description: t('node-e-chal.desc'),
      // Strategy: Same rule with Nightmare (symmetrical corner values)
      npcDeck: ['nightmare-middle', 'bear-middle', 'fox-middle', 'scorpion-middle', 'porcupine-middle', 'demon-middle', 'cat-middle', 'yeti-middle', 'mammoth-middle', 'wulfberry-middle'],
      position: { x: 95, y: 65 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-e2'],
      knownCards: [],
      rules: ['high', 'open', 'same', 'one']
    },
    {
      id: 'node-e2',
      name: t('node-e2.name'),
      description: t('node-e2.desc'),
      // Fire/Metal/Neutral Middle Tier
      npcDeck: ['dragon-middle', 'fox-middle', 'harpy-middle', 'scorpion-middle', 'armadillo-middle', 'porcupine-middle', 'mouse-middle', 'gargoyle-middle', 'bear-middle', 'warrior-middle', 'harbringer-middle'],
      position: { x: 85, y: 72 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-e2-b'],
      knownCards: [],
      rules: ['high', 'plus', 'one']
    },
    {
      id: 'node-e2-b',
      name: t('node-e2-b.name'),
      description: t('node-e2-b.desc'),
      // Nature/Fire collision
      npcDeck: ['shaman-middle', 'dragon-middle', 'gargoyle-middle', 'mushroom-middle', 'butterfly-middle', 'imp-middle', 'fox-middle', 'bear-middle', 'wulfberry-middle', 'nightmare-middle'],
      position: { x: 80, y: 60 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-e3', 'node-c0', 'node-ne1'],
      knownCards: [],
      rules: ['high', 'plus', 'one']
    },
    {
      id: 'node-e3',
      name: t('node-e3.name'),
      description: t('node-e3.desc'),
      // Old Tier: Earth and Discipline
      npcDeck: ['dragon-old', 'fox-old', 'scorpion-old', 'armadillo-old', 'gargoyle-old', 'mouse-old', 'warrior-middle', 'deer-middle', 'asha-old', 'starlight-old', 'eclipse-old'],
      position: { x: 72, y: 48 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-c0', 'node-a2'],
      knownCards: [],
      rules: ['high', 'same', 'conquered']
    },

    // --- TRACK 3: CENTRAL CONVERGENCE ---
    {
      id: 'node-c0',
      name: t('node-c0.name'),
      description: t('node-c0.desc'),
      npcDeck: ['moss-young', 'mushroom-middle', 'butterfly-middle', 'gargoyle-middle', 'bear-middle', 'griffin-middle', 'warrior-middle', 'shark-middle', 'piranha-middle', 'sirene-young', 'porcupine-middle', 'demon-middle'],
      position: { x: 55, y: 55 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-c1'],
      knownCards: [],
      rules: ['high', 'same', 'one']
    },
    {
      id: 'node-c1',
      name: t('node-c1.name'),
      description: t('node-c1.desc'),
      // Middle/Old mix
      npcDeck: ['tardigrade-middle', 'nightmare-middle', 'wulfberry-middle', 'gargoyle-old', 'armadillo-old', 'cosmic-old', 'gorilla-middle', 'griffin-middle', 'tardigrade-young', 'cosmic-middle', 'hag-middle'],
      position: { x: 45, y: 48 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-c1-b'],
      knownCards: [],
      rules: ['high', 'plus', 'one']
    },
    {
      id: 'node-c1-b',
      name: t('node-c1-b.name'),
      description: t('node-c1-b.desc'),
      // Sky/Air predators
      npcDeck: ['griffin-middle', 'gorilla-middle', 'harpy-middle', 'dragon-middle', 'gargoyle-middle', 'tardigrade-middle', 'nightmare-middle', 'postman-middle', 'female-middle', 'pegasus-middle', 'eel-middle'],
      position: { x: 40, y: 38 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-c2'],
      knownCards: [],
      rules: ['high', 'plus', 'combo', 'one']
    },
    {
      id: 'node-c2',
      name: t('node-c2.name'),
      description: t('node-c2.desc'),
      // High-tier Convergence
      npcDeck: ['tardigrade-old', 'starlight-old', 'cosmic-old', 'gorilla-old', 'angel-old', 'female-old', 'snowman-old', 'dragon-old', 'mermaid-old', 'eclipse-old', 'imp-old'],
      position: { x: 45, y: 32 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-f1'],
      knownCards: [],
      rules: ['high', 'same', 'plus', 'combo', 'random']
    },

    // --- TRACK 4: FINAL SUMMIT ---
    {
      id: 'node-f1',
      name: t('node-f1.name'),
      description: t('node-f1.desc'),
      npcDeck: ['armadillo-old', 'warrior-middle', 'dragon-old', 'scorpion-old', 'gargoyle-old', 'fox-old', 'asha-old', 'cat-middle', 'harbringer-middle', 'female-old', 'snowman-old', 'imp-old'],
      position: { x: 50, y: 25 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-final'],
      knownCards: [],
      rules: ['high', 'plus', 'same', 'one']
    },
    {
      id: 'node-final',
      name: t('node-final.name'),
      description: t('node-final.desc'),
      // The peak of all elements
      npcDeck: ['eclipse-old', 'asha-old', 'cosmic-old', 'starlight-old', 'dragon-old', 'mermaid-old', 'scorpion-old', 'angel-old', 'snowman-old', 'imp-old', 'tardigrade-old', 'fox-old'],
      position: { x: 50, y: 15 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: [],
      knownCards: [],
      rules: ['high', 'plus', 'same', 'combo', 'all']
    },

    // --- TRACK 5: ABYSSAL SIDE-TRACK (LOW RULE) ---
    {
      id: 'node-s1',
      name: t('node-s1.name'),
      description: t('node-s1.desc'),
      // Focus: Cards with at least one '1' value
      npcDeck: ['mouse-young', 'snowman-young', 'piranha-young', 'mammoth-young', 'eel-young', 'female-young', 'butterfly-young', 'moss-young', 'demon-young', 'scorpion-young'],
      position: { x: 10, y: 30 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-s1-b', 'node-s1-c'],
      knownCards: [],
      rules: ['low', 'one']
    },
    {
      id: 'node-s1-b',
      name: t('node-s1-b.name'),
      description: t('node-s1-b.desc'),
      // Focus: Glass cannons (high right, low elsewhere)
      npcDeck: ['butterfly-young', 'mouse-young', 'demon-young', 'snowman-young', 'eel-young', 'dragon-young', 'scorpion-young', 'moss-young', 'mermaid-young', 'household-young', 'gruffalo-young'],
      position: { x: 8, y: 20 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-s2'],
      knownCards: [],
      rules: ['low', 'plus', 'random']
    },
    {
      id: 'node-s1-c',
      name: t('node-s1-c.name'),
      description: t('node-s1-c.desc'),
      // Same Rule + Low: Needs symmetrical but weak cards
      npcDeck: ['butterfly-young', 'demon-young', 'snowman-young', 'eel-young', 'cosmic-young', 'tardigrade-young', 'mouse-young', 'piranha-young', 'sirene-young', 'turtoise-young'],
      position: { x: 19, y: 22 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-s2'],
      knownCards: [],
      rules: ['low', 'same', 'conquered']
    },
    {
      id: 'node-s2',
      name: t('node-s2.name'),
      description: t('node-s2.desc'),
      // Undisputed King of Low: Brusta (Mouse) and Trydix (Demon)
      npcDeck: ['mouse-young', 'demon-young', 'cosmica-young', 'mushroom-young', 'butterfly-young', 'sirene-young', 'puppet-young', 'tardigrade-young', 'cosmic-young', 'cat-middle', 'fox-old'],
      position: { x: 6, y: 7 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: [],
      knownCards: [],
      rules: ['low', 'open', 'plus', 'same', 'combo', 'all']
    },

    // --- TRACK 6: EASTERN ARCHIPELAGO & REEF ---
    {
      id: 'node-a1',
      name: t('node-a1.name'),
      description: t('node-a1.desc'),
      npcDeck: ['turtoise-young', 'piranha-young', 'mermaid-young', 'sirene-young', 'eel-young', 'snowman-young', 'yeti-young', 'mammoth-young', 'cosmic-young', 'tardigrade-young', 'postman-middle'],
      position: { x: 80, y: 40 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-a2', 'node-ne1'],
      knownCards: [],
      rules: ['high', 'one']
    },
    {
      id: 'node-a2',
      name: t('node-a2.name'),
      description: t('node-a2.desc'),
      npcDeck: ['shark-middle', 'mermaid-middle', 'eel-middle', 'mammoth-middle', 'snowflower-middle', 'turtoise-middle', 'piranha-middle', 'yeti-middle', 'snogrin-middle', 'yetopa-middle', 'mormyx-middle'],
      position: { x: 68, y: 35 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-a3'],
      knownCards: [],
      rules: ['high', 'plus', 'one']
    },
    {
      id: 'node-a3',
      name: t('node-a3.name'),
      description: t('node-a3.desc'),
      npcDeck: ['mermaid-old', 'shark-middle', 'piranha-old', 'turtoise-old', 'starlight-old', 'snowman-old', 'angel-old', 'gorilla-old', 'female-old', 'asha-old', 'eclipse-old'],
      position: { x: 80, y: 23 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: [],
      knownCards: [],
      rules: ['high', 'plus', 'same', 'combo', 'random']
    },

    // --- TRACK 7: NORTH EASTERN ISLAND ---
    {
      id: 'node-ne1',
      name: t('node-ne1.name'),
      description: t('node-ne1.desc'),
      // Heavy Earth/Metal
      npcDeck: ['gargoyle-middle', 'bear-middle', 'armadillo-middle', 'scorpion-middle', 'gargoyle-old', 'armadillo-old', 'scorpion-old', 'gargoyle-young', 'gruffalo-young', 'mouse-old', 'fox-old'],
      position: { x: 92, y: 35 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-ne2'],
      knownCards: [],
      rules: ['high', 'same', 'one']
    },
    {
      id: 'node-ne2',
      name: t('node-ne2.name'),
      description: t('node-ne2.desc'),
      // Psi focus
      npcDeck: ['tardigrade-young', 'tardigrade-middle', 'nightmare-middle', 'wulfberry-middle', 'tardigrade-old', 'cosmic-middle', 'cosmic-old', 'starlight-old', 'demon-middle', 'hag-middle', 'harbringer-middle'],
      position: { x: 95, y: 15 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-ne3'],
      knownCards: [],
      rules: ['high', 'plus', 'open', 'one']
    },
    {
      id: 'node-ne3',
      name: t('node-ne3.name'),
      description: t('node-ne3.desc'),
      // Air & Light (Celestial)
      npcDeck: ['postman-middle', 'gorilla-middle', 'gorilla-old', 'griffin-middle', 'angel-old', 'pegasus-middle', 'starlight-old', 'cosmic-old', 'cosmic-middle', 'female-old', 'thunbee-middle', 'deer-middle'],
      position: { x: 91, y: 6 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: [],
      knownCards: [],
      rules: ['high', 'plus', 'same', 'combo', 'all']
    }
  ]

  watch(userCampaign, () => {
    if (typeof userCampaign.value === 'string') {
      const campaignList = JSON.parse(userCampaign.value)
      if (campaignList?.[0]) {
        campaignList[0].unlocked = true
      }
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