import { board, npcHand, originalNpcHand, originalPlayerHand, playerHand, activeRules } from '@/use/useMatch.ts'
import { createComboPlusTestScenario, createComboSameTestScenario, createPlusTestScenario } from './comboRuleHand.ts'
import { modelImgPath } from '@/use/useModels.ts'
import type { GameCard } from '@/types/game.ts'

export const setupDebugBoard = () => {
  // createComboSameTestScenario()
  createComboPlusTestScenario()
  // createPlusTestScenario()
  // createLooseTradeTestScenario()
  // createWinTradeTestScenario()
}

const createWinTradeTestScenario = () => {
  board.value.forEach(row => row.forEach(slot => {
    slot.card = null
  }))

  board.value = [
    [{
      'x': 0,
      'y': 0,
      'card': {
        'id': 'dragon-young',
        'name': 'Dragir',
        'element': 'fire',
        'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
        'count': 2,
        'owner': 'player',
        'image': modelImgPath('dragon-young', 'fire'),
        'instanceId': '4hb2s9r',
        'lastRuleTrigger': null
      }
    }, {
      'x': 1,
      'y': 0,
      'card': {
        'id': '',
        'name': 'Thunlady',
        'element': 'energy',
        'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
        'count': 2,
        'owner': 'player',
        'image': modelImgPath('female-old', 'energy'),
        'instanceId': 'cmnero3',
        'lastRuleTrigger': null
      }
    }, {
      'x': 2,
      'y': 0,
      'card': {
        'id': 'starlight-old',
        'instanceId': 'owz74a483',
        'name': 'Starlight',
        'values': { 'top': 6, 'right': 6, 'bottom': 6, 'left': 6 },
        'owner': 'player',
        'image': modelImgPath('starlight-old', 'light'),
        'lastRuleTrigger': null
      }
    }], [{
      'x': 0,
      'y': 1,
      'card': {
        'id': 'dragon-middle',
        'name': 'Dragorin',
        'element': 'fire',
        'values': { 'top': 7, 'right': 6, 'bottom': 3, 'left': 5 },
        'count': 2,
        'owner': 'npc',
        'image': modelImgPath('dragon-middle', 'fire'),
        'instanceId': '2wg033q',
        'lastRuleTrigger': null
      }
    }, {
      'x': 1,
      'y': 1,
      'card': {
        'id': 'snowman-old',
        'instanceId': '9qjooc1pp',
        'name': 'Snokong',
        'values': { 'top': 10, 'right': 10, 'bottom': 3, 'left': 3 },
        'owner': 'npc',
        'image': modelImgPath('snowman-old', 'ice'),
        'lastRuleTrigger': null
      }
    }, {
      'x': 2,
      'y': 1,
      'card': {
        'id': 'warrior-young',
        'instanceId': 'ksye0btuj',
        'name': 'Vera',
        'values': { 'top': 5, 'right': 2, 'bottom': 6, 'left': 2 },
        'owner': 'player',
        'image': modelImgPath('warrior-young', 'neutral'),
        'lastRuleTrigger': null
      }
    }], [{
      'x': 0,
      'y': 2,
      'card': {
        'id': 'piranha-young',
        'instanceId': '3jsux8f7d',
        'name': 'Pira',
        'values': { 'top': 3, 'right': 3, 'bottom': 3, 'left': 4 },
        'owner': 'player',
        'image': modelImgPath('piranha-young', 'water'),
        'lastRuleTrigger': null
      }
    }, {
      'x': 1,
      'y': 2,
      'card': {
        'id': 'asha-old',
        'name': 'Asha',
        'element': 'neutral',
        'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
        'count': 2,
        'owner': 'player',
        'image': modelImgPath('asha-old', 'dark'),
        'instanceId': 'tpb8ofx',
        'lastRuleTrigger': null
      }
    }, {
      'x': 2,
      'y': 2,
      'card': {
        'id': 'eclipse-old',
        'name': 'Eclipse',
        'element': 'dark',
        'values': { 'top': 5, 'right': 10, 'bottom': 5, 'left': 9 },
        'count': 2,
        'owner': 'npc',
        'image': modelImgPath('eclipse-old', 'dark'),
        'instanceId': 'co6iio4',
        'lastRuleTrigger': null
      }
    }]]

  playerHand.value = []
  npcHand.value = [{
    'id': 'nightmare-middle',
    'instanceId': 'ox2h05kfb',
    'name': 'Nightsong',
    'values': { 'top': 10, 'right': 2, 'bottom': 4, 'left': 10 },
    'owner': 'npc',
    'image': modelImgPath('nightmare-middle', 'psi'),
    'lastRuleTrigger': null
  }]

  originalPlayerHand.value = [
    {
      'id': 'female-old',
      'name': 'Thunlady',
      'element': 'energy',
      'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
      'count': 2,
      'owner': 'player',
      'image': modelImgPath('female-old', 'energy'),
      'instanceId': 'cmnero3'
    }, {
      'id': 'dragon-young',
      'name': 'Dragir',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 2,
      'owner': 'player',
      'image': modelImgPath('dragon-young', 'fire'),
      'instanceId': '4hb2s9r'
    }, {
      'id': 'dragon-old',
      'name': 'Dragoire',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 1,
      'owner': 'player',
      'image': modelImgPath('dragon-old', 'fire'),
      'instanceId': 'n8cbhhg'
    }, {
      'id': 'asha-old',
      'name': 'Asha',
      'element': 'neutral',
      'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
      'count': 2,
      'owner': 'player',
      'image': modelImgPath('asha-old', 'dark'),
      'instanceId': 'tpb8ofx'
    }, {
      'id': 'dragon-middle',
      'name': 'Dragorin',
      'element': 'fire',
      'values': { 'top': 7, 'right': 6, 'bottom': 3, 'left': 5 },
      'count': 2,
      'owner': 'player',
      'image': modelImgPath('dragon-middle', 'fire'),
      'instanceId': '2wg033q'
    }
  ]

  originalNpcHand.value = [
    {
      'id': 'female-old',
      'name': 'Thunlady',
      'element': 'energy',
      'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
      'count': 2,
      'owner': 'npc',
      'image': modelImgPath('female-old', 'energy'),
      'instanceId': 'cmne2o3'
    }, {
      'id': 'dragon-old',
      'name': 'Dragoire',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 2,
      'owner': 'npc',
      'image': modelImgPath('dragon-old', 'fire'),
      'instanceId': '4hb4s9r'
    }, {
      'id': 'dragon-young',
      'name': 'Dragir',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 1,
      'owner': 'npc',
      'image': modelImgPath('dragon-young', 'fire'),
      'instanceId': 'n8c1hhg'
    }, {
      'id': 'asha-old',
      'name': 'Asha',
      'element': 'neutral',
      'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
      'count': 2,
      'owner': 'npc',
      'image': modelImgPath('asha-old', 'dark'),
      'instanceId': 'tpb5ofx'
    }, {
      'id': 'dragon-middle',
      'name': 'Dragorin',
      'element': 'fire',
      'values': { 'top': 7, 'right': 6, 'bottom': 3, 'left': 5 },
      'count': 2,
      'owner': 'npc',
      'image': modelImgPath('dragon-middle', 'fire'),
      'instanceId': '2wg133q'
    }
  ]
}

