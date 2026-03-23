//useBattleRules.test.ts
import { describe, it, expect } from 'vitest'
import { useBattleRules } from '@/use/useBattleRules'
import type { BoardSlot, GameCard } from '@/types/game'

describe('Battle Rules Engine', () => {
  const { evaluateMatchRules } = useBattleRules()

  const createBoard = (): BoardSlot[][] =>
    Array.from({ length: 3 }, (_, x) =>
      Array.from({ length: 3 }, (_, y) => ({ x, y, card: null }))
    )

  // --- HIGH RULE TESTS ---
  it('High Rule: Happy Case - Captures when attacker value is HIGHER than defender', () => {
    const board = createBoard()
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 4, left: 1 } } as GameCard
    const attacker = { owner: 'player', values: { top: 6, right: 1, bottom: 1, left: 1 } } as GameCard

    evaluateMatchRules(['high'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('player') // 6 > 4, captured
  })

  it('High Rule: Unhappy Case - Does NOT capture when attacker value is lower or equal', () => {
    const board = createBoard()
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 6, left: 1 } } as GameCard
    const attacker = { owner: 'player', values: { top: 4, right: 1, bottom: 1, left: 1 } } as GameCard

    evaluateMatchRules(['high'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('npc') // 4 < 6, not captured
  })

  // --- LOW RULE TESTS ---
  it('Low Rule: Happy Case - Captures when attacker value is LOWER than defender', () => {
    const board = createBoard()
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 8, left: 1 } } as GameCard
    const attacker = { owner: 'player', values: { top: 3, right: 1, bottom: 1, left: 1 } } as GameCard

    evaluateMatchRules(['low'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('player') // 3 < 8, captured due to low rule
  })

  it('Low Rule: Unhappy Case - Does NOT capture when attacker value is higher or equal', () => {
    const board = createBoard()
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 4, left: 1 } } as GameCard
    const attacker = { owner: 'player', values: { top: 7, right: 1, bottom: 1, left: 1 } } as GameCard

    evaluateMatchRules(['low'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('npc') // 7 > 4, not captured under low rule
  })

  // --- PLUS RULE TESTS ---
  it('Plus Rule: Captures when sums match', () => {
    const board = createBoard()
    // Row 0, Col 1 (Above [1,1]) -> Needs bottom value to sum with attacker top
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 4, left: 1 } } as GameCard
    // Row 1, Col 0 (Left of [1,1]) -> Needs right value to sum with attacker left
    board[1][0].card = { owner: 'npc', values: { top: 1, right: 6, bottom: 1, left: 1 } } as GameCard

    const attacker = { owner: 'player', values: { top: 6, right: 1, bottom: 1, left: 4 } } as GameCard

    evaluateMatchRules(['plus'], { x: 1, y: 1, board, attacker })

    // 6+4=10 and 4+6=10. Both flip.
    expect(board[0][1].card?.owner).toBe('player')
    expect(board[1][0].card?.owner).toBe('player')
  })

  it('Plus Rule: Unhappy Case - Should NOT capture when sums do NOT match', () => {
    const board = createBoard()
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 4, left: 1 } } as GameCard
    board[1][0].card = { owner: 'npc', values: { top: 1, right: 5, bottom: 1, left: 1 } } as GameCard
    const attacker = { owner: 'player', values: { top: 6, right: 1, bottom: 1, left: 4 } } as GameCard

    evaluateMatchRules(['plus'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('npc')
    expect(board[1][0].card?.owner).toBe('npc')
  })

  // --- SAME RULE TESTS ---
  it('Same Rule: Happy Case - Captures when values match on at least 2 sides', () => {
    const board = createBoard()
    // Row 0, Col 1 (Above): Attacker Top (7) === Board Bottom (7)
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 7, left: 1 } } as GameCard
    // Row 1, Col 2 (Right): Attacker Right (3) === Board Left (3)
    board[1][2].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 1, left: 3 } } as GameCard

    const attacker = { owner: 'player', values: { top: 7, right: 3, bottom: 1, left: 1 } } as GameCard

    evaluateMatchRules(['same'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('player')
    expect(board[1][2].card?.owner).toBe('player')
  })

  it('Same Rule: Unhappy Case - Should NOT capture if only ONE side matches', () => {
    const board = createBoard()
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 7, left: 1 } } as GameCard
    board[1][2].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 1, left: 5 } } as GameCard
    const attacker = { owner: 'player', values: { top: 7, right: 3, bottom: 1, left: 1 } } as GameCard

    evaluateMatchRules(['same'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('npc')
    expect(board[1][2].card?.owner).toBe('npc')
  })

  // --- COMBO RULE TESTS ---
  it('Combo Rule: Happy Case - Chain reaction after a Same trigger', () => {
    const board = createBoard()

    // NPC card at Row 1, Col 0 (Left): Attacker Left (1) === Card Right (1)
    board[1][0].card = { owner: 'npc', values: { top: 8, right: 1, bottom: 5, left: 1 } } as GameCard
    // NPC card at Row 2, Col 1 (Below): Attacker Bottom (1) === Card Top (1)
    board[2][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 1, left: 3 } } as GameCard
    // Combo Target at Row 0, Col 0: Above the card at [1,0]. [1,0] Top (8) > [0,0] Bottom (1)
    board[0][0].card = { owner: 'npc', values: { top: 1, right: 2, bottom: 1, left: 1 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 5, right: 3, bottom: 1, left: 1 }
    } as GameCard

    evaluateMatchRules(['same', 'combo'], { x: 1, y: 1, board, attacker })

    expect(board[1][0].card?.owner).toBe('player')
    expect(board[2][1].card?.owner).toBe('player')
    expect(board[0][0].card?.owner).toBe('player')
  })

  it('Combo Rule: Unhappy Case - No chain reaction if no special rules trigger', () => {
    const board = createBoard()

    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 9, left: 1 } } as GameCard
    board[0][0].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 1, left: 1 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 5, right: 1, bottom: 1, left: 1 }
    } as GameCard

    evaluateMatchRules(['same', 'plus', 'combo'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('npc')
    expect(board[0][0].card?.owner).toBe('npc')
  })

  it('Combo Rule: Happy Case - Chain reaction after a Plus trigger', () => {
    const board = createBoard()

    // NPC card at Row 0, Col 1 (Above): Atk Top (5) + Card Bottom (5) = 10. Card has Top (9).
    board[0][1].card = { owner: 'npc', values: { top: 9, right: 1, bottom: 5, left: 1 } } as GameCard
    // NPC card at Row 1, Col 0 (Left): Atk Left (4) + Card Right (6) = 10.
    board[1][0].card = { owner: 'npc', values: { top: 1, right: 6, bottom: 1, left: 1 } } as GameCard
    // Combo Target at Row 0, Col 0: Left of the card at [0,1]. [0,1] Left (1) vs [0,0] Right (1).
    // Wait, let's use [0,1] Top (9) to hit a card at Row -1 (impossible) or simply flip its neighbor.
    // Let's place target at [0,0] and make [0,1] Left (9) > [0,0] Right (1)
    board[0][1].card.values.left = 9
    board[0][0].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 1, left: 1 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 5, right: 1, bottom: 1, left: 4 }
    } as GameCard

    evaluateMatchRules(['plus', 'combo'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('player')
    expect(board[1][0].card?.owner).toBe('player')
    expect(board[0][0].card?.owner).toBe('player')
  })
})