import type { GameCard, BoardSlot } from '@/types/game'

export type BattleRuleName = 'standard' | 'plus' | 'same'

export interface RuleContext {
  x: number
  y: number
  board: BoardSlot[][]
  attacker: GameCard
}

/**
 * Standard Rule: If attacker value > defender value in that direction.
 */
const applyStandardRule = (ctx: RuleContext): { x: number, y: number }[] => {
  const captures: { x: number, y: number }[] = []
  const adjacents = [
    { dy: -1, dx: 0, atk: 'top', def: 'bottom' },
    { dy: 1, dx: 0, atk: 'bottom', def: 'top' },
    { dy: 0, dx: 1, atk: 'right', def: 'left' },
    { dy: 0, dx: -1, atk: 'left', def: 'right' }
  ] as const

  adjacents.forEach(({ dy, dx, atk, def }) => {
    const ny = ctx.y + dy
    const nx = ctx.x + dx

    if (ny >= 0 && ny < 3 && nx >= 0 && nx < 3) {
      const defender = ctx.board[ny][nx].card
      if (defender && defender.owner !== ctx.attacker.owner) {
        if (ctx.attacker.values[atk] > defender.values[def]) {
          captures.push({ x: nx, y: ny })
        }
      }
    }
  })
  return captures
}

/**
 * Plus Rule: If (Atk Side A + Def Side A) === (Atk Side B + Def Side B),
 * and at least one is an opponent's card, they are captured.
 */
const applyPlusRule = (ctx: RuleContext): { x: number, y: number }[] => {
  const sums: Map<number, { x: number, y: number }[]> = new Map()
  const adjacents = [
    { dy: -1, dx: 0, atk: 'top', def: 'bottom' },
    { dy: 1, dx: 0, atk: 'bottom', def: 'top' },
    { dy: 0, dx: 1, atk: 'right', def: 'left' },
    { dy: 0, dx: -1, atk: 'left', def: 'right' }
  ] as const

  adjacents.forEach(({ dy, dx, atk, def }) => {
    const ny = ctx.y + dy
    const nx = ctx.x + dx

    if (ny >= 0 && ny < 3 && nx >= 0 && nx < 3) {
      const defender = ctx.board[ny][nx].card
      if (defender) {
        const sum = ctx.attacker.values[atk] + defender.values[def]
        if (!sums.has(sum)) sums.set(sum, [])
        sums.get(sum)!.push({ x: nx, y: ny })
      }
    }
  })

  const captures: { x: number, y: number }[] = []
  sums.forEach((targets) => {
    // Plus applies if at least 2 sides have the same sum
    if (targets.length >= 2) {
      targets.forEach(t => {
        const card = ctx.board[t.y][t.x].card
        // Only capture if it belongs to the opponent
        if (card && card.owner !== ctx.attacker.owner) {
          captures.push(t)
        }
      })
    }
  })

  return captures
}

export const useBattleRules = () => {
  const rulesMap: Record<BattleRuleName, (ctx: RuleContext) => { x: number, y: number }[]> = {
    standard: applyStandardRule,
    plus: applyPlusRule
  }

  const evaluateMatchRules = (activeRules: BattleRuleName[], ctx: RuleContext) => {
    const totalCaptures = new Set<string>()

    activeRules.forEach(ruleName => {
      const ruleFn = rulesMap[ruleName]
      if (ruleFn) {
        const results = ruleFn(ctx)
        results.forEach(pos => totalCaptures.add(`${pos.x},${pos.y}`))
      } else {
        console.warn(`Unknown rule: ${ruleName}`)
      }
    })

    // Convert Set back to coordinate objects and flip cards
    totalCaptures.forEach(coord => {
      const [cx, cy] = coord.split(',').map(Number)
      const targetCard = ctx.board[cy][cx].card
      if (targetCard) {
        targetCard.owner = ctx.attacker.owner
      }
    })
  }

  return {
    evaluateMatchRules
  }
}