import { prependBaseUrl } from '@/utils/function'
import { type Element, ELEMENTS } from '@/utils/enums'
import { isDbInitialized, isDebug } from '@/use/useMatch'
import useUser from '@/use/useUser'

export const modelImgPath = (id: string, element: string) => {
  try {
    if (!element) throw new Error('Element is required')
  } catch (error) {
    console.error('Error in modelImgPath:', error)
    return ''
  }
  return prependBaseUrl(`/models/${element}/${id}_400x400.webp`)
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
    /* FIRE */
    { id: 'dragon-young', name: 'Dragir', element: ELEMENTS.FIRE, values: { top: 4, right: 4, bottom: 2, left: 3 } },
    { id: 'dragon-middle', name: 'Dragorin', element: ELEMENTS.FIRE, values: { top: 7, right: 6, bottom: 3, left: 5 } },
    { id: 'dragon-old', name: 'Dragoire', element: ELEMENTS.FIRE, values: { top: 10, right: 8, bottom: 3, left: 7 } },
    { id: 'fox-middle', name: 'Lucara', element: ELEMENTS.FIRE, values: { top: 8, right: 8, bottom: 2, left: 3 } },
    { id: 'fox-old', name: 'Lucantras', element: ELEMENTS.FIRE, values: { top: 5, right: 9, bottom: 4, left: 9 } },
    { id: 'harpy-middle', name: 'Harpire', element: ELEMENTS.FIRE, values: { top: 7, right: 5, bottom: 3, left: 2 } },
    /* DARK */
    { id: 'eclipse-old', name: 'Eclipse', element: ELEMENTS.DARK, values: { top: 5, right: 10, bottom: 5, left: 9 } },
    { id: 'cosmica-young', name: 'Cosmak', element: ELEMENTS.DARK, values: { top: 7, right: 1, bottom: 7, left: 1 } },
    { id: 'demon-young', name: 'Trydix', element: ELEMENTS.DARK, values: { top: 2, right: 3, bottom: 8, left: 1 } },
    { id: 'demon-middle', name: 'Trydonyx', element: ELEMENTS.DARK, values: { top: 4, right: 7, bottom: 8, left: 5 } },
    { id: 'hag-middle', name: 'Hago', element: ELEMENTS.DARK, values: { top: 7, right: 8, bottom: 4, left: 5 } },
    {
      id: 'harbringer-middle',
      name: 'Harbringer',
      element: ELEMENTS.DARK,
      values: { top: 7, right: 8, bottom: 5, left: 6 }
    },
    { id: 'cat-middle', name: 'Ceya', element: ELEMENTS.DARK, values: { top: 9, right: 4, bottom: 9, left: 3 } },
    /* EARTH */
    { id: 'gargoyle-old', name: 'Goygorix', element: ELEMENTS.EARTH, values: { top: 4, right: 9, bottom: 9, left: 5 } },
    {
      id: 'gargoyle-middle',
      name: 'Goygorin',
      element: ELEMENTS.EARTH,
      values: { top: 5, right: 6, bottom: 6, left: 4 }
    },
    { id: 'gargoyle-young', name: 'Goygor', element: ELEMENTS.EARTH, values: { top: 3, right: 3, bottom: 4, left: 2 } },
    { id: 'gruffalo-young', name: 'Graffo', element: ELEMENTS.EARTH, values: { top: 3, right: 5, bottom: 4, left: 5 } },
    { id: 'bear-middle', name: 'Groz', element: ELEMENTS.EARTH, values: { top: 6, right: 6, bottom: 6, left: 6 } },
    /* NATURE */
    { id: 'moss-young', name: 'Bogy', element: ELEMENTS.NATURE, values: { top: 4, right: 4, bottom: 6, left: 4 } },
    {
      id: 'mushroom-middle',
      name: 'Mushiddle', element: ELEMENTS.NATURE,
      values: { top: 6, right: 4, bottom: 3, left: 7 }
    },
    {
      id: 'mushroom-young',
      name: 'Mushyu',
      element: ELEMENTS.NATURE,
      values: { top: 4, right: 2, bottom: 2, left: 5 }
    },
    {
      id: 'butterfly-young',
      name: 'Dandal', element: ELEMENTS.NATURE,
      values: { top: 3, right: 4, bottom: 3, left: 3 }
    },
    {
      id: 'butterfly-middle',
      name: 'Dandalina', element: ELEMENTS.NATURE,
      values: { top: 5, right: 3, bottom: 5, left: 6 }
    },
    {
      id: 'imp-middle',
      name: 'Horix', element: ELEMENTS.NATURE,
      values: { top: 5, right: 4, bottom: 7, left: 6 }
    },
    {
      id: 'imp-old',
      name: 'Horxcoire', element: ELEMENTS.NATURE,
      values: { top: 7, right: 7, bottom: 5, left: 10 }
    },
    /* WATER */
    { id: 'mermaid-young', name: 'Merry', element: ELEMENTS.WATER, values: { top: 3, right: 2, bottom: 3, left: 5 } },
    {
      id: 'mermaid-middle',
      name: 'Meriddle',
      element: ELEMENTS.WATER,
      values: { top: 5, right: 3, bottom: 5, left: 7 }
    },
    { id: 'mermaid-old', name: 'Merquen', element: ELEMENTS.WATER, values: { top: 8, right: 4, bottom: 8, left: 9 } },
    {
      id: 'shark-middle',
      name: 'Sharkoryn',
      element: ELEMENTS.WATER,
      values: { top: 4, right: 8, bottom: 4, left: 7 }
    },
    {
      id: 'shark-young',
      name: 'Sharky',
      element: ELEMENTS.WATER,
      values: { top: 3, right: 6, bottom: 2, left: 4 }
    },
    { id: 'piranha-old', name: 'Piradon', element: ELEMENTS.WATER, values: { top: 7, right: 7, bottom: 7, left: 8 } },
    { id: 'piranha-middle', name: 'Pirin', element: ELEMENTS.WATER, values: { top: 5, right: 5, bottom: 5, left: 6 } },
    { id: 'piranha-young', name: 'Pira', element: ELEMENTS.WATER, values: { top: 3, right: 3, bottom: 3, left: 4 } },
    { id: 'sirene-young', name: 'Siri', element: ELEMENTS.WATER, values: { top: 4, right: 2, bottom: 3, left: 5 } },
    { id: 'turtoise-young', name: 'Quada', element: ELEMENTS.WATER, values: { top: 2, right: 6, bottom: 4, left: 5 } },
    {
      id: 'turtoise-middle',
      name: 'Quadira',
      element: ELEMENTS.WATER,
      values: { top: 5, right: 6, bottom: 5, left: 7 }
    },
    {
      id: 'turtoise-old',
      name: 'Quadoire',
      element: ELEMENTS.WATER,
      values: { top: 7, right: 6, bottom: 9, left: 8 }
    },
    /* PSI */
    {
      id: 'nightmare-middle',
      name: 'Nightsong',
      element: ELEMENTS.PSI,
      values: { top: 10, right: 2, bottom: 4, left: 10 }
    },
    {
      id: 'wulfberry-middle',
      name: 'Berrya',
      element: ELEMENTS.PSI,
      values: { top: 7, right: 9, bottom: 2, left: 7 }
    },
    { id: 'tardigrade-young', name: 'Psyon', element: ELEMENTS.PSI, values: { top: 6, right: 4, bottom: 2, left: 6 } },
    {
      id: 'tardigrade-middle',
      name: 'Psycron',
      element: ELEMENTS.PSI,
      values: { top: 4, right: 8, bottom: 6, left: 6 }
    },
    { id: 'tardigrade-old', name: 'Psyconix', element: ELEMENTS.PSI, values: { top: 7, right: 9, bottom: 9, left: 4 } },
    /* METAL */
    { id: 'scorpion-young', name: 'Metlor', element: ELEMENTS.METAL, values: { top: 4, right: 3, bottom: 2, left: 5 } },
    {
      id: 'scorpion-middle',
      name: 'Metalord',
      element: ELEMENTS.METAL,
      values: { top: 6, right: 5, bottom: 3, left: 7 }
    },
    { id: 'scorpion-old', name: 'Scorgon', element: ELEMENTS.METAL, values: { top: 8, right: 10, bottom: 5, left: 9 } },
    {
      id: 'armadillo-middle',
      name: 'Armanco',
      element: ELEMENTS.METAL,
      values: { top: 4, right: 3, bottom: 8, left: 6 }
    },
    {
      id: 'armadillo-old',
      name: 'Armancorix',
      element: ELEMENTS.METAL,
      values: { top: 10, right: 6, bottom: 7, left: 10 }
    },
    /* LIGHT */
    { id: 'puppet-young', name: 'Toyus', element: ELEMENTS.LIGHT, values: { top: 4, right: 6, bottom: 3, left: 6 } },
    { id: 'pegasus-middle', name: 'Gasus', element: ELEMENTS.LIGHT, values: { top: 5, right: 7, bottom: 7, left: 5 } },
    {
      id: 'starlight-old',
      name: 'Starlight',
      element: ELEMENTS.LIGHT,
      values: { top: 6, right: 6, bottom: 6, left: 6 }
    },
    { id: 'cosmic-young', name: 'Cosma', element: ELEMENTS.LIGHT, values: { top: 5, right: 5, bottom: 4, left: 5 } },
    {
      id: 'cosmic-middle',
      name: 'Cosmica',
      element: ELEMENTS.LIGHT,
      values: { top: 7, right: 6, bottom: 4, left: 7 }
    },
    { id: 'cosmic-old', name: 'Universa', element: ELEMENTS.LIGHT, values: { top: 9, right: 10, bottom: 4, left: 10 } },
    /* NEUTRAL */
    {
      id: 'warrior-middle',
      name: 'Verona',
      element: ELEMENTS.NEUTRAL,
      values: { top: 7, right: 4, bottom: 8, left: 4 }
    },
    { id: 'warrior-young', name: 'Vera', element: ELEMENTS.NEUTRAL, values: { top: 5, right: 2, bottom: 6, left: 2 } },
    {
      id: 'household-young',
      name: 'Housyu',
      element: ELEMENTS.NEUTRAL,
      values: { top: 2, right: 7, bottom: 3, left: 6 }
    },
    { id: 'asha-old', name: 'Asha', element: ELEMENTS.NEUTRAL, values: { top: 9, right: 3, bottom: 9, left: 3 } },
    { id: 'mouse-young', name: 'Brusta', element: ELEMENTS.NEUTRAL, values: { top: 1, right: 2, bottom: 3, left: 5 } },
    { id: 'mouse-middle', name: 'Klopix', element: ELEMENTS.NEUTRAL, values: { top: 8, right: 6, bottom: 4, left: 2 } },
    {
      id: 'mouse-old',
      name: 'Kloparasa',
      element: ELEMENTS.NEUTRAL,
      values: { top: 10, right: 7, bottom: 8, left: 2 }
    },
    {
      id: 'porcupine-middle',
      name: 'Porque',
      element: ELEMENTS.NEUTRAL,
      values: { top: 4, right: 5, bottom: 4, left: 6 }
    },
    /* ICE */
    { id: 'snowman-old', name: 'Snokong', element: ELEMENTS.ICE, values: { top: 10, right: 10, bottom: 3, left: 3 } },
    { id: 'snowman-middle', name: 'Snogrin', element: ELEMENTS.ICE, values: { top: 7, right: 7, bottom: 2, left: 2 } },
    { id: 'snowman-young', name: 'Snowy', element: ELEMENTS.ICE, values: { top: 5, right: 4, bottom: 1, left: 1 } },
    { id: 'yeti-middle', name: 'Yetopa', element: ELEMENTS.ICE, values: { top: 8, right: 8, bottom: 2, left: 3 } },
    { id: 'yeti-young', name: 'Yethog', element: ELEMENTS.ICE, values: { top: 6, right: 5, bottom: 1, left: 2 } },
    { id: 'mammoth-middle', name: 'Mormyx', element: ELEMENTS.ICE, values: { top: 7, right: 8, bottom: 1, left: 5 } },
    { id: 'mammoth-young', name: 'Mormon', element: ELEMENTS.ICE, values: { top: 1, right: 2, bottom: 5, left: 5 } },
    {
      id: 'snowflower-middle',
      name: 'Mormon',
      element: ELEMENTS.ICE,
      values: { top: 7, right: 3, bottom: 5, left: 6 }
    },
    /* ENERGY */
    {
      id: 'female-young',
      name: 'Thunbee', element: ELEMENTS.ENERGY,
      values: { top: 3, right: 2, bottom: 7, left: 3 }
    },
    {
      id: 'female-middle',
      name: 'Thunbee', element: ELEMENTS.ENERGY,
      values: { top: 5, right: 8, bottom: 3, left: 7 }
    },
    {
      id: 'female-old',
      name: 'Thunlady', element: ELEMENTS.ENERGY,
      values: { top: 8, right: 5, bottom: 10, left: 6 }
    },
    { id: 'eel-young', name: 'Ely', element: ELEMENTS.ENERGY, values: { top: 6, right: 4, bottom: 1, left: 3 } },
    { id: 'eel-middle', name: 'Elix', element: ELEMENTS.ENERGY, values: { top: 6, right: 5, bottom: 3, left: 7 } },
    { id: 'deer-middle', name: 'Ronin', element: ELEMENTS.ENERGY, values: { top: 2, right: 4, bottom: 8, left: 7 } },
    /* AIR */
    { id: 'postman-middle', name: 'Quicklin', element: ELEMENTS.AIR, values: { top: 4, right: 5, bottom: 8, left: 4 } },
    { id: 'gorilla-middle', name: 'Gondix', element: ELEMENTS.AIR, values: { top: 7, right: 5, bottom: 8, left: 1 } },
    { id: 'gorilla-old', name: 'Gondoron', element: ELEMENTS.AIR, values: { top: 10, right: 7, bottom: 6, left: 7 } },
    { id: 'griffin-middle', name: 'Frindol', element: ELEMENTS.AIR, values: { top: 4, right: 5, bottom: 10, left: 3 } },
    { id: 'angel-old', name: 'Anduriel', element: ELEMENTS.AIR, values: { top: 8, right: 4, bottom: 9, left: 8 } } /* 80 */
  ]

  const { setSettingValue, userCollection } = useUser()

  const saveCollection = (collection: Array<InventoryCard | StoredCollectionCard>) => {
    const storedCollection: StoredCollectionCard[] = collection.map(card => ({ id: card.id, count: card.count }))
    setSettingValue('collection', storedCollection)
  }

  const startCollectionIdsList = ['mermaid-young', 'moss-young', 'dragon-young', 'piranha-young', 'mushroom-young', 'warrior-young', 'shark-young']

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

  const getSortedCollection = () => {
    if (!userCollection.value) return []

    const storedCollection = typeof userCollection.value === 'string'
      ? JSON.parse(userCollection.value)
      : userCollection.value

    // 1. Map existing stored cards to full Card objects
    // Filter out any cards that might have been removed from allCards (the code)
    let updatedCollection = allCards.map(baseCard => {
      const stored = storedCollection.find((storedCard: any) => storedCard.id === baseCard.id)
      return {
        ...baseCard,
        count: stored ? stored.count : 0 // If not in storage, it's a new card: set to 0
      }
    })

    // 2. Check for mismatches to trigger a silent save back to DB
    const hasMismatch =
      storedCollection.length !== allCards.length ||
      storedCollection.some((storedCard: any) => !allCards.find(a => a.id === storedCard.id))

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

  /* save a default card collection if there is none yet */
  userCollection.value === '[]' && setTimeout(() => {
    isDbInitialized.value && userCollection.value === '[]' && saveCollection(cardCollection)
  }, 200)

  const addCardToCollection = (card: Card) => {
    const storedCollection: StoredCollectionCard[] = typeof userCollection.value === 'string'
      ? JSON.parse(userCollection.value)
      : []

    const foundCard = storedCollection.find((c: StoredCollectionCard) => c.id === card.id)

    if (foundCard) {
      foundCard.count += 1
    } else {
      storedCollection.push({ id: card.id, count: 1 })
    }
    saveCollection(storedCollection)
  }

  return {
    allCards,
    cardCollection,
    saveCollection,
    getSortedCollection,
    addCardToCollection,
    startCollectionIdsList,
    modelImgPath
  }
}

export default useModels