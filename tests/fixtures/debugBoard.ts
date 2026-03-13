import { npcHand, playerHand } from '@/use/useMatch.ts'
import { createComboPlusTestScenario, createComboSameTestScenario } from './comboRuleHand.ts'

export const setupDebugBoard = () => {
  // createComboSameTestScenario()
  createComboPlusTestScenario()
}