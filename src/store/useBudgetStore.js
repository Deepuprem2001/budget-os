import { create } from 'zustand'
import { mockTransactions, mockBudgets, mockUser, mockGoals, mockDebts, mockAssets } from '../lib/mockData'

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
  hasCompletedOnboarding: true,
  customCategories: { income: [], expense: [], },
  dashboardWidgets: {
    spendingForecast: true,
    recentTransactions: true,
    healthScore: true,
    smartInsights: true,
    billReminders: true,
  },
  recurringTransactions: [],
  assets: mockAssets,
  netWorthHistory: [],

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

completeOnboarding: (profileData) => set((state) => ({
  hasCompletedOnboarding: true,
  user: { ...state.user, ...profileData },
})),

addCustomCategory: (type, name) => set((state) => {
  const already = [
    ...state.customCategories[type],
  ].map((c) => c.toLowerCase())
  if (already.includes(name.toLowerCase())) return state
  return {
    customCategories: {
      ...state.customCategories,
      [type]: [...state.customCategories[type], name],
    },
  }
}),

deleteCustomCategory: (type, name) => set((state) => ({
  customCategories: {
    ...state.customCategories,
    [type]: state.customCategories[type].filter((c) => c !== name),
  },
})),

getAllCategories: () => {
  const { customCategories } = get()
  return {
    income: [
      'Salary', 'Freelance', 'Investments', 'Rental', 'Business', 'Other Income',
      ...customCategories.income,
    ],
    expense: [
      'Housing', 'Food', 'Transport', 'Healthcare', 'Entertainment',
      'Shopping', 'Utilities', 'Education', 'Travel', 'Other',
      ...customCategories.expense,
    ],
  }
},

toggleDashboardWidget: (widget) => set((state) => ({
  dashboardWidgets: {
    ...state.dashboardWidgets,
    [widget]: !state.dashboardWidgets[widget],
  },
})),

addRecurringTransaction: (recurring) => set((state) => ({
  recurringTransactions: [
    {
      ...recurring,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      lastGenerated: null,
    },
    ...state.recurringTransactions,
  ],
})),

deleteRecurringTransaction: (id) => set((state) => ({
  recurringTransactions: state.recurringTransactions.filter((r) => r.id !== id),
})),

toggleRecurringTransaction: (id) => set((state) => ({
  recurringTransactions: state.recurringTransactions.map((r) =>
    r.id === id ? { ...r, active: !r.active } : r
  ),
})),

// Checks all recurring transactions and generates any that are due
processRecurringTransactions: () => set((state) => {
  const today = new Date()
  const newTransactions = []
  const updatedRecurring = state.recurringTransactions.map((r) => {
    if (!r.active) return r

    const lastGen = r.lastGenerated ? new Date(r.lastGenerated) : null
    const startDate = new Date(r.startDate)
    let isDue = false

    if (!lastGen) {
      // Never generated — check if start date is today or in the past
      isDue = startDate <= today
    } else {
      // Check based on frequency
      if (r.frequency === 'weekly') {
        const nextDue = new Date(lastGen)
        nextDue.setDate(nextDue.getDate() + 7)
        isDue = nextDue <= today
      } else if (r.frequency === 'monthly') {
        const nextDue = new Date(lastGen)
        nextDue.setMonth(nextDue.getMonth() + 1)
        isDue = nextDue <= today
      } else if (r.frequency === 'yearly') {
        const nextDue = new Date(lastGen)
        nextDue.setFullYear(nextDue.getFullYear() + 1)
        isDue = nextDue <= today
      }
    }

    if (isDue) {
      newTransactions.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        user_id: state.user.id,
        type: r.type,
        amount: r.amount,
        category: r.category,
        description: `${r.description} (Auto)`,
        date: today.toISOString().split('T')[0],
        created_at: today.toISOString(),
        isRecurring: true,
      })
      return { ...r, lastGenerated: today.toISOString() }
    }
    return r
  })

  return {
    recurringTransactions: updatedRecurring,
    transactions: [...newTransactions, ...state.transactions],
  }
}),

markRecurringAsPaid: (id) => set((state) => ({
  recurringTransactions: state.recurringTransactions.map((r) =>
    r.id === id ? { ...r, lastGenerated: new Date().toISOString() } : r
  ),
})),

addAsset: (asset) => set((state) => ({
  assets: [
    {
      ...asset,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    },
    ...state.assets,
  ],
})),

updateAsset: (id, updates) => set((state) => ({
  assets: state.assets.map((a) => a.id === id ? { ...a, ...updates } : a),
})),

deleteAsset: (id) => set((state) => ({
  assets: state.assets.filter((a) => a.id !== id),
})),

saveNetWorthSnapshot: () => set((state) => {
  const totalAssets = state.assets.reduce((sum, a) => sum + a.value, 0)
  const totalLiabilities = state.debts.reduce((sum, d) => sum + d.remainingAmount, 0)
  const netWorth = totalAssets - totalLiabilities
  const today = new Date()
  const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

  // Replace existing snapshot for this month or add new
  const exists = state.netWorthHistory.find((h) => h.month === monthKey)
  if (exists) {
    return {
      netWorthHistory: state.netWorthHistory.map((h) =>
        h.month === monthKey
          ? { ...h, assets: totalAssets, liabilities: totalLiabilities, netWorth }
          : h
      ),
    }
  }
  return {
    netWorthHistory: [
      ...state.netWorthHistory,
      {
        month: monthKey,
        assets: totalAssets,
        liabilities: totalLiabilities,
        netWorth,
        savedAt: today.toISOString(),
      },
    ].sort((a, b) => a.month.localeCompare(b.month)),
  }
}),

}))

export default useBudgetStore