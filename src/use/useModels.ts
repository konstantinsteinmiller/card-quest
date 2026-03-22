import { prependBaseUrl } from '@/utils/function'
import { ref } from 'vue'
import { type Element, ELEMENTS } from '@/utils/enums'

export const modelImgPath = (imageName: string) => prependBaseUrl(`/models/${imageName}/preview_400x400.webp`)

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

const useModels = () => {
  const allCards: Card[] = [
    { id: 'asha', name: 'Asha', element: ELEMENTS.NEUTRAL, values: { top: 9, right: 3, bottom: 9, left: 3 } },
    { id: 'dragon-old', name: 'Dragoire', element: ELEMENTS.FIRE, values: { top: 10, right: 8, bottom: 4, left: 7 } }, // 10 = 'A'
    { id: 'dragon-middle', name: 'Dragorin', element: ELEMENTS.FIRE, values: { top: 7, right: 6, bottom: 3, left: 5 } },
    { id: 'dragon-young', name: 'Dragir', element: ELEMENTS.FIRE, values: { top: 4, right: 4, bottom: 2, left: 3 } },
    { id: 'eclipse', name: 'Eclipse', element: ELEMENTS.DARK, values: { top: 5, right: 10, bottom: 5, left: 9 } },
    {
      id: 'energy-female-old',
      name: 'Thunlady', element: ELEMENTS.ENERGY,
      values: { top: 8, right: 5, bottom: 10, left: 6 }
    },
    { id: 'fire-harpy', name: 'Harpire', element: ELEMENTS.FIRE, values: { top: 7, right: 5, bottom: 3, left: 2 } },
    { id: 'gargoyle-old', name: 'Goygorix', element: ELEMENTS.EARTH, values: { top: 4, right: 9, bottom: 9, left: 5 } },
    {
      id: 'gargoyle-middle',
      name: 'Goygorin',
      element: ELEMENTS.EARTH,
      values: { top: 5, right: 6, bottom: 6, left: 4 }
    },
    { id: 'gargoyle-young', name: 'Goygor', element: ELEMENTS.EARTH, values: { top: 3, right: 3, bottom: 4, left: 2 } },
    { id: 'household', name: 'Housyu', element: ELEMENTS.NEUTRAL, values: { top: 2, right: 7, bottom: 3, left: 6 } },
    { id: 'mermaid-old', name: 'Merquen', element: ELEMENTS.WATER, values: { top: 8, right: 4, bottom: 8, left: 9 } },
    {
      id: 'mermaid-middle',
      name: 'Meriddle',
      element: ELEMENTS.WATER,
      values: { top: 5, right: 3, bottom: 5, left: 7 }
    },
    { id: 'mermaid-young', name: 'Merry', element: ELEMENTS.WATER, values: { top: 3, right: 2, bottom: 3, left: 5 } },
    { id: 'moss', name: 'Bogy', element: ELEMENTS.NATURE, values: { top: 4, right: 4, bottom: 6, left: 4 } },
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
      id: 'nature-butterfly-middle',
      name: 'Dandalina', element: ELEMENTS.NATURE,
      values: { top: 5, right: 1, bottom: 3, left: 6 }
    },
    { id: 'piranha-old', name: 'Piradon', element: ELEMENTS.WATER, values: { top: 7, right: 7, bottom: 7, left: 8 } },
    { id: 'piranha-middle', name: 'Pirin', element: ELEMENTS.WATER, values: { top: 5, right: 5, bottom: 5, left: 6 } },
    { id: 'piranha-young', name: 'Pira', element: ELEMENTS.WATER, values: { top: 3, right: 3, bottom: 3, left: 4 } },
    {
      id: 'psi-nightmare',
      name: 'Nightsong',
      element: ELEMENTS.PSI,
      values: { top: 10, right: 2, bottom: 4, left: 10 }
    },
    { id: 'scorpion-old', name: 'Scorgon', element: ELEMENTS.METAL, values: { top: 9, right: 7, bottom: 4, left: 9 } },
    {
      id: 'scorpion-middle',
      name: 'Metalord',
      element: ELEMENTS.METAL,
      values: { top: 6, right: 5, bottom: 3, left: 7 }
    },
    { id: 'scorpion-young', name: 'Metlor', element: ELEMENTS.METAL, values: { top: 4, right: 3, bottom: 2, left: 5 } },
    { id: 'snowman-old', name: 'Snokong', element: ELEMENTS.ICE, values: { top: 10, right: 10, bottom: 3, left: 3 } },
    { id: 'snowman-middle', name: 'Snogrin', element: ELEMENTS.ICE, values: { top: 7, right: 7, bottom: 2, left: 2 } },
    { id: 'snowman-young', name: 'Snowy', element: ELEMENTS.ICE, values: { top: 5, right: 4, bottom: 1, left: 1 } },
    { id: 'starlight', name: 'Starlight', element: ELEMENTS.LIGHT, values: { top: 6, right: 6, bottom: 6, left: 6 } },
    {
      id: 'warrior-middle',
      name: 'Verona',
      element: ELEMENTS.NEUTRAL,
      values: { top: 7, right: 4, bottom: 8, left: 4 }
    },
    { id: 'warrior-young', name: 'Vera', element: ELEMENTS.NEUTRAL, values: { top: 5, right: 2, bottom: 6, left: 2 } },
    {
      id: 'water-shark-middle',
      name: 'Sharkoryn',
      element: ELEMENTS.WATER,
      values: { top: 4, right: 8, bottom: 4, left: 7 }
    },
    {
      id: 'water-shark-young',
      name: 'Sharky',
      element: ELEMENTS.WATER,
      values: { top: 3, right: 6, bottom: 2, left: 4 }
    },
    { id: 'yeti-middle', name: 'Yetopa', element: ELEMENTS.ICE, values: { top: 8, right: 8, bottom: 2, left: 3 } },
    { id: 'yeti-young', name: 'Yethog', element: ELEMENTS.ICE, values: { top: 6, right: 5, bottom: 1, left: 2 } }
  ]

  return {
    allCards,
    modelImgPath
  }
}

export default useModels