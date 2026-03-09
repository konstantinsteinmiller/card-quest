import { prependBaseUrl } from '@/utils/function'
import { ref } from 'vue'

export const modelImgPath = (imageName: string) => prependBaseUrl(`/models/${imageName}/preview_400x400.webp`)

/**
 * models
 */
interface Card {
  id: string
  name: string
  values: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

export const useModels = () => {
  const allCards: Card[] = [
    { id: 'asha', name: 'Asha', values: { top: 9, right: 3, bottom: 9, left: 3 } },
    { id: 'dragon-old', name: 'Dragoire', values: { top: 10, right: 8, bottom: 4, left: 7 } }, // 10 = 'A'
    { id: 'dragon-middle', name: 'Dragorin', values: { top: 7, right: 6, bottom: 3, left: 5 } },
    { id: 'dragon-young', name: 'Dragir', values: { top: 4, right: 4, bottom: 2, left: 3 } },
    { id: 'eclipse', name: 'Eclipse', values: { top: 5, right: 10, bottom: 5, left: 9 } },
    {
      id: 'energy-female-old',
      name: 'Thunlady',
      values: { top: 8, right: 5, bottom: 10, left: 6 }
    },
    { id: 'fire-harpy', name: 'Harpire', values: { top: 7, right: 7, bottom: 4, left: 4 } },
    { id: 'gargoyle-old', name: 'Goygorix', values: { top: 6, right: 9, bottom: 9, left: 5 } },
    { id: 'gargoyle-middle', name: 'Goygorin', values: { top: 5, right: 6, bottom: 6, left: 4 } },
    { id: 'gargoyle-young', name: 'Goygor', values: { top: 3, right: 3, bottom: 4, left: 2 } },
    { id: 'household', name: 'Housyu', values: { top: 2, right: 7, bottom: 3, left: 6 } },
    { id: 'mermaid-old', name: 'Merquen', values: { top: 8, right: 4, bottom: 8, left: 9 } },
    { id: 'mermaid-middle', name: 'Meriddle', values: { top: 5, right: 3, bottom: 5, left: 7 } },
    { id: 'mermaid-young', name: 'Merry', values: { top: 3, right: 2, bottom: 3, left: 5 } },
    { id: 'moss', name: 'Bogy', values: { top: 4, right: 4, bottom: 6, left: 4 } },
    {
      id: 'mushroom-middle',
      name: 'Mushiddle',
      values: { top: 6, right: 4, bottom: 3, left: 7 }
    },
    { id: 'mushroom-young', name: 'Mushyu', values: { top: 4, right: 2, bottom: 2, left: 5 } },
    {
      id: 'nature-butterfly-middle',
      name: 'Dandalina',
      values: { top: 8, right: 2, bottom: 3, left: 8 }
    },
    { id: 'piranha-old', name: 'Piradon', values: { top: 7, right: 7, bottom: 7, left: 8 } },
    { id: 'piranha-middle', name: 'Pirin', values: { top: 5, right: 5, bottom: 5, left: 6 } },
    { id: 'piranha-young', name: 'Pira', values: { top: 3, right: 3, bottom: 3, left: 4 } },
    { id: 'psi-nightmare', name: 'Nightsong', values: { top: 10, right: 2, bottom: 4, left: 10 } },
    { id: 'scorpion-old', name: 'Scorgon', values: { top: 9, right: 7, bottom: 4, left: 9 } },
    { id: 'scorpion-middle', name: 'Metalord', values: { top: 6, right: 5, bottom: 3, left: 7 } },
    { id: 'scorpion-young', name: 'Metlor', values: { top: 4, right: 3, bottom: 2, left: 5 } },
    { id: 'snowman-old', name: 'Snokong', values: { top: 10, right: 10, bottom: 3, left: 3 } },
    { id: 'snowman-middle', name: 'Snogrin', values: { top: 7, right: 7, bottom: 2, left: 2 } },
    { id: 'snowman-young', name: 'Snowy', values: { top: 5, right: 4, bottom: 1, left: 1 } },
    { id: 'starlight', name: 'Starlight', values: { top: 6, right: 6, bottom: 6, left: 6 } },
    { id: 'warrior-middle', name: 'Verona', values: { top: 7, right: 4, bottom: 8, left: 4 } },
    { id: 'warrior-young', name: 'Vera', values: { top: 5, right: 2, bottom: 6, left: 2 } },
    { id: 'water-shark-middle', name: 'Sharkoryn', values: { top: 4, right: 8, bottom: 4, left: 7 } },
    { id: 'water-shark-young', name: 'Sharky', values: { top: 3, right: 6, bottom: 2, left: 4 } },
    { id: 'yeti-middle', name: 'Yetopa', values: { top: 8, right: 8, bottom: 2, left: 3 } },
    { id: 'yeti-young', name: 'Yethog', values: { top: 6, right: 5, bottom: 1, left: 2 } }
  ]

  return {
    allCards,
    imgPath: modelImgPath
  }
}

export default useModels