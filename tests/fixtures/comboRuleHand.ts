// @ts-nocheck
import type { GameCard } from '@/types/game'
import { modelImgPath } from '@/use/useModels'
import { playerHand, board, npcHand, activeRules } from '@/use/useMatch'
import { ELEMENTS } from '@/utils/enums.ts'

/**
 * Creates a specific scenario for the Plus Rule:
 * 1. Opponent Card A at (1,0) [Middle Left] with right value 1.
 * 2. Opponent Card B at (2,1) [Bottom Middle] with top value 1.
 * 2. Opponent Card C at (0,0) [Top Left] with bottom value 1.
 * 3. Placed Card at (1,1) [Center] with Left value 1 and Bottom value 1
 *    which triggers the Same rule and captures Card C with the high Rule
 * * Result: Bottom Sum (1==1) && Left Sum (1==1). SAME triggers.
 */
export const createComboSameTestScenario = () => {
  activeRules.value = ['high', 'combo', 'same'] // Ensure 'same' is active to allow combo chaining
  board.value[1][0].card = {
    owner: 'npc', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK),
    values: { top: 8, right: 1, bottom: 5, left: 1 }
  } as GameCard
  board.value[2][1].card = {
    owner: 'npc', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK), values: { top: 1, right: 1, bottom: 1, left: 3 }
  } as GameCard
  board.value[0][0].card = {
    owner: 'npc', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK), values: { top: 1, right: 2, bottom: 1, left: 1 }
  } as GameCard // weaker than 8

  playerHand.value = [{
    owner: 'player', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK),
    values: { top: 5, right: 3, bottom: 1, left: 1 }
  } as GameCard, {
    owner: 'player', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK),
    values: { top: 5, right: 3, bottom: 1, left: 1 }
  } as GameCard]

  npcHand.value = [{
    owner: 'npc', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK),
    values: { top: 5, right: 3, bottom: 1, left: 1 }
  } as GameCard]

  return { npcHand, playerHand }
}

export const createComboPlusTestScenario = () => {
  activeRules.value = ['high', 'combo', 'plus', 'same'] // Ensure 'same' is active to allow combo chaining
  board.value[0][1].card = {
    owner: 'npc', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK), values: { top: 9, right: 1, bottom: 5, left: 1 }
  } as GameCard
  // NPC card at Row 1, Col 0 (Left): Atk Left (4) + Card Right (6) = 10.
  board.value[1][0].card = {
    owner: 'npc', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK), values: { top: 1, right: 6, bottom: 1, left: 1 }
  } as GameCard
  // Combo Target at Row 0, Col 0: Left of the card at [0,1]. [0,1] Left (1) vs [0,0] Right (1).
  // Wait, let's use [0,1] Top (9) to hit a card at Row -1 (impossible) or simply flip its neighbor.
  // Let's place target at [0,0] and make [0,1] Left (9) > [0,0] Right (1)
  board.value[0][1].card.values.left = 9
  board.value[0][0].card = {
    owner: 'npc', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK), values: { top: 1, right: 1, bottom: 1, left: 1 }
  } as GameCard

  playerHand.value = [{
    owner: 'player', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK),
    values: { top: 5, right: 1, bottom: 1, left: 4 }
  } as GameCard]
  npcHand.value = []

  return { npcHand, playerHand }
}

export const createPlusTestScenario = () => {
  activeRules.value = ['high', 'plus', 'same'] // Ensure 'same' is active to allow combo chaining
  board.value[0][1].card = {
    owner: 'npc', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK), values: { top: 9, right: 1, bottom: 5, left: 1 }
  } as GameCard
  // NPC card at Row 1, Col 0 (Left): Atk Left (4) + Card Right (6) = 10.
  board.value[1][0].card = {
    owner: 'npc', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK), values: { top: 1, right: 6, bottom: 1, left: 1 }
  } as GameCard
  // Combo Target at Row 0, Col 0: Left of the card at [0,1]. [0,1] Left (1) vs [0,0] Right (1).
  // Wait, let's use [0,1] Top (9) to hit a card at Row -1 (impossible) or simply flip its neighbor.
  // Let's place target at [0,0] and make [0,1] Left (9) > [0,0] Right (1)
  board.value[0][1].card.values.left = 9
  board.value[0][0].card = {
    owner: 'npc', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK), values: { top: 1, right: 1, bottom: 1, left: 1 }
  } as GameCard

  playerHand.value = [{
    owner: 'player', id: 'asha-old', instanceId: Math.random().toString(36).substring(2, 11),
    name: 'Asha',
    image: modelImgPath('asha-old', ELEMENTS.DARK),
    values: { top: 5, right: 1, bottom: 1, left: 4 }
  } as GameCard]
  npcHand.value = []

  return { npcHand, playerHand }
}