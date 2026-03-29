import { ref, computed, type ComputedRef, watch } from 'vue'
import useUser, { isDemo } from '@/use/useUser'
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

export interface MobileNode {
  id: string
  positionPortrait: { x: number; y: number }
  positionLandscape: { x: number; y: number }
}


export const demoCampaignNodes: Array<{ id: string }> = [
  // --- TRACK 1: WESTERN COAST ---
  { id: 'node-w1' },
  { id: 'node-w1-b' },
  { id: 'node-w-chal' },
  { id: 'node-w-all' },
  // --- TRACK 2: EASTERN DESERT ---
  { id: 'node-e1' },
  { id: 'node-e1-b' },
  { id: 'node-e-chal' },
  { id: 'node-e2' },

  { id: 'node-w2' },
  { id: 'node-e2-b' }
]

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
    // --- TRACK 1: WESTERN COAST (Nature & Water) ---
    {
      id: 'node-w1',
      name: t('node-w1.name'),
      description: t('node-w1.desc'),
      // Node 1: 100% Young Nature/Water/Neutral
      npcDeck: ['mermaid-young', 'moss-young', 'mushroom-young', 'piranha-young', 'sirene-young', 'turtoise-young', 'cosmica-young', 'butterfly-young', 'dragon-young', 'snowman-young'],
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
      // Node 2: 100% Young Metal/Earth/Neutral
      npcDeck: ['scorpion-young', 'piranha-young', 'warrior-young', 'dragon-young', 'gruffalo-young', 'gargoyle-young', 'cosmic-young', 'tardigrade-young', 'eel-young'],
      position: { x: 38, y: 68 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-w2', 'node-w-all'],
      knownCards: [],
      rules: ['high', 'one']
    },
    {
      id: 'node-w-chal',
      name: t('node-w-chal.name'),
      description: t('node-w-chal.desc'),
      // Side Challenge (Branch of Node 1): Intro to Middle Air cards (20% Middle)
      npcDeck: ['postman-middle', 'butterfly-middle', 'sirene-young', 'scorpion-young', 'warrior-young', 'gruffalo-young', 'gargoyle-young', 'mouse-young', 'cosmic-young', 'eel-young'],
      position: { x: 42, y: 82 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-w2'],
      knownCards: [],
      rules: ['high', 'plus', 'same', 'one']
    },
    {
      id: 'node-w-all',
      name: t('node-w-all.name'),
      description: t('node-w-all.desc'),
      // Side Challenge (Branch of challenge Node 1): Intro to all rule cards (young only)
      npcDeck: ['postman-middle', 'butterfly-middle', 'sirene-young', 'shark-young', 'mermaid-young', 'scorpion-young', 'turtoise-young', 'mushroom-young', 'warrior-young', 'gruffalo-young', 'gargoyle-young', 'mouse-young', 'cosmic-young', 'eel-young'],
      position: { x: 22, y: 65 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: [],
      knownCards: [],
      rules: ['high', 'plus', 'same', 'combo', 'all']
    },
    {
      id: 'node-w2',
      name: t('node-w2.name'),
      description: t('node-w2.desc'),
      // Node 3: 10% Middle cards (Teaser)
      npcDeck: ['mermaid-young', 'shark-young', 'shark-middle', 'piranha-young', 'turtoise-young', 'mushroom-young', 'imp-middle', 'puppet-young', 'porcupine-middle', 'mouse-young'],
      position: { x: 60, y: 65 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-w2-b'],
      knownCards: [],
      rules: ['high', 'same', 'all']
    },
    {
      id: 'node-w2-b',
      name: t('node-w2-b.name'),
      description: t('node-w2-b.desc'),
      // Node 4: 1/3rd Middle Tier (As requested)
      npcDeck: ['mermaid-middle', 'shark-middle', 'piranha-middle', 'turtoise-young', 'eel-young', 'mammoth-young', 'snowflower-middle', 'pegasus-middle', 'warrior-young', 'hag-middle'],
      position: { x: 45, y: 60 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-w3', 'node-c0'],
      knownCards: [],
      rules: ['high', 'open', 'conquered']
    },
    {
      id: 'node-w3',
      name: t('node-w3.name'),
      description: t('node-w3.desc'),
      // Mid-way West: Mostly Middle, first glimpse of Old (10% Old)
      npcDeck: ['mermaid-old', 'shark-middle', 'piranha-middle', 'starlight-old', 'warrior-middle', 'turtoise-middle', 'eel-middle', 'griffin-middle', 'bear-middle', 'cat-middle'],
      position: { x: 28, y: 45 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-s1'],
      knownCards: [],
      rules: ['high', 'plus', 'combo', 'open', 'random']
    },

    // --- TRACK 2: EASTERN DESERT (Fire & Metal) ---
    {
      id: 'node-e1',
      name: t('node-e1.name'),
      description: t('node-e1.desc'),
      // Node 1: 100% Young Fire/Metal
      npcDeck: ['dragon-young', 'scorpion-young', 'warrior-young', 'household-young', 'mouse-young', 'gruffalo-young', 'snowman-young', 'piranha-young', 'puppet-young', 'cosmica-young'],
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
      // Node 2: 100% Young Neutral/Metal
      npcDeck: ['warrior-young', 'household-young', 'shark-young', 'scorpion-young', 'dragon-young', 'gruffalo-young', 'puppet-young', 'cosmic-young', 'female-young', 'eel-young'],
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
      // Side Challenge East: 30% Middle cards
      npcDeck: ['nightmare-middle', 'bear-middle', 'fox-middle', 'scorpion-young', 'porcupine-middle', 'demon-young', 'cat-middle', 'yeti-young', 'mammoth-young', 'wulfberry-middle'],
      position: { x: 95, y: 65 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-e2'],
      knownCards: [],
      rules: ['high', 'open', 'same', 'all']
    },
    {
      id: 'node-e2',
      name: t('node-e2.name'),
      description: t('node-e2.desc'),
      // Node 3: 10% Middle cards
      npcDeck: ['dragon-middle', 'porcupine-middle', 'dragon-young', 'armadillo-middle', 'tardigrade-young', 'mouse-young', 'gargoyle-young', 'household-young', 'warrior-young'],
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
      // Node 4: 1/3rd Middle Tier
      npcDeck: ['demon-young', 'dragon-middle', 'gargoyle-middle', 'mushroom-young', 'butterfly-young', 'gargoyle-young', 'fox-middle', 'bear-middle', 'wulfberry-middle', 'tardigrade-young'],
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
      // Transition to late game: 60% Middle, 30% Old
      npcDeck: ['dragon-old', 'fox-old', 'scorpion-old', 'armadillo-old', 'gargoyle-old', 'mouse-middle', 'warrior-middle', 'deer-middle', 'asha-old', 'starlight-old'],
      position: { x: 72, y: 48 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-c0', 'node-a1'],
      knownCards: [],
      rules: ['high', 'same', 'conquered']
    },

    // --- TRACK 3: CENTRAL CONVERGENCE (The Mixing Point) ---
    {
      id: 'node-c0',
      name: t('node-c0.name'),
      description: t('node-c0.desc'),
      // Convergence Start: 80% Middle, 20% Young
      npcDeck: ['moss-young', 'mushroom-middle', 'butterfly-middle', 'cosmic-middle', 'gargoyle-middle', 'bear-middle', 'griffin-middle', 'warrior-middle', 'shark-middle', 'piranha-middle', 'sirene-young', 'porcupine-middle', 'demon-middle'],
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
      // 50/50 Middle and Old mix
      npcDeck: ['tardigrade-middle', 'nightmare-middle', 'mushroom-middle', 'wulfberry-middle', 'gargoyle-old', 'armadillo-old', 'cosmic-old', 'gorilla-middle', 'griffin-middle', 'asha-old', 'cosmic-middle', 'hag-middle'],
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
      // Higher tier Air mix: 70% Middle, 30% Old
      npcDeck: ['griffin-middle', 'gorilla-old', 'harpy-middle', 'dragon-old', 'gargoyle-old', 'tardigrade-middle', 'nightmare-middle', 'postman-middle', 'female-middle', 'pegasus-middle', 'eel-middle'],
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
      // High-tier Convergence: 90% Old Tier
      npcDeck: ['tardigrade-old', 'starlight-old', 'mouse-old', 'cosmic-old', 'gorilla-old', 'angel-old', 'female-old', 'snowman-old', 'dragon-old', 'mermaid-old', 'eclipse-old', 'imp-old'],
      position: { x: 45, y: 32 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-f1'],
      knownCards: [],
      rules: ['high', 'same', 'plus', 'combo', 'random']
    },

    // --- TRACK 4: FINAL SUMMIT (The Peak) ---
    {
      id: 'node-f1',
      name: t('node-f1.name'),
      description: t('node-f1.desc'),
      // The Elite Gatekeeper: 100% Old
      npcDeck: ['armadillo-old', 'dragon-old', 'scorpion-old', 'gargoyle-old', 'fox-old', 'asha-old', 'female-old', 'snowman-old', 'imp-old', 'tardigrade-old'],
      position: { x: 52, y: 22 },
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
      // The Final Boss: Peak cards only
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
      // Start of Abyss: 100% Young with '1' values
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
      // Abyss Step 2: 90% Young
      npcDeck: ['butterfly-young', 'mouse-young', 'demon-young', 'snowman-young', 'eel-young', 'dragon-young', 'scorpion-young', 'moss-young', 'mermaid-young', 'household-young', 'cat-middle'],
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
      // Abyss Step 2 Alt: Symmetrical weak cards
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
      // Abyss Peak: Strong cards that are weak in values (Old tier strategically used)
      npcDeck: ['mouse-young', 'demon-young', 'cosmica-young', 'mushroom-young', 'butterfly-young', 'fox-old', 'puppet-young', 'tardigrade-young', 'cosmic-young', 'cat-middle'],
      position: { x: 6, y: 7 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: [],
      knownCards: [],
      rules: ['low', 'open', 'plus', 'same', 'combo', 'all']
    },

    // --- TRACK 6: ARCHIPELAGO (Aquatic Late-game) ---
    {
      id: 'node-a1',
      name: t('node-a1.name'),
      description: t('node-a1.desc'),
      // Branching from Mid-game: 50/50 split
      npcDeck: ['turtoise-middle', 'piranha-middle', 'mermaid-middle', 'sirene-young', 'eel-middle', 'snowman-young', 'yeti-young', 'mammoth-middle', 'cosmic-young', 'tardigrade-young'],
      position: { x: 80, y: 40 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-a2', 'node-ne1'],
      knownCards: [],
      rules: ['low', 'conquered']
    },
    {
      id: 'node-a2',
      name: t('node-a2.name'),
      description: t('node-a2.desc'),
      // Late-game Reef: 80% Middle, 20% Old
      npcDeck: ['shark-middle', 'mermaid-old', 'piranha-old', 'yeti-middle', 'eel-middle', 'mammoth-middle', 'snowflower-middle', 'turtoise-old', 'piranha-middle', 'snowman-middle', 'shark-young'],
      position: { x: 68, y: 35 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: ['node-a3'],
      knownCards: [],
      rules: ['high', 'plus', 'conquered']
    },
    {
      id: 'node-a3',
      name: t('node-a3.name'),
      description: t('node-a3.desc'),
      // Deep Ocean: 100% Old
      npcDeck: ['mermaid-old', 'piranha-old', 'turtoise-old', 'starlight-old', 'snowman-old', 'angel-old', 'gorilla-old', 'female-old', 'asha-old', 'eclipse-old', 'scorpion-old'],
      position: { x: 80, y: 23 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: [],
      knownCards: [],
      rules: ['high', 'plus', 'same', 'combo', 'all']
    },

    // --- TRACK 7: NORTH EASTERN ISLAND (Endgame Psi/Metal) ---
    {
      id: 'node-ne1',
      name: t('node-ne1.name'),
      description: t('node-ne1.desc'),
      // Heavy Earth/Metal: 70% Old
      npcDeck: ['bear-middle', 'imp-middle', 'mushroom-middle', 'harbringer-middle', 'harpy-middle', 'deer-middle', 'gargoyle-middle', 'armadillo-middle', 'scorpion-middle', 'gargoyle-old', 'mouse-middle', 'fox-old'],
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
      // Psi focus: 90% Old
      npcDeck: ['mouse-old', 'snowman-middle', 'yeti-middle', 'gorilla-middle', 'gorilla-old', 'wulfberry-middle', 'scorpion-middle', 'harpy-middle', 'cosmic-old', 'female-middle', 'demon-middle', 'hag-middle', 'harbringer-middle', 'tardigrade-old'],
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
      // Celestial Peak: 100% Old
      npcDeck: ['gorilla-old', 'angel-old', 'starlight-old', 'cosmic-old', 'female-old', 'dragon-old', 'asha-old', 'eclipse-old', 'scorpion-old', 'tardigrade-old'],
      position: { x: 91, y: 6 },
      unlocked: isCampaignTest.value ? true : false,
      completed: false,
      unlocks: [],
      knownCards: [],
      rules: ['high', 'plus', 'same', 'combo', 'all']
    }
  ]

  const mobileNodes: MobileNode[] = [
    // --- TRACK 1: WESTERN COAST ---
    {
      id: 'node-w1',
      positionPortrait: { x: 23, y: 88 }, // Green Oasis
      positionLandscape: { x: 44, y: 93 }
    },
    {
      id: 'node-w1-b',
      positionPortrait: { x: 48, y: 75 },
      positionLandscape: { x: 53, y: 85 }
    },
    {
      id: 'node-w-chal',
      positionPortrait: { x: 55, y: 86 },
      positionLandscape: { x: 68, y: 92 }
    },
    {
      id: 'node-w-all',
      positionPortrait: { x: 33, y: 76 },
      positionLandscape: { x: 46, y: 78 }
    },
    {
      id: 'node-w2',
      positionPortrait: { x: 53, y: 60 }, // Reefhaven
      positionLandscape: { x: 54, y: 68 }
    },
    {
      id: 'node-w2-b',
      positionPortrait: { x: 26, y: 54 },
      positionLandscape: { x: 38, y: 60 }
    },
    {
      id: 'node-w3',
      positionPortrait: { x: 20, y: 32 }, // Pineguard
      positionLandscape: { x: 18, y: 48 }
    },

    // --- TRACK 2: EASTERN DESERT ---
    {
      id: 'node-e1',
      positionPortrait: { x: 68, y: 88 }, // Red Sands
      positionLandscape: { x: 78, y: 92 }
    },
    {
      id: 'node-e1-b',
      positionPortrait: { x: 88, y: 82 },
      positionLandscape: { x: 91, y: 92 }
    },
    {
      id: 'node-e-chal',
      positionPortrait: { x: 92, y: 76 }, // Sunshade
      positionLandscape: { x: 95, y: 78 }
    },
    {
      id: 'node-e2',
      positionPortrait: { x: 77, y: 78 },
      positionLandscape: { x: 83, y: 83 }
    },
    {
      id: 'node-e2-b',
      positionPortrait: { x: 74, y: 70 }, // River delta
      positionLandscape: { x: 78, y: 72 }
    },
    {
      id: 'node-e3',
      positionPortrait: { x: 72, y: 46 },  // Ashhold
      positionLandscape: { x: 61, y: 45 }
    },

    // --- TRACK 3: CENTRAL CONVERGENCE ---
    {
      id: 'node-c0',
      positionPortrait: { x: 51, y: 50 },
      positionLandscape: { x: 51, y: 50 }
    },
    {
      id: 'node-c1',
      positionPortrait: { x: 35, y: 45 }, // Highrock
      positionLandscape: { x: 44, y: 37 }
    },
    {
      id: 'node-c1-b',
      positionPortrait: { x: 43, y: 28 }, // Twin Peaks
      positionLandscape: { x: 48, y: 22 }
    },
    {
      id: 'node-c2',
      positionPortrait: { x: 56, y: 20 },
      positionLandscape: { x: 55, y: 10 }
    },

    // --- TRACK 4: FINAL SUMMIT ---
    {
      id: 'node-f1',
      positionPortrait: { x: 48, y: 14 },
      positionLandscape: { x: 37, y: 20 }
    },
    {
      id: 'node-final',
      positionPortrait: { x: 50, y: 9 }, // Mount Cinder Peak
      positionLandscape: { x: 31, y: 14 }
    },

    // --- TRACK 5: ABYSSAL SIDE-TRACK ---
    {
      id: 'node-s1',
      positionPortrait: { x: 12, y: 21 },
      positionLandscape: { x: 6, y: 40 }
    },
    {
      id: 'node-s1-b',
      positionPortrait: { x: 6, y: 15 },
      positionLandscape: { x: 3, y: 28 }
    },
    {
      id: 'node-s1-c',
      positionPortrait: { x: 21, y: 14 },
      positionLandscape: { x: 12, y: 26 }
    },
    {
      id: 'node-s2',
      positionPortrait: { x: 6, y: 4 },
      positionLandscape: { x: 6, y: 9 }
    },

    // --- TRACK 6: EASTERN ARCHIPELAGO & REEF ---
    {
      id: 'node-a1',
      positionPortrait: { x: 82, y: 31 },
      positionLandscape: { x: 73, y: 24 }
    },
    {
      id: 'node-a2',
      positionPortrait: { x: 72, y: 27 },
      positionLandscape: { x: 70, y: 11 }
    },
    {
      id: 'node-a3',
      positionPortrait: { x: 78, y: 15 },
      positionLandscape: { x: 87, y: 25 }
    },

    // --- TRACK 7: NORTH EASTERN ISLAND ---
    {
      id: 'node-ne1',
      positionPortrait: { x: 92, y: 23 },
      positionLandscape: { x: 96, y: 44 }
    },
    {
      id: 'node-ne2',
      positionPortrait: { x: 95, y: 8 },
      positionLandscape: { x: 96, y: 19 }
    },
    {
      id: 'node-ne3',
      positionPortrait: { x: 91, y: 3 },
      positionLandscape: { x: 92, y: 8 }
    }
  ]

  watch(userCampaign, () => {
    if (typeof userCampaign.value === 'string') {
      const campaignList = JSON.parse(userCampaign.value)
      if (campaignList?.[0]) {
        campaignList[0].unlocked = true
      }

      const demoRelevantNodes = JSON.parse(JSON.stringify(demoCampaignNodes))
      demoRelevantNodes.pop()
      demoRelevantNodes.pop()
      campaignList?.forEach((saved: any) => {
        const node = campaignNodes.value.find(n => n.id === saved.id)
        if (node) {
          node.completed = saved.completed
          node.knownCards = saved.knownCards || []
          // If a node is completed, unlock its children
          if (node.completed) {
            if (isDemo && !demoRelevantNodes.some(demo => demo.id === node.id)) return

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

    const demoRelevantNodes = JSON.parse(JSON.stringify(demoCampaignNodes))
    demoRelevantNodes.pop()
    demoRelevantNodes.pop()

    oldNode.completed = true
    oldNode.knownCards = currentNode.knownCards
    oldNode.unlocks.forEach(nextId => {
      if (isDemo && !demoRelevantNodes.some(demo => demo.id === nextId)) return

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
    mobileNodes,
    selectedNodeId,
    saveCampaign,
    activeNode,
    completeNode
  }
}

export default useCampaign