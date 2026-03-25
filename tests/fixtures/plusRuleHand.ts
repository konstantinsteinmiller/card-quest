import type { GameCard } from '@/types/game'
import { modelImgPath } from '@/use/useModels'
import { ELEMENTS } from '../../src/utils/enums'

/**
 * Creates a specific scenario for the Plus Rule:
 * 1. Opponent Card A at (1,0) [Top Middle] with Bottom value 4.
 * 2. Opponent Card B at (0,1) [Middle Left] with Right value 6.
 * 3. Placed Card at (1,1) [Center] with Top value 6 and Left value 4.
 * * Result: Top Sum (6+4=10) == Left Sum (4+6=10). PLUS triggers.
 */
export const createPlusTestScenario = () => {
  const npcCards: GameCard[] = [
    {
      id: 'dragon-young',
      // @ts-ignore
      instanceId: 'npc-1',
      name: 'Dragir',
      owner: 'npc',
      values: { top: 4, right: 4, bottom: 4, left: 3 }, // bottom 4
      image: modelImgPath('dragon-young', ELEMENTS.FIRE)
    },
    {
      id: 'gargoyle-middle',
      // @ts-ignore
      instanceId: 'npc-2',
      name: 'Goygorin',
      owner: 'npc',
      values: { top: 5, right: 6, bottom: 6, left: 4 }, // right 6
      image: modelImgPath('gargoyle-middle', ELEMENTS.EARTH)
    }
  ]

  const playerCard: GameCard = {
    id: 'starlight-old',
    // @ts-ignore
    instanceId: 'player-1',
    name: 'Starlight Plus',
    owner: 'player',
    values: { top: 6, right: 2, bottom: 2, left: 4 }, // top 6, left 4
    image: modelImgPath('starlight-old', ELEMENTS.LIGHT)
  }

  return { npcCards, playerCard }
}