//useBattleRules.ts
import type { GameCard, BoardSlot } from '@/types/game'

export type BattleRuleName = 'standard' | 'plus' | 'same' | 'combo' | 'low'
export type TradeRuleName = 'one' | 'all' | 'random' | 'conquered'

export interface RuleContext {
  x: number
  y: number
  board: BoardSlot[][]
  attacker: GameCard
}

const ADJACENTS = [
  { dy: -1, dx: 0, atk: 'top', def: 'bottom' },
  { dy: 1, dx: 0, atk: 'bottom', def: 'top' },
  { dy: 0, dx: 1, atk: 'right', def: 'left' },
  { dy: 0, dx: -1, atk: 'left', def: 'right' }
] as const

export const useBattleRules = () => {
  const getAdj = (board: BoardSlot[][], currX: number, currY: number, dy: number, dx: number) => {
    const ny = currY + dy
    const nx = currX + dx
    if (ny >= 0 && ny < 3 && nx >= 0 && nx < 3) {
      return { card: board[ny][nx].card, x: nx, y: ny }
    }
    return null
  }

  // Added a `visited` Set to act as a strict recursion guard, preventing infinite loops during testing/gameplay
  const runCombo = (
    board: BoardSlot[][],
    x: number,
    y: number,
    owner: string,
    activeRules: BattleRuleName[],
    visited = new Set<string>()
  ): boolean => {
    const sourceCard = board[y][x].card
    if (!sourceCard) return false

    // Recursion Guard: Prevent infinite looping on the same slot
    const posKey = `${x},${y}`
    if (visited.has(posKey)) return false
    visited.add(posKey)

    let triggered = false

    // Combo always falls back to a base capture rule. If 'low' isn't active, it defaults to 'standard' logic
    const useLow = activeRules.includes('low')
    const useStandard = !useLow

    ADJACENTS.forEach(({ dy, dx, atk, def }) => {
      const neighbor = getAdj(board, x, y, dy, dx)

      if (neighbor?.card && neighbor.card.owner !== owner) {
        const valAtk = sourceCard.values[atk as keyof typeof sourceCard.values]
        const valDef = neighbor.card.values[def as keyof typeof neighbor.card.values]

        let captured = false
        if (useLow && valAtk < valDef) captured = true
        else if (useStandard && valAtk > valDef) captured = true

        if (captured) {
          neighbor.card.owner = owner as any
          neighbor.card.lastRuleTrigger = 'Combo'
          triggered = true
          runCombo(board, neighbor.x, neighbor.y, owner, activeRules, visited)
        }
      }
    })

    return triggered
  }

  const evaluateMatchRules = (activeRules: BattleRuleName[], ctx: RuleContext): boolean => {
    let specialTriggered = false
    const specialFlips: { x: number; y: number; card: GameCard; rule: 'Plus' | 'Same' }[] = []

    if (activeRules.includes('plus')) {
      const sums = new Map<number, { x: number; y: number; card: GameCard }[]>()
      ADJACENTS.forEach(({ dy, dx, atk, def }) => {
        const target = getAdj(ctx.board, ctx.x, ctx.y, dy, dx)
        if (target?.card) {
          const sum = ctx.attacker.values[atk as keyof typeof ctx.attacker.values] +
            target.card.values[def as keyof typeof target.card.values]
          if (!sums.has(sum)) sums.set(sum, [])
          sums.get(sum)!.push({ x: target.x, y: target.y, card: target.card })
        }
      })
      sums.forEach(list => {
        if (list.length >= 2) {
          list.forEach(item => {
            if (item.card.owner !== ctx.attacker.owner) {
              specialFlips.push({ ...item, rule: 'Plus' })
              specialTriggered = true
            }
          })
        }
      })
    }

    if (activeRules.includes('same')) {
      const matches: { x: number; y: number; card: GameCard }[] = []
      ADJACENTS.forEach(({ dy, dx, atk, def }) => {
        const target = getAdj(ctx.board, ctx.x, ctx.y, dy, dx)
        if (target?.card) {
          const valAtk = ctx.attacker.values[atk as keyof typeof ctx.attacker.values]
          const valDef = target.card.values[def as keyof typeof target.card.values]
          if (valAtk === valDef) matches.push({ x: target.x, y: target.y, card: target.card })
        }
      })
      if (matches.length >= 2) {
        matches.forEach(item => {
          if (item.card.owner !== ctx.attacker.owner) {
            specialFlips.push({ ...item, rule: 'Same' })
            specialTriggered = true
          }
        })
      }
    }

    specialFlips.forEach(f => {
      // Ensure we only flip it if it hasn't somehow been flipped already
      if (f.card.owner !== ctx.attacker.owner) {
        f.card.owner = ctx.attacker.owner
        f.card.lastRuleTrigger = f.rule
        if (activeRules.includes('combo')) {
          // Initialize the recursion guard Set here
          const comboResult = runCombo(ctx.board, f.x, f.y, ctx.attacker.owner, activeRules, new Set<string>())
          if (comboResult) specialTriggered = true
        }
      }
    })

    const useLow = activeRules.includes('low')
    // Standard applies if explicitly included, OR if neither low nor any special rules are active
    const useStandard = activeRules.includes('standard') || (!useLow && activeRules.length === 0)

    if (useStandard || useLow) {
      ADJACENTS.forEach(({ dy, dx, atk, def }) => {
        const target = getAdj(ctx.board, ctx.x, ctx.y, dy, dx)
        if (target?.card && target.card.owner !== ctx.attacker.owner) {
          const valAtk = ctx.attacker.values[atk as keyof typeof ctx.attacker.values]
          const valDef = target.card.values[def as keyof typeof target.card.values]

          let captured = false
          if (useLow && valAtk < valDef) captured = true
          else if (useStandard && valAtk > valDef) captured = true

          if (captured) {
            target.card.owner = ctx.attacker.owner
          }
        }
      })
    }

    return specialTriggered
  }

  return { evaluateMatchRules }
}