const createLooseTradeTestScenario = () => {
  board.value.forEach(row => row.forEach(slot => {
    slot.card = null
  }))

  board.value = [
    [{
      'x': 0,
      'y': 0,
      'card': {
        'id': 'dragon-young',
        'name': 'Dragir',
        'element': 'fire',
        'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
        'count': 2,
        'owner': 'player',
        'image': modelImgPath('dragon-young', 'fire'),
        'instanceId': '4hb2s9r',
        'lastRuleTrigger': null
      }
    }, {
      'x': 1,
      'y': 0,
      'card': {
        'id': 'female-old',
        'name': 'Thunlady',
        'element': 'energy',
        'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
        'count': 2,
        'owner': 'npc',
        'image': modelImgPath('female-old', 'energy'),
        'instanceId': 'cmnero3',
        'lastRuleTrigger': null
      }
    }, {
      'x': 2,
      'y': 0,
      'card': {
        'id': 'starlight-old',
        'instanceId': 'owz74a483',
        'name': 'Starlight',
        'values': { 'top': 6, 'right': 6, 'bottom': 6, 'left': 6 },
        'owner': 'npc',
        'image': '/models/light/starlight-old_400x400.webp',
        'lastRuleTrigger': null
      }
    }], [{
      'x': 0,
      'y': 1,
      'card': {
        'id': 'dragon-middle',
        'name': 'Dragorin',
        'element': 'fire',
        'values': { 'top': 7, 'right': 6, 'bottom': 3, 'left': 5 },
        'count': 2,
        'owner': 'npc',
        'image': modelImgPath('dragon-middle', 'fire'),
        'instanceId': '2wg033q',
        'lastRuleTrigger': null
      }
    }, {
      'x': 1,
      'y': 1,
      'card': {
        'id': 'snowman-old',
        'instanceId': '9qjooc1pp',
        'name': 'Snokong',
        'values': { 'top': 10, 'right': 10, 'bottom': 3, 'left': 3 },
        'owner': 'npc',
        'image': '/models/ice/snowman-old_400x400.webp',
        'lastRuleTrigger': null
      }
    }, {
      'x': 2,
      'y': 1,
      'card': {
        'id': 'warrior-young',
        'instanceId': 'ksye0btuj',
        'name': 'Vera',
        'values': { 'top': 5, 'right': 2, 'bottom': 6, 'left': 2 },
        'owner': 'player',
        'image': '/models/water/warrior-young_400x400.webp',
        'lastRuleTrigger': null
      }
    }], [{
      'x': 0,
      'y': 2,
      'card': {
        'id': 'piranha-young',
        'instanceId': '3jsux8f7d',
        'name': 'Pira',
        'values': { 'top': 3, 'right': 3, 'bottom': 3, 'left': 4 },
        'owner': 'player',
        'image': modelImgPath('piranha-young', 'water'),
        'lastRuleTrigger': null
      }
    }, {
      'x': 1,
      'y': 2,
      'card': {
        'id': 'asha-old',
        'name': 'Asha',
        'element': 'neutral',
        'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
        'count': 2,
        'owner': 'player',
        'image': modelImgPath('asha-old', 'dark'),
        'instanceId': 'tpb8ofx',
        'lastRuleTrigger': null
      }
    }, {
      'x': 2,
      'y': 2,
      'card': {
        'id': 'eclipse-old',
        'name': 'Eclipse',
        'element': 'dark',
        'values': { 'top': 5, 'right': 10, 'bottom': 5, 'left': 9 },
        'count': 2,
        'owner': 'npc',
        'image': modelImgPath('eclipse-old', 'dark'),
        'instanceId': 'co6iio4',
        'lastRuleTrigger': null
      }
    }]]

  playerHand.value = []
  npcHand.value = [{
    'id': 'nightmare-middle',
    'instanceId': 'ox2h05kfb',
    'name': 'Nightsong',
    'values': { 'top': 10, 'right': 2, 'bottom': 4, 'left': 10 },
    'owner': 'npc',
    'image': modelImgPath('nightmare-middle', 'psi'),
    'lastRuleTrigger': null
  }]

  originalPlayerHand.value = [
    {
      'id': 'female-old',
      'name': 'Thunlady',
      'element': 'energy',
      'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
      'count': 2,
      'owner': 'player',
      'image': modelImgPath('female-old', 'energy'),
      'instanceId': 'cmnero3'
    }, {
      'id': 'dragon-young',
      'name': 'Dragir',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 2,
      'owner': 'player',
      'image': modelImgPath('dragon-young', 'fire'),
      'instanceId': '4hb2s9r'
    }, {
      'id': 'dragon-old',
      'name': 'Dragoire',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 1,
      'owner': 'player',
      'image': modelImgPath('dragon-old', 'fire'),
      'instanceId': 'n8cbhhg'
    }, {
      'id': 'asha-old',
      'name': 'Asha',
      'element': 'neutral',
      'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
      'count': 2,
      'owner': 'player',
      'image': modelImgPath('asha-old', 'dark'),
      'instanceId': 'tpb8ofx'
    }, {
      'id': 'dragon-middle',
      'name': 'Dragorin',
      'element': 'fire',
      'values': { 'top': 7, 'right': 6, 'bottom': 3, 'left': 5 },
      'count': 2,
      'owner': 'player',
      'image': modelImgPath('dragon-middle', 'fire'),
      'instanceId': '2wg033q'
    }
  ]

  originalNpcHand.value = [
    {
      'id': 'female-old',
      'name': 'Thunlady',
      'element': 'energy',
      'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
      'count': 2,
      'owner': 'npc',
      'image': modelImgPath('female-old', 'neutral'),
      'instanceId': 'cmne2o3'
    }, {
      'id': 'dragon-old',
      'name': 'Dragoire',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 2,
      'owner': 'npc',
      'image': modelImgPath('dragon-old', 'fire'),
      'instanceId': '4hb4s9r'
    }, {
      'id': 'dragon-young',
      'name': 'Dragir',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 1,
      'owner': 'npc',
      'image': modelImgPath('dragon-young', 'fire'),
      'instanceId': 'n8c1hhg'
    }, {
      'id': 'asha-old',
      'name': 'Asha',
      'element': 'neutral',
      'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
      'count': 2,
      'owner': 'npc',
      'image': modelImgPath('asha-old', 'dark'),
      'instanceId': 'tpb5ofx'
    }, {
      'id': 'dragon-middle',
      'name': 'Dragorin',
      'element': 'fire',
      'values': { 'top': 7, 'right': 6, 'bottom': 3, 'left': 5 },
      'count': 2,
      'owner': 'npc',
      'image': modelImgPath('dragon-middle', 'fire'),
      'instanceId': '2wg133q'
    }
  ]
}