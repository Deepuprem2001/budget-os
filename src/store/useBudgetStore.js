import { create } from 'zustand'
import { mockTransactions, mockBudgets, mockUser, mockGoals, mockDebts } from '../lib/mockData'

const useBudgetStore = create((set, get) => ({
  // State
  user: mockUser,
  transactions: mockTransactions,
  budgets: mockBudgets,
  loading: false,
  error: null,
  filterMonth: new Date().getMonth() + 1,
  filterYear: new Date().getFullYear(),
  monthlyLimits: [],
  goals: mockGoals,
  debts: mockDebts,

  // Filter actions
  setFilterMonth: (month) => set({ filterMonth: month }),
  setFilterYear: (year) => set({ filterYear: year }),

  // Transaction actions
  addTransaction: (transaction) => set((state) => ({
    transactions: [
      {
        ...transaction,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
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
  const { transactions, filterMonth, filterYear } = get()
  return transactions
    .filter((t) => {
      const date = new Date(t.date)
      return (
        t.type === 'expense' &&
        t.category !== 'Savings' &&
        date.getMonth() + 1 === filterMonth &&
        date.getFullYear() === filterYear
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)
},

  getBalance: () => {
    return get().getTotalIncome() - get().getTotalExpenses()
  },

  setMonthlyLimit: (month, year, limit) => set((state) => {
  const exists = state.monthlyLimits.find(
    (l) => l.month === month && l.year === year
  )
  if (exists) {
    return {
      monthlyLimits: state.monthlyLimits.map((l) =>
        l.month === month && l.year === year ? { ...l, limit } : l
      ),
    }
  }
  return {
    monthlyLimits: [...state.monthlyLimits, { month, year, limit }],
  }
}),

addGoal: (goal) => set((state) => ({
  goals: [
    {
      ...goal,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      completed: false,
    },
    ...state.goals,
  ],
})),

updateGoal: (id, updates) => set((state) => ({
  goals: state.goals.map((g) => g.id === id ? { ...g, ...updates } : g),
})),

deleteGoal: (id) => set((state) => ({
  goals: state.goals.filter((g) => g.id !== id),
})),

addDebt: (debt) => set((state) => ({
  debts: [
    {
      ...debt,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    },
    ...state.debts,
  ],
})),

updateDebt: (id, updates) => set((state) => ({
  debts: state.debts.map((d) => d.id === id ? { ...d, ...updates } : d),
})),

deleteDebt: (id) => set((state) => ({
  debts: state.debts.filter((d) => d.id !== id),
})),

}))

export default useBudgetStore