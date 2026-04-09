import { prependBaseUrl } from '@/utils/function'
import { type Element, ELEMENTS } from '@/utils/enums'
import { isCampaignTest, isDbInitialized, isDebug, isChibiTheme } from '@/use/useMatch'
import useUser from '@/use/useUser'
import { computed, watch } from 'vue'

export const modelImgPath = (id: string, element: string) => {
  try {
    if (!element) throw new Error('Element is required')
  } catch (error) {
    console.error('Error in modelImgPath:', error)
    return ''
  }
  if (isChibiTheme.value === true) {
    return prependBaseUrl(`models/chibi/${element}/${id}_400x400.webp`)
  }
  return prependBaseUrl(`models/${element}/${id}_400x400.webp`)
}

/**
 * models
 */
export interface Card {
  id: string
  name: string
  element: Element
  values: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

export type InventoryCard = Card & { count: number }

export interface StoredCollectionCard {
  id: string
  count: number
}

const useModels = () => {
  const allCards: Card[] = [
    /* AIR */
    { id: 'postman-middle', name: 'Quicklin', element: ELEMENTS.AIR, values: { top: 4, right: 5, bottom: 8, left: 4 } }, // Total: 21
    // Adjusted: Total 22 (Middle). Pushed top and bottom to make it a great vertical slotting card.
    { id: 'gorilla-middle', name: 'Gondix', element: ELEMENTS.AIR, values: { top: 8, right: 5, bottom: 8, left: 1 } },
    { id: 'gorilla-old', name: 'Gondoron', element: ELEMENTS.AIR, values: { top: 10, right: 7, bottom: 6, left: 7 } }, // Total: 30
    { id: 'griffin-middle', name: 'Frindol', element: ELEMENTS.AIR, values: { top: 4, right: 5, bottom: 10, left: 3 } }, // Total: 22
    // Adjusted: Total 28 (Old). Strong vertical presence + left defense, highly vulnerable on the right.
    { id: 'angel-old', name: 'Anduriel', element: ELEMENTS.AIR, values: { top: 8, right: 2, bottom: 10, left: 8 } },

    /* DARK */
    // Adjusted: Total 32 (Old). Buffed to make it a premium horizontal sweeper.
    { id: 'eclipse-old', name: 'Eclipse', element: ELEMENTS.DARK, values: { top: 6, right: 10, bottom: 6, left: 10 } },
    // Adjusted: Total 16 (Young). Lowered right to 1, buffed top to 8. Excellent vertical specialist for early game.
    { id: 'cosmica-young', name: 'Cosmak', element: ELEMENTS.DARK, values: { top: 8, right: 6, bottom: 1, left: 1 } },
    // Adjusted: Total 13 (Young). Lowered top/right/left to make it an amazing card for the 'Low' rule, while retaining a strong bottom defense.
    { id: 'demon-young', name: 'Trydix', element: ELEMENTS.DARK, values: { top: 1, right: 2, bottom: 8, left: 2 } },
    // Adjusted: Total 23 (Middle). Kept as a solid all-rounder.
    { id: 'demon-middle', name: 'Trydonyx', element: ELEMENTS.DARK, values: { top: 4, right: 7, bottom: 8, left: 4 } },
    { id: 'hag-middle', name: 'Hago', element: ELEMENTS.DARK, values: { top: 7, right: 8, bottom: 4, left: 5 } }, // Total: 24
    // Adjusted: Total 25 (Middle). Was 26, slightly nerfed to fit strict Middle tier limits.
    {
      id: 'harbringer-middle',
      name: 'Harbringer',
      element: ELEMENTS.DARK,
      values: { top: 6, right: 9, bottom: 5, left: 5 }
    },
    // Adjusted: Total 20 (Middle). Converted into a sharp vertical card, terrible sides.
    { id: 'cat-middle', name: 'Ceya', element: ELEMENTS.DARK, values: { top: 8, right: 2, bottom: 8, left: 2 } },
    // Adjusted: Total 28 (Old). Buffed from 24 to 28 so it fits the Old tier as a dominant vertical threat.
    { id: 'asha-old', name: 'Asha', element: ELEMENTS.DARK, values: { top: 10, right: 4, bottom: 10, left: 4 } },

    /* FIRE */
    { id: 'dragon-young', name: 'Dragir', element: ELEMENTS.FIRE, values: { top: 4, right: 4, bottom: 2, left: 3 } }, // Total: 13
    { id: 'dragon-middle', name: 'Dragorin', element: ELEMENTS.FIRE, values: { top: 7, right: 6, bottom: 3, left: 5 } }, // Total: 21
    { id: 'dragon-old', name: 'Dragoire', element: ELEMENTS.FIRE, values: { top: 10, right: 8, bottom: 3, left: 7 } }, // Total: 28
    // Adjusted: Lowered total to 18 (Middle). Made it an extreme top-right corner card (8s) with terrible bottom-left (1s).
    { id: 'fox-middle', name: 'Lucara', element: ELEMENTS.FIRE, values: { top: 8, right: 8, bottom: 1, left: 1 } },
    // Adjusted: Total 27 (Old). Very strong horizontal attacker, incredibly weak vertical defender. Great for 'Low' rule on top/bottom.
    { id: 'fox-old', name: 'Lucantras', element: ELEMENTS.FIRE, values: { top: 2, right: 8, bottom: 7, left: 10 } },
    // Adjusted: Total 19 (Middle). Pushed values to make it a sharp top-left attacker.
    { id: 'harpy-middle', name: 'Harpire', element: ELEMENTS.FIRE, values: { top: 8, right: 2, bottom: 2, left: 7 } },

    /* EARTH */
    // Adjusted: Total 27 (Old). A behemoth on the bottom/right, but extremely vulnerable to top attacks.
    { id: 'gargoyle-old', name: 'Goygorix', element: ELEMENTS.EARTH, values: { top: 2, right: 9, bottom: 9, left: 7 } },
    // Adjusted: Total 23 (Middle). Pushed right/bottom slightly higher to match its older counterpart's playstyle.
    {
      id: 'gargoyle-middle',
      name: 'Goygorin',
      element: ELEMENTS.EARTH,
      values: { top: 5, right: 7, bottom: 7, left: 4 }
    },
    { id: 'gargoyle-young', name: 'Goygor', element: ELEMENTS.EARTH, values: { top: 3, right: 4, bottom: 4, left: 2 } }, // Total: 12
    // Adjusted: Total 15 (Young). Nerfed from 17 to fit Young tier. Strong right attacker.
    { id: 'gruffalo-young', name: 'Graffo', element: ELEMENTS.EARTH, values: { top: 2, right: 6, bottom: 2, left: 5 } },
    // Adjusted: Total 24 (Middle). Perfectly symmetrical. Incredibly powerful for triggering the 'Same' rule.
    { id: 'bear-middle', name: 'Groz', element: ELEMENTS.EARTH, values: { top: 6, right: 6, bottom: 6, left: 6 } },

    /* ENERGY */
    { id: 'female-young', name: 'Thunbee', element: ELEMENTS.ENERGY, values: { top: 3, right: 2, bottom: 7, left: 3 } }, // Total: 15
    {
      id: 'female-middle',
      name: 'Thunbee',
      element: ELEMENTS.ENERGY,
      values: { top: 5, right: 8, bottom: 3, left: 7 }
    }, // Total: 23
    // Adjusted: Total 28 (Old). Made it a fierce bottom/top attacker.
    { id: 'female-old', name: 'Thunlady', element: ELEMENTS.ENERGY, values: { top: 9, right: 4, bottom: 10, left: 5 } },
    // Adjusted: Total 13 (Young). Shifted power to the top, weak bottom.
    { id: 'eel-young', name: 'Ely', element: ELEMENTS.ENERGY, values: { top: 7, right: 3, bottom: 1, left: 2 } },
    // Adjusted: Total 21 (Middle). Similar top-heavy playstyle.
    { id: 'eel-middle', name: 'Elix', element: ELEMENTS.ENERGY, values: { top: 8, right: 4, bottom: 2, left: 7 } },
    { id: 'deer-middle', name: 'Ronin', element: ELEMENTS.ENERGY, values: { top: 2, right: 4, bottom: 8, left: 7 } }, // Total: 21

    /* ICE */
    { id: 'snowman-old', name: 'Snokong', element: ELEMENTS.ICE, values: { top: 10, right: 9, bottom: 7, left: 2 } }, // Total: 26 (Top right corner beast)
    { id: 'snowman-middle', name: 'Snogrin', element: ELEMENTS.ICE, values: { top: 7, right: 7, bottom: 2, left: 2 } }, // Total: 18
    { id: 'snowman-young', name: 'Snowy', element: ELEMENTS.ICE, values: { top: 5, right: 4, bottom: 1, left: 1 } }, // Total: 11
    // Adjusted: Total 20 (Middle). Extreme corner strategy card.
    { id: 'yeti-middle', name: 'Yetopa', element: ELEMENTS.ICE, values: { top: 9, right: 8, bottom: 1, left: 2 } },
    { id: 'yeti-young', name: 'Yethog', element: ELEMENTS.ICE, values: { top: 6, right: 5, bottom: 1, left: 2 } }, // Total: 14
    { id: 'mammoth-middle', name: 'Mormyx', element: ELEMENTS.ICE, values: { top: 7, right: 8, bottom: 1, left: 5 } }, // Total: 21
    { id: 'mammoth-young', name: 'Mormon', element: ELEMENTS.ICE, values: { top: 1, right: 2, bottom: 5, left: 5 } }, // Total: 13
    {
      id: 'snowflower-middle',
      name: 'Mormon',
      element: ELEMENTS.ICE,
      values: { top: 7, right: 3, bottom: 5, left: 6 }
    }, // Total: 21

    /* NATURE */
    // Adjusted: Total 15 (Young). Nerfed from 18 to fit Young tier. Solid bottom defense.
    { id: 'moss-young', name: 'Bogy', element: ELEMENTS.NATURE, values: { top: 3, right: 3, bottom: 6, left: 3 } },
    // Adjusted: Total 19 (Middle). Made it a distinct left-side attacker.
    {
      id: 'mushroom-middle',
      name: 'Mushiddle',
      element: ELEMENTS.NATURE,
      values: { top: 6, right: 2, bottom: 3, left: 8 }
    },
    {
      id: 'mushroom-young',
      name: 'Mushyu',
      element: ELEMENTS.NATURE,
      values: { top: 4, right: 2, bottom: 2, left: 5 }
    }, // Total: 13
    // Adjusted: Total 11 (Young). A true "glass cannon" for the early game. 8 on the right, 1s everywhere else. Great for Low rule.
    {
      id: 'butterfly-young',
      name: 'Dandal',
      element: ELEMENTS.NATURE,
      values: { top: 1, right: 8, bottom: 1, left: 1 }
    },
    {
      id: 'butterfly-middle',
      name: 'Dandalina',
      element: ELEMENTS.NATURE,
      values: { top: 5, right: 3, bottom: 5, left: 6 }
    }, // Total: 19
    { id: 'imp-middle', name: 'Horix', element: ELEMENTS.NATURE, values: { top: 5, right: 4, bottom: 7, left: 6 } }, // Total: 22
    { id: 'imp-old', name: 'Horxcoire', element: ELEMENTS.NATURE, values: { top: 7, right: 7, bottom: 5, left: 10 } }, // Total: 29

    /* NEUTRAL */
    {
      id: 'warrior-middle',
      name: 'Verona',
      element: ELEMENTS.NEUTRAL,
      values: { top: 7, right: 4, bottom: 8, left: 4 }
    }, // Total: 23
    { id: 'warrior-young', name: 'Vera', element: ELEMENTS.NEUTRAL, values: { top: 5, right: 2, bottom: 6, left: 2 } }, // Total: 15
    // Adjusted: Total 14 (Young). Nerfed from 18 to fit tier.
    {
      id: 'household-young',
      name: 'Housyu',
      element: ELEMENTS.NEUTRAL,
      values: { top: 1, right: 6, bottom: 2, left: 5 }
    },
    // Adjusted: Total 11 (Young). The weakest card in the game, making it the undisputed King of the 'Low' rule.
    { id: 'mouse-young', name: 'Brusta', element: ELEMENTS.NEUTRAL, values: { top: 1, right: 2, bottom: 3, left: 5 } },
    // Adjusted: Total 18 (Middle). Huge top/right bias, totally useless bottom/left.
    { id: 'mouse-middle', name: 'Klopix', element: ELEMENTS.NEUTRAL, values: { top: 8, right: 7, bottom: 2, left: 1 } },
    // Adjusted: Total 27 (Old). A solid offensive card with a glaring weakness on the left.
    {
      id: 'mouse-old',
      name: 'Kloparasa',
      element: ELEMENTS.NEUTRAL,
      values: { top: 10, right: 8, bottom: 8, left: 1 }
    },
    {
      id: 'porcupine-middle',
      name: 'Porque',
      element: ELEMENTS.NEUTRAL,
      values: { top: 4, right: 5, bottom: 4, left: 6 }
    }, // Total: 19

    /* LIGHT */
    // Adjusted: Total 15 (Young). Nerfed from 19 to fit tier.
    { id: 'puppet-young', name: 'Toyus', element: ELEMENTS.LIGHT, values: { top: 2, right: 6, bottom: 2, left: 5 } },
    { id: 'pegasus-middle', name: 'Gasus', element: ELEMENTS.LIGHT, values: { top: 5, right: 7, bottom: 7, left: 5 } }, // Total: 24
    // Adjusted: Total 32 (Old). Buffed from 24. A perfect symmetrical 8s card. Terrifyingly consistent for the 'Same' rule.
    {
      id: 'starlight-old',
      name: 'Starlight',
      element: ELEMENTS.LIGHT,
      values: { top: 8, right: 8, bottom: 8, left: 8 }
    },
    // Adjusted: Total 15 (Young). Nerfed from 19.
    { id: 'cosmic-young', name: 'Cosma', element: ELEMENTS.LIGHT, values: { top: 4, right: 4, bottom: 3, left: 4 } },
    // Adjusted: Total 24 (Middle). Shifted stats towards the top/left.
    { id: 'cosmic-middle', name: 'Cosmica', element: ELEMENTS.LIGHT, values: { top: 8, right: 6, bottom: 3, left: 7 } },
    // Adjusted: Total 31 (Old). Insane horizontal dominance.
    { id: 'cosmic-old', name: 'Universa', element: ELEMENTS.LIGHT, values: { top: 9, right: 10, bottom: 10, left: 3 } },

    /* METAL */
    // Adjusted: Total 13 (Young). Sharp top attack, weak elsewhere.
    { id: 'scorpion-young', name: 'Metlor', element: ELEMENTS.METAL, values: { top: 6, right: 2, bottom: 1, left: 4 } },
    // Adjusted: Total 22 (Middle). Matches the left-leaning weakness of the younger version.
    {
      id: 'scorpion-middle',
      name: 'Metalord',
      element: ELEMENTS.METAL,
      values: { top: 7, right: 4, bottom: 3, left: 8 }
    },
    // Adjusted: Total 29 (Old). Adjusted for a strong top/right presence.
    { id: 'scorpion-old', name: 'Scorgon', element: ELEMENTS.METAL, values: { top: 8, right: 10, bottom: 2, left: 9 } },
    {
      id: 'armadillo-middle',
      name: 'Armanco',
      element: ELEMENTS.METAL,
      values: { top: 4, right: 3, bottom: 8, left: 6 }
    }, // Total: 21
    // Adjusted: Total 30 (Old). Huge corner card for the end game.
    {
      id: 'armadillo-old',
      name: 'Armancorix',
      element: ELEMENTS.METAL,
      values: { top: 10, right: 4, bottom: 7, left: 9 }
    },

    /* PSI */
    // Adjusted: Total 21 (Middle). Nerfed from 26. Extreme top-left corner (9s) with terrible bottom-right (1s, 2s) for strategy.
    {
      id: 'nightmare-middle',
      name: 'Nightsong',
      element: ELEMENTS.PSI,
      values: { top: 9, right: 1, bottom: 2, left: 9 }
    },
    { id: 'wulfberry-middle', name: 'Berrya', element: ELEMENTS.PSI, values: { top: 7, right: 9, bottom: 2, left: 7 } }, // Total: 25
    // Adjusted: Total 14 (Young). Nerfed from 18 to fit tier.
    { id: 'tardigrade-young', name: 'Psyon', element: ELEMENTS.PSI, values: { top: 5, right: 2, bottom: 2, left: 5 } },
    {
      id: 'tardigrade-middle',
      name: 'Psycron',
      element: ELEMENTS.PSI,
      values: { top: 4, right: 8, bottom: 6, left: 6 }
    }, // Total: 24
    { id: 'tardigrade-old', name: 'Psyconix', element: ELEMENTS.PSI, values: { top: 7, right: 9, bottom: 9, left: 4 } }, // Total: 29

    /* WATER */
    { id: 'mermaid-young', name: 'Merry', element: ELEMENTS.WATER, values: { top: 3, right: 2, bottom: 3, left: 5 } }, // Total: 13
    // Adjusted: Total 22 (Middle). Pushed top/left to make it a distinct corner card.
    {
      id: 'mermaid-middle',
      name: 'Meriddle',
      element: ELEMENTS.WATER,
      values: { top: 7, right: 2, bottom: 6, left: 7 }
    },
    { id: 'mermaid-old', name: 'Merquen', element: ELEMENTS.WATER, values: { top: 8, right: 4, bottom: 8, left: 9 } }, // Total: 29
    {
      id: 'shark-middle',
      name: 'Sharkoryn',
      element: ELEMENTS.WATER,
      values: { top: 4, right: 8, bottom: 4, left: 7 }
    }, // Total: 23
    // Adjusted: Total 14 (Young). Gave it a 7 on the right, making it a threatening early game sniper.
    { id: 'shark-young', name: 'Sharky', element: ELEMENTS.WATER, values: { top: 2, right: 7, bottom: 1, left: 4 } },
    // Adjusted: Total 28 (Old). Made it an aggressive top/right attacker, leaving the bottom heavily exposed.
    { id: 'piranha-old', name: 'Piradon', element: ELEMENTS.WATER, values: { top: 9, right: 9, bottom: 2, left: 8 } },
    // Adjusted: Total 22 (Middle). Adjusted to be a minor version of the Old card above.
    { id: 'piranha-middle', name: 'Pirin', element: ELEMENTS.WATER, values: { top: 6, right: 6, bottom: 3, left: 7 } },
    { id: 'piranha-young', name: 'Pira', element: ELEMENTS.WATER, values: { top: 3, right: 3, bottom: 3, left: 4 } }, // Total: 13
    { id: 'sirene-young', name: 'Siri', element: ELEMENTS.WATER, values: { top: 4, right: 5, bottom: 3, left: 2 } }, // Total: 14
    // Adjusted: Total 15 (Young). Nerfed from 17 to fit Young tier. Strong right/left defense.
    { id: 'turtoise-young', name: 'Quada', element: ELEMENTS.WATER, values: { top: 1, right: 6, bottom: 4, left: 4 } },
    // Adjusted: Total 22 (Middle). Balanced as a horizontal defender.
    {
      id: 'turtoise-middle',
      name: 'Quadira',
      element: ELEMENTS.WATER,
      values: { top: 4, right: 7, bottom: 4, left: 7 }
    },
    // Adjusted: Total 29 (Old). Huge bottom defense (10), fitting a giant old tortoise.
    { id: 'turtoise-old', name: 'Quadoire', element: ELEMENTS.WATER, values: { top: 5, right: 6, bottom: 10, left: 8 } }
  ]

  const { setSettingValue, userCollection, userHand } = useUser()

  const saveCollection = (collection: Array<InventoryCard | StoredCollectionCard>) => {
    const storedCollection: StoredCollectionCard[] = collection.map(card => ({ id: card.id, count: card.count }))
    setSettingValue('collection', storedCollection)
  }

  let startCollectionIdsList = ['mermaid-young', 'moss-young', 'dragon-young', 'piranha-young', 'mushroom-young', 'warrior-young', 'shark-young']
  if (isChibiTheme.value === true) {
    startCollectionIdsList = startCollectionIdsList.concat(['demon-young', 'sirene-young', 'tardigrade-young', 'gruffalo-young', 'butterfly-young', 'household-young', 'mammoth-young', 'eel-young', 'yeti-young', 'gargoyle-young', 'mouse-young', 'snowman-young'])
  }

  const debugCollection = allCards.map(card => ({ ...card, count: 2 }))
  let cardCollection = isDebug.value
    ? debugCollection
    : allCards
      .map(card => ({
        ...card,
        count: startCollectionIdsList.includes(card.id) ? 1 : 0
      }))
      /* first sort high cards to the end */
      .sort((a, b) => {
        const aPoints = Object.values(a.values).reduce((sum, val) => sum + val, 0)
        const bPoints = Object.values(b.values).reduce((sum, val) => sum + val, 0)
        if (aPoints < bPoints) return -1
        if (aPoints > bPoints) return 1
        return 0
      })
      /* then sort low cards with most count to the front */
      .sort((a, b) => {
        const aPoints = Object.values(a.values).reduce((sum, val) => sum + val, 0)
        const bPoints = Object.values(b.values).reduce((sum, val) => sum + val, 0)
        if (a.count > 0) return -1
        if (a.count === 0 && aPoints < bPoints) return -1
        if (a.count === 0 && aPoints > bPoints) return 1
        if (a.count === 0) return 1
        return 0
      })

  const storedCollection = computed(() => {
    return typeof userCollection.value === 'string'
      ? JSON.parse(userCollection.value)
      : userCollection.value
  })

  const getStartCollection = () => {
    return cardCollection
  }

  const getSortedCollection = () => {
    if (!storedCollection.value.length) {
      userCollection.value = JSON.stringify(cardCollection)
      return cardCollection
    }

    // 1. Map existing stored cards to full Card objects
    // Filter out any cards that might have been removed from allCards (the code)
    let updatedCollection = allCards.map(baseCard => {
      const stored = storedCollection.value.find((storedCard: any) => storedCard.id === baseCard.id)
      return {
        ...baseCard,
        count: stored ? stored.count : 0 // If not in storage, it's a new card: set to 0
      }
    })

    // 2. Check for mismatches to trigger a silent save back to DB
    const hasMismatch =
      storedCollection.value.length !== allCards.length ||
      storedCollection.value.some((storedCard: any) => !allCards.find(a => a.id === storedCard.id))

    if (hasMismatch) {
      // We wrap this in nextTick or setTimeout to avoid side-effects during a computed/render phase
      setTimeout(() => {
        saveCollection(updatedCollection)
      }, 0)
    }

    // 3. Sorting logic
    return updatedCollection.sort((a, b) => {
      const aPoints = Object.values(a.values).reduce((sum, val) => sum + val, 0)
      const bPoints = Object.values(b.values).reduce((sum, val) => sum + val, 0)

      // Priority 1: Cards you actually own (count > 0) come first
      if (a.count > 0 && b.count === 0) return -1
      if (a.count === 0 && b.count > 0) return 1

      // Priority 2: Sort by power (total points)
      return aPoints - bPoints
    })
  }

  watch(isDbInitialized, () => {
    if (storedCollection.value.length >= 1 && storedCollection.value.every((card: StoredCollectionCard) => card.count === 0)) {
      // Only refill the default starter collection if the player also has no cards in their hand.
      // Otherwise the player legitimately drained their collection into their hand and we'd duplicate cards.
      const handRaw = userHand.value
      const hand = typeof handRaw === 'string' ? JSON.parse(handRaw || '[]') : (handRaw || [])
      if (!Array.isArray(hand) || hand.length === 0) {
        saveCollection(cardCollection)
      }
    }
  }, { immediate: true, once: true })

  const addCardToCollection = (card: Card) => {
    const foundCard = storedCollection.value.find((c: StoredCollectionCard) => c.id === card.id)

    if (foundCard) {
      foundCard.count += 1
    } else {
      storedCollection.value.push({ id: card.id, count: 1 })
    }
    saveCollection(storedCollection.value)
  }

  return {
    allCards,
    cardCollection,
    saveCollection,
    getSortedCollection,
    addCardToCollection,
    startCollectionIdsList,
    getStartCollection,
    modelImgPath
  }
}

export default useModels