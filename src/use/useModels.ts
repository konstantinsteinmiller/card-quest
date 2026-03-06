import {watch} from 'vue'
import type {FairyCard, BoardSlot} from '@/types/game'

/**
 * fairy models
 */
export const useModels = () => {
  const fairyModels = [
    { model: 'asha', name: 'Asha' },
    { model: 'dragon-old', name: 'Dragoire' },
    { model: 'dragon-middle', name: 'Dragorin' },
    { model: 'dragon-young', name: 'Dragir' },
    { model: 'eclipse', name: 'Eclipse' },
    { model: 'energy-female-old', name: 'Thunlady' },
    { model: 'fire-harpy', name: 'Harpire' },
    { model: 'gargoyle-old', name: 'Goygorix' },
    { model: 'gargoyle-middle', name: 'Goygorin' },
    { model: 'gargoyle-young', name: 'Goygor' },
    { model: 'household', name: 'Housyu' },
    { model: 'mermaid-old', name: 'Merquen' },
    { model: 'mermaid-middle', name: 'Meriddle' },
    { model: 'mermaid-young', name: 'Merry' },
    { model: 'moss', name: 'Bogy' },
    { model: 'mushroom-middle', name: 'Mushiddle' },
    { model: 'mushroom-young', name: 'Mushyu' },
    { model: 'nature-butterfly-middle', name: 'Dandalina' },
    { model: 'piranha-old', name: 'Piradon' },
    { model: 'piranha-middle', name: 'Pirin' },
    { model: 'piranha-young', name: 'Pira' },
    { model: 'psi-nightmare', name: 'Nightsong' },
    { model: 'scorpion-old', name: 'Scorgon' },
    { model: 'scorpion-middle', name: 'Metalord' },
    { model: 'scorpion-young', name: 'Metlor' },
    { model: 'snowman-old', name: 'Snokong' },
    { model: 'snowman-middle', name: 'Snogrin' },
    { model: 'snowman-young', name: 'Snowy' },
    { model: 'starlight', name: 'Starlight' },
    { model: 'warrior-middle', name: 'Verona' },
    { model: 'warrior-young', name: 'Vera' },
    { model: 'water-shark-middle', name: 'Sharkoryn' },
    { model: 'water-shark-young', name: 'Sharky' },
    { model: 'yeti-middle', name: 'Yetopa' },
    { model: 'yeti-young', name: 'Yethog' },
  ]

  return {
    fairyModels
  }
}