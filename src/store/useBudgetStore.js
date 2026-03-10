import { create } from 'zustand'
import { mockTransactions, mockBudgets, mockUser } from '../lib/mockData'

const useBudgetStore = create((set, get) => ({
  // State
  user: mockUser,
  transactions: mockTransactions,
  budgets: mockBudgets,
  loading: false,
  error: null,
  filterMonth: new Date().getMonth() + 1,
  filterYear: new Date().getFullYear(),

  // Filter actions
  setFilterMonth: (month) => set({ filterMonth: month }),
  setFilterYear: (year) => set({ filterYear: year }),

  // Transaction actions
  addTransaction: (transaction) => set((state) => ({
    transactions: [
      {
        ...transaction,
        id: Date.now().toString(),
        user_id: state.user.id,
        created_at: new Date().toISOString(),
      },
      ...state.transactions,
    ],
  })),

  updateTransaction: (id, updates) => set((state) => ({
    transactions: state.transactions.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    ),
  })),

  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter((t) => t.id !== id),
  })),

  // Budget actions
  setBudget: (budget) => set((state) => {
    const existing = state.budgets.find(
      (b) =>
        b.category === budget.category &&
        b.month === budget.month &&
        b.year === budget.year
    )
    if (existing) {
      return {
        budgets: state.budgets.map((b) =>
          b.id === existing.id ? { ...b, amount: budget.amount } : b
        ),
      }
    }
    return {
      budgets: [
        ...state.budgets,
        {
          ...budget,
          id: Date.now().toString(),
          user_id: state.user.id,
        },
      ],
    }
  }),

  deleteBudget: (id) => set((state) => ({
    budgets: state.budgets.filter((b) => b.id !== id),
  })),

  // Computed values
  getFilteredTransactions: () => {
    const { transactions, filterMonth, filterYear } = get()
    return transactions.filter((t) => {
      const date = new Date(t.date)
      return (
        date.getMonth() + 1 === filterMonth &&
        date.getFullYear() === filterYear
      )
    })
  },

  getTotalIncome: () => {
    const filtered = get().getFilteredTransactions()
    return filtered
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  },

  getTotalExpenses: () => {
    const filtered = get().getFilteredTransactions()
    return filtered
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  },

  getBalance: () => {
    return get().getTotalIncome() - get().getTotalExpenses()
  },
}))

export default useBudgetStore