import { describe, it, expect, beforeEach } from 'vitest'
import useBudgetStore from '../store/useBudgetStore'

// Reset store before each test
beforeEach(() => {
  useBudgetStore.setState({
    transactions: [],
    budgets: [],
    filterMonth: 3,
    filterYear: 2026,
  })
})

describe('addTransaction', () => {
  it('adds a transaction to the store', () => {
    const { addTransaction } = useBudgetStore.getState()

    addTransaction({
      type: 'expense',
      amount: 100,
      category: 'Food',
      description: 'Groceries',
      date: '2026-03-01',
    })

    const { transactions } = useBudgetStore.getState()
    expect(transactions).toHaveLength(1)
    expect(transactions[0].description).toBe('Groceries')
    expect(transactions[0].amount).toBe(100)
  })

  it('adds transaction to the beginning of the list', () => {
    const { addTransaction } = useBudgetStore.getState()

    addTransaction({
      type: 'expense',
      amount: 100,
      category: 'Food',
      description: 'First',
      date: '2026-03-01',
    })

    addTransaction({
      type: 'expense',
      amount: 200,
      category: 'Food',
      description: 'Second',
      date: '2026-03-02',
    })

    const { transactions } = useBudgetStore.getState()
    expect(transactions[0].description).toBe('Second')
  })
})

describe('updateTransaction', () => {
  it('updates an existing transaction', () => {
    const { addTransaction, updateTransaction } = useBudgetStore.getState()

    addTransaction({
      type: 'expense',
      amount: 100,
      category: 'Food',
      description: 'Groceries',
      date: '2026-03-01',
    })

    const { transactions } = useBudgetStore.getState()
    const id = transactions[0].id

    updateTransaction(id, { amount: 200, description: 'Updated groceries' })

    const updated = useBudgetStore.getState().transactions[0]
    expect(updated.amount).toBe(200)
    expect(updated.description).toBe('Updated groceries')
  })
    it('does not affect other transactions', () => {
    const { addTransaction, updateTransaction } = useBudgetStore.getState()

    addTransaction({
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'First',
        date: '2026-03-01',
    })

    // Small delay between adds to ensure unique IDs
    const { transactions: afterFirst } = useBudgetStore.getState()
    const firstId = afterFirst[0].id

    addTransaction({
        type: 'expense',
        amount: 200,
        category: 'Food',
        description: 'Second',
        date: '2026-03-02',
    })

    const { transactions: afterSecond } = useBudgetStore.getState()
    const secondId = afterSecond.find((t) => t.description === 'Second').id

    // Update First only
    updateTransaction(firstId, { amount: 999 })

    // Check Second is unchanged
    const second = useBudgetStore.getState().transactions.find(
        (t) => t.id === secondId
    )
    expect(second.amount).toBe(200)
    })
})

describe('deleteTransaction', () => {
  it('removes the correct transaction', () => {
    const { addTransaction, deleteTransaction } = useBudgetStore.getState()

    addTransaction({
      type: 'expense',
      amount: 100,
      category: 'Food',
      description: 'To delete',
      date: '2026-03-01',
    })

    const { transactions } = useBudgetStore.getState()
    const id = transactions[0].id

    deleteTransaction(id)

    expect(useBudgetStore.getState().transactions).toHaveLength(0)
  })
})

describe('setBudget', () => {
  it('creates a new budget', () => {
    const { setBudget } = useBudgetStore.getState()

    setBudget({
      category: 'Food',
      amount: 400,
      month: 3,
      year: 2026,
    })

    const { budgets } = useBudgetStore.getState()
    expect(budgets).toHaveLength(1)
    expect(budgets[0].amount).toBe(400)
  })

  it('updates existing budget instead of creating duplicate', () => {
    const { setBudget } = useBudgetStore.getState()

    setBudget({ category: 'Food', amount: 400, month: 3, year: 2026 })
    setBudget({ category: 'Food', amount: 600, month: 3, year: 2026 })

    const { budgets } = useBudgetStore.getState()
    expect(budgets).toHaveLength(1)
    expect(budgets[0].amount).toBe(600)
  })
})

describe('getFilteredTransactions', () => {
  it('returns only transactions for selected month and year', () => {
    const { addTransaction, getFilteredTransactions } =
      useBudgetStore.getState()

    addTransaction({
      type: 'expense',
      amount: 100,
      category: 'Food',
      description: 'March transaction',
      date: '2026-03-15',
    })

    addTransaction({
      type: 'expense',
      amount: 200,
      category: 'Food',
      description: 'April transaction',
      date: '2026-04-15',
    })

    const filtered = getFilteredTransactions()
    expect(filtered).toHaveLength(1)
    expect(filtered[0].description).toBe('March transaction')
  })
})

describe('getTotalIncome and getTotalExpenses', () => {
  it('calculates totals correctly', () => {
    const { addTransaction, getTotalIncome, getTotalExpenses } =
      useBudgetStore.getState()

    addTransaction({
      type: 'income',
      amount: 3000,
      category: 'Salary',
      description: 'Salary',
      date: '2026-03-01',
    })

    addTransaction({
      type: 'expense',
      amount: 500,
      category: 'Food',
      description: 'Groceries',
      date: '2026-03-02',
    })

    expect(getTotalIncome()).toBe(3000)
    expect(getTotalExpenses()).toBe(500)
  })
})

describe('getBalance', () => {
  it('returns correct balance', () => {
    const { addTransaction, getBalance } = useBudgetStore.getState()

    addTransaction({
      type: 'income',
      amount: 3000,
      category: 'Salary',
      description: 'Salary',
      date: '2026-03-01',
    })

    addTransaction({
      type: 'expense',
      amount: 500,
      category: 'Food',
      description: 'Groceries',
      date: '2026-03-02',
    })

    expect(getBalance()).toBe(2500)
  })

  it('returns negative balance when expenses exceed income', () => {
    const { addTransaction, getBalance } = useBudgetStore.getState()

    addTransaction({
      type: 'income',
      amount: 500,
      category: 'Salary',
      description: 'Salary',
      date: '2026-03-01',
    })

    addTransaction({
      type: 'expense',
      amount: 1000,
      category: 'Food',
      description: 'Groceries',
      date: '2026-03-02',
    })

    expect(getBalance()).toBe(-500)
  })
})