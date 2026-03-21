import { board, npcHand, originalNpcHand, originalPlayerHand, playerHand } from '@/use/useMatch.ts'
import { createComboPlusTestScenario, createComboSameTestScenario } from './comboRuleHand.ts'
import { modelImgPath } from '@/use/useModels.ts'
import type { GameCard } from '@/types/game.ts'

export const setupDebugBoard = () => {
  // createComboSameTestScenario()
  // createComboPlusTestScenario()
  // createLooseTradeTestScenario()
  createWinTradeTestScenario()
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
        'image': '/models/dragon-young/preview_400x400.webp',
        'instanceId': '4hb2s9r',
        'lastRuleTrigger': null
      }
    }, {
      'x': 1,
      'y': 0,
      'card': {
        'id': 'energy-female-old',
        'name': 'Thunlady',
        'element': 'energy',
        'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
        'count': 2,
        'owner': 'player',
        'image': '/models/energy-female-old/preview_400x400.webp',
        'instanceId': 'cmnero3',
        'lastRuleTrigger': null
      }
    }, {
      'x': 2,
      'y': 0,
      'card': {
        'id': 'starlight',
        'instanceId': 'owz74a483',
        'name': 'Starlight',
        'values': { 'top': 6, 'right': 6, 'bottom': 6, 'left': 6 },
        'owner': 'player',
        'image': '/models/starlight/preview_400x400.webp',
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
        'image': '/models/dragon-middle/preview_400x400.webp',
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
        'image': '/models/snowman-old/preview_400x400.webp',
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
        'image': '/models/warrior-young/preview_400x400.webp',
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
        'image': '/models/piranha-young/preview_400x400.webp',
        'lastRuleTrigger': null
      }
    }, {
      'x': 1,
      'y': 2,
      'card': {
        'id': 'asha',
        'name': 'Asha',
        'element': 'neutral',
        'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
        'count': 2,
        'owner': 'player',
        'image': '/models/asha/preview_400x400.webp',
        'instanceId': 'tpb8ofx',
        'lastRuleTrigger': null
      }
    }, {
      'x': 2,
      'y': 2,
      'card': {
        'id': 'eclipse',
        'name': 'Eclipse',
        'element': 'dark',
        'values': { 'top': 5, 'right': 10, 'bottom': 5, 'left': 9 },
        'count': 2,
        'owner': 'npc',
        'image': '/models/eclipse/preview_400x400.webp',
        'instanceId': 'co6iio4',
        'lastRuleTrigger': null
      }
    }]]

  playerHand.value = []
  npcHand.value = [{
    'id': 'psi-nightmare',
    'instanceId': 'ox2h05kfb',
    'name': 'Nightsong',
    'values': { 'top': 10, 'right': 2, 'bottom': 4, 'left': 10 },
    'owner': 'npc',
    'image': '/models/psi-nightmare/preview_400x400.webp',
    'lastRuleTrigger': null
  }]

  originalPlayerHand.value = [
    {
      'id': 'energy-female-old',
      'name': 'Thunlady',
      'element': 'energy',
      'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
      'count': 2,
      'owner': 'player',
      'image': '/models/energy-female-old/preview_400x400.webp',
      'instanceId': 'cmnero3'
    }, {
      'id': 'dragon-young',
      'name': 'Dragir',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 2,
      'owner': 'player',
      'image': '/models/dragon-young/preview_400x400.webp',
      'instanceId': '4hb2s9r'
    }, {
      'id': 'dragon-old',
      'name': 'Dragoire',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 1,
      'owner': 'player',
      'image': '/models/dragon-old/preview_400x400.webp',
      'instanceId': 'n8cbhhg'
    }, {
      'id': 'asha',
      'name': 'Asha',
      'element': 'neutral',
      'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
      'count': 2,
      'owner': 'player',
      'image': '/models/asha/preview_400x400.webp',
      'instanceId': 'tpb8ofx'
    }, {
      'id': 'dragon-middle',
      'name': 'Dragorin',
      'element': 'fire',
      'values': { 'top': 7, 'right': 6, 'bottom': 3, 'left': 5 },
      'count': 2,
      'owner': 'player',
      'image': '/models/dragon-middle/preview_400x400.webp',
      'instanceId': '2wg033q'
    }
  ]

  originalNpcHand.value = [
    {
      'id': 'energy-female-old',
      'name': 'Thunlady',
      'element': 'energy',
      'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
      'count': 2,
      'owner': 'npc',
      'image': '/models/energy-female-old/preview_400x400.webp',
      'instanceId': 'cmne2o3'
    }, {
      'id': 'dragon-old',
      'name': 'Dragoire',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 2,
      'owner': 'npc',
      'image': '/models/dragon-old/preview_400x400.webp',
      'instanceId': '4hb4s9r'
    }, {
      'id': 'dragon-young',
      'name': 'Dragir',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 1,
      'owner': 'npc',
      'image': '/models/dragon-young/preview_400x400.webp',
      'instanceId': 'n8c1hhg'
    }, {
      'id': 'asha',
      'name': 'Asha',
      'element': 'neutral',
      'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
      'count': 2,
      'owner': 'npc',
      'image': '/models/asha/preview_400x400.webp',
      'instanceId': 'tpb5ofx'
    }, {
      'id': 'dragon-middle',
      'name': 'Dragorin',
      'element': 'fire',
      'values': { 'top': 7, 'right': 6, 'bottom': 3, 'left': 5 },
      'count': 2,
      'owner': 'npc',
      'image': '/models/dragon-middle/preview_400x400.webp',
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
        'image': '/models/dragon-young/preview_400x400.webp',
        'instanceId': '4hb2s9r',
        'lastRuleTrigger': null
      }
    }, {
      'x': 1,
      'y': 0,
      'card': {
        'id': 'energy-female-old',
        'name': 'Thunlady',
        'element': 'energy',
        'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
        'count': 2,
        'owner': 'npc',
        'image': '/models/energy-female-old/preview_400x400.webp',
        'instanceId': 'cmnero3',
        'lastRuleTrigger': null
      }
    }, {
      'x': 2,
      'y': 0,
      'card': {
        'id': 'starlight',
        'instanceId': 'owz74a483',
        'name': 'Starlight',
        'values': { 'top': 6, 'right': 6, 'bottom': 6, 'left': 6 },
        'owner': 'npc',
        'image': '/models/starlight/preview_400x400.webp',
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
        'image': '/models/dragon-middle/preview_400x400.webp',
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
        'image': '/models/snowman-old/preview_400x400.webp',
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
        'image': '/models/warrior-young/preview_400x400.webp',
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
        'image': '/models/piranha-young/preview_400x400.webp',
        'lastRuleTrigger': null
      }
    }, {
      'x': 1,
      'y': 2,
      'card': {
        'id': 'asha',
        'name': 'Asha',
        'element': 'neutral',
        'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
        'count': 2,
        'owner': 'player',
        'image': '/models/asha/preview_400x400.webp',
        'instanceId': 'tpb8ofx',
        'lastRuleTrigger': null
      }
    }, {
      'x': 2,
      'y': 2,
      'card': {
        'id': 'eclipse',
        'name': 'Eclipse',
        'element': 'dark',
        'values': { 'top': 5, 'right': 10, 'bottom': 5, 'left': 9 },
        'count': 2,
        'owner': 'npc',
        'image': '/models/eclipse/preview_400x400.webp',
        'instanceId': 'co6iio4',
        'lastRuleTrigger': null
      }
    }]]

  playerHand.value = []
  npcHand.value = [{
    'id': 'psi-nightmare',
    'instanceId': 'ox2h05kfb',
    'name': 'Nightsong',
    'values': { 'top': 10, 'right': 2, 'bottom': 4, 'left': 10 },
    'owner': 'npc',
    'image': '/models/psi-nightmare/preview_400x400.webp',
    'lastRuleTrigger': null
  }]

  originalPlayerHand.value = [
    {
      'id': 'energy-female-old',
      'name': 'Thunlady',
      'element': 'energy',
      'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
      'count': 2,
      'owner': 'player',
      'image': '/models/energy-female-old/preview_400x400.webp',
      'instanceId': 'cmnero3'
    }, {
      'id': 'dragon-young',
      'name': 'Dragir',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 2,
      'owner': 'player',
      'image': '/models/dragon-young/preview_400x400.webp',
      'instanceId': '4hb2s9r'
    }, {
      'id': 'dragon-old',
      'name': 'Dragoire',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 1,
      'owner': 'player',
      'image': '/models/dragon-old/preview_400x400.webp',
      'instanceId': 'n8cbhhg'
    }, {
      'id': 'asha',
      'name': 'Asha',
      'element': 'neutral',
      'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
      'count': 2,
      'owner': 'player',
      'image': '/models/asha/preview_400x400.webp',
      'instanceId': 'tpb8ofx'
    }, {
      'id': 'dragon-middle',
      'name': 'Dragorin',
      'element': 'fire',
      'values': { 'top': 7, 'right': 6, 'bottom': 3, 'left': 5 },
      'count': 2,
      'owner': 'player',
      'image': '/models/dragon-middle/preview_400x400.webp',
      'instanceId': '2wg033q'
    }
  ]

  originalNpcHand.value = [
    {
      'id': 'energy-female-old',
      'name': 'Thunlady',
      'element': 'energy',
      'values': { 'top': 8, 'right': 5, 'bottom': 10, 'left': 6 },
      'count': 2,
      'owner': 'npc',
      'image': '/models/energy-female-old/preview_400x400.webp',
      'instanceId': 'cmne2o3'
    }, {
      'id': 'dragon-old',
      'name': 'Dragoire',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 2,
      'owner': 'npc',
      'image': '/models/dragon-old/preview_400x400.webp',
      'instanceId': '4hb4s9r'
    }, {
      'id': 'dragon-young',
      'name': 'Dragir',
      'element': 'fire',
      'values': { 'top': 4, 'right': 4, 'bottom': 2, 'left': 3 },
      'count': 1,
      'owner': 'npc',
      'image': '/models/dragon-young/preview_400x400.webp',
      'instanceId': 'n8c1hhg'
    }, {
      'id': 'asha',
      'name': 'Asha',
      'element': 'neutral',
      'values': { 'top': 9, 'right': 3, 'bottom': 9, 'left': 3 },
      'count': 2,
      'owner': 'npc',
      'image': '/models/asha/preview_400x400.webp',
      'instanceId': 'tpb5ofx'
    }, {
      'id': 'dragon-middle',
      'name': 'Dragorin',
      'element': 'fire',
      'values': { 'top': 7, 'right': 6, 'bottom': 3, 'left': 5 },
      'count': 2,
      'owner': 'npc',
      'image': '/models/dragon-middle/preview_400x400.webp',
      'instanceId': '2wg133q'
    }
  ]
}