import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useBudgetStore = create((set, get) => ({
  // ─── State ────────────────────────────────────────────────────────────────
  user: null,
  transactions: [],
  budgets: [],
  goals: [],
  debts: [],
  assets: [],
  netWorthHistory: [],
  recurringTransactions: [],
  monthlyLimits: [],
  customCategories: { income: [], expense: [] },
  dashboardWidgets: {
    spendingForecast: true,
    recentTransactions: true,
    healthScore: true,
    smartInsights: true,
    billReminders: true,
  },
  hasCompletedOnboarding: false,
  loading: false,
  error: null,
  filterMonth: new Date().getMonth() + 1,
  filterYear: new Date().getFullYear(),
  bootstrapping: true,

  // ─── Bootstrap — fetch everything on login ────────────────────────────────
  fetchAll: async (user) => {
    set({ loading: true, user })

    try {
      const [
        { data: transactions },
        { data: budgets },
        { data: goals },
        { data: debts },
        { data: assets },
        { data: netWorthHistory },
        { data: recurringTransactions },
        { data: monthlyLimits },
        { data: customCategories },
        { data: dashboardWidgets },
        { data: profile },
      ] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('budgets').select('*').eq('user_id', user.id),
        supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('debts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('assets').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('net_worth_history').select('*').eq('user_id', user.id).order('month', { ascending: true }),
        supabase.from('recurring_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('monthly_limits').select('*').eq('user_id', user.id),
        supabase.from('custom_categories').select('*').eq('user_id', user.id),
        supabase.from('dashboard_widgets').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      ])

      // Parse custom categories into income/expense arrays
      const parsedCustomCategories = {
        income: customCategories?.filter((c) => c.type === 'income').map((c) => c.name) || [],
        expense: customCategories?.filter((c) => c.type === 'expense').map((c) => c.name) || [],
      }

      // Parse monthly limits
      const parsedMonthlyLimits = monthlyLimits?.map((l) => ({
        month: l.month,
        year: l.year,
        limit: l.limit_amount,
      })) || []

      set({
        transactions: transactions || [],
        budgets: budgets || [],
        goals: goals?.map((g) => ({
          ...g,
          targetAmount: g.target_amount,
          currentAmount: g.current_amount,
          targetDate: g.target_date,
        })) || [],
        debts: debts?.map((d) => ({
          ...d,
          originalAmount: d.original_amount,
          remainingAmount: d.remaining_amount,
          interestRate: d.interest_rate,
          minimumPayment: d.minimum_payment,
          dueDate: d.due_date,
        })) || [],
        assets: assets || [],
        netWorthHistory: netWorthHistory?.map((h) => ({
          ...h,
          netWorth: h.net_worth,
        })) || [],
        recurringTransactions: recurringTransactions?.map((r) => ({
          ...r,
          startDate: r.start_date,
          lastGenerated: r.last_generated,
        })) || [],
        monthlyLimits: parsedMonthlyLimits,
        customCategories: parsedCustomCategories,
        dashboardWidgets: dashboardWidgets ? {
          spendingForecast: dashboardWidgets.spending_forecast,
          recentTransactions: dashboardWidgets.recent_transactions,
          healthScore: dashboardWidgets.health_score,
          smartInsights: dashboardWidgets.smart_insights,
          billReminders: dashboardWidgets.bill_reminders,
        } : {
          spendingForecast: true,
          recentTransactions: true,
          healthScore: true,
          smartInsights: true,
          billReminders: true,
        },
        hasCompletedOnboarding: profile?.full_name ? true : false,
        bootstrapping: false,
        loading: false,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      set({ loading: false,bootstrapping: false, error: error.message })
    }
  },

  // ─── Filter actions ───────────────────────────────────────────────────────
  setFilterMonth: (month) => set({ filterMonth: month }),
  setFilterYear: (year) => set({ filterYear: year }),

  // ─── Transaction actions ──────────────────────────────────────────────────
  addTransaction: async (transaction) => {
    const { user } = get()
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: user.id })
      .select()
      .single()

    if (error) { console.error(error); return }

    // Immediately update local state so UI re-renders
    set((state) => ({
      transactions: [data, ...state.transactions],
    }))
  },

  updateTransaction: async (id, updates) => {
    const { error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)

    if (error) { console.error(error); return }

    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }))
  },

  deleteTransaction: async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) { console.error(error); return }
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }))
  },

  // ─── Budget actions ───────────────────────────────────────────────────────
  setBudget: async (budget) => {
    const { user, budgets } = get()
    const existing = budgets.find(
      (b) => b.category === budget.category &&
             b.month === budget.month &&
             b.year === budget.year
    )

    if (existing) {
      const { error } = await supabase
        .from('budgets')
        .update({ amount: budget.amount })
        .eq('id', existing.id)

      if (error) { console.error(error); return }
      set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === existing.id ? { ...b, amount: budget.amount } : b
        ),
      }))
    } else {
      const { data, error } = await supabase
        .from('budgets')
        .insert({ ...budget, user_id: user.id })
        .select()
        .single()

      if (error) { console.error(error); return }
      set((state) => ({
        budgets: [...state.budgets, data],
      }))
    }
  },

  deleteBudget: async (id) => {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)

    if (error) { console.error(error); return }
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    }))
  },

  // ─── Goal actions ─────────────────────────────────────────────────────────
  addGoal: async (goal) => {
    const { user } = get()
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        name: goal.name,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount || 0,
        target_date: goal.targetDate,
        emoji: goal.emoji,
        completed: false,
      })
      .select()
      .single()

    if (error) { console.error(error); return }

    set((state) => ({
      goals: [{
        ...data,
        targetAmount: data.target_amount,
        currentAmount: data.current_amount,
        targetDate: data.target_date,
      }, ...state.goals],
    }))
  },

  updateGoal: async (id, updates) => {
    const dbUpdates = {}
    if (updates.currentAmount !== undefined) dbUpdates.current_amount = updates.currentAmount
    if (updates.completed !== undefined) dbUpdates.completed = updates.completed
    if (updates.targetAmount !== undefined) dbUpdates.target_amount = updates.targetAmount
    if (updates.targetDate !== undefined) dbUpdates.target_date = updates.targetDate
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.emoji !== undefined) dbUpdates.emoji = updates.emoji

    const { error } = await supabase
      .from('goals')
      .update(dbUpdates)
      .eq('id', id)

    if (error) { console.error(error); return }

    set((state) => ({
      goals: state.goals.map((g) => g.id === id ? { ...g, ...updates } : g),
    }))
  },

  deleteGoal: async (id) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)

    if (error) { console.error(error); return }
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    }))
  },

  // ─── Debt actions ─────────────────────────────────────────────────────────
  addDebt: async (debt) => {
    const { user } = get()
    const { data, error } = await supabase
      .from('debts')
      .insert({
        user_id: user.id,
        name: debt.name,
        type: debt.type,
        emoji: debt.emoji,
        color: debt.color,
        original_amount: debt.originalAmount,
        remaining_amount: debt.remainingAmount,
        interest_rate: debt.interestRate,
        minimum_payment: debt.minimumPayment,
        due_date: debt.dueDate || null,
      })
      .select()
      .single()

    if (error) { console.error(error); return }

    set((state) => ({
      debts: [{
        ...data,
        originalAmount: data.original_amount,
        remainingAmount: data.remaining_amount,
        interestRate: data.interest_rate,
        minimumPayment: data.minimum_payment,
        dueDate: data.due_date,
      }, ...state.debts],
    }))
  },

  updateDebt: async (id, updates) => {
    const dbUpdates = {}
    if (updates.remainingAmount !== undefined) dbUpdates.remaining_amount = updates.remainingAmount
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.interestRate !== undefined) dbUpdates.interest_rate = updates.interestRate
    if (updates.minimumPayment !== undefined) dbUpdates.minimum_payment = updates.minimumPayment

    const { error } = await supabase
      .from('debts')
      .update(dbUpdates)
      .eq('id', id)

    if (error) { console.error(error); return }
    set((state) => ({
      debts: state.debts.map((d) => d.id === id ? { ...d, ...updates } : d),
    }))
  },

  deleteDebt: async (id) => {
    const { error } = await supabase
      .from('debts')
      .delete()
      .eq('id', id)

    if (error) { console.error(error); return }
    set((state) => ({
      debts: state.debts.filter((d) => d.id !== id),
    }))
  },

  // ─── Asset actions ────────────────────────────────────────────────────────
  addAsset: async (asset) => {
    const { user } = get()
    const { data, error } = await supabase
      .from('assets')
      .insert({ ...asset, user_id: user.id })
      .select()
      .single()

    if (error) { console.error(error); return }
    set((state) => ({
      assets: [data, ...state.assets],
    }))
  },

  updateAsset: async (id, updates) => {
    const { error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', id)

    if (error) { console.error(error); return }
    set((state) => ({
      assets: state.assets.map((a) => a.id === id ? { ...a, ...updates } : a),
    }))
  },

  deleteAsset: async (id) => {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id)

    if (error) { console.error(error); return }
    set((state) => ({
      assets: state.assets.filter((a) => a.id !== id),
    }))
  },

  // ─── Net Worth snapshot ───────────────────────────────────────────────────
  saveNetWorthSnapshot: async () => {
    const { user, assets, debts, netWorthHistory } = get()
    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0)
    const totalLiabilities = debts.reduce((sum, d) => sum + (d.remainingAmount || d.remaining_amount || 0), 0)
    const netWorth = totalAssets - totalLiabilities
    const today = new Date()
    const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

    const existing = netWorthHistory.find((h) => h.month === monthKey)

    if (existing) {
      const { error } = await supabase
        .from('net_worth_history')
        .update({ assets: totalAssets, liabilities: totalLiabilities, net_worth: netWorth })
        .eq('id', existing.id)

      if (error) { console.error(error); return }
      set((state) => ({
        netWorthHistory: state.netWorthHistory.map((h) =>
          h.month === monthKey
            ? { ...h, assets: totalAssets, liabilities: totalLiabilities, netWorth }
            : h
        ),
      }))
    } else {
      const { data, error } = await supabase
        .from('net_worth_history')
        .insert({
          user_id: user.id,
          month: monthKey,
          assets: totalAssets,
          liabilities: totalLiabilities,
          net_worth: netWorth,
        })
        .select()
        .single()

      if (error) { console.error(error); return }
      set((state) => ({
        netWorthHistory: [...state.netWorthHistory, {
          ...data,
          netWorth: data.net_worth,
        }].sort((a, b) => a.month.localeCompare(b.month)),
      }))
    }
  },

  // ─── Recurring transactions ───────────────────────────────────────────────
  addRecurringTransaction: async (recurring) => {
    const { user } = get()
    const { data, error } = await supabase
      .from('recurring_transactions')
      .insert({
        user_id: user.id,
        type: recurring.type,
        description: recurring.description,
        amount: recurring.amount,
        category: recurring.category,
        frequency: recurring.frequency,
        start_date: recurring.startDate,
        last_generated: recurring.lastGenerated || null,
        active: recurring.active,
      })
      .select()
      .single()

    if (error) { console.error(error); return }

    set((state) => ({
      recurringTransactions: [
        {
          ...data,
          startDate: data.start_date,
          lastGenerated: data.last_generated,
        },
        ...state.recurringTransactions,
      ],
    }))
  },

  deleteRecurringTransaction: async (id) => {
    const { error } = await supabase
      .from('recurring_transactions')
      .delete()
      .eq('id', id)

    if (error) { console.error(error); return }
    set((state) => ({
      recurringTransactions: state.recurringTransactions.filter((r) => r.id !== id),
    }))
  },

  toggleRecurringTransaction: async (id) => {
    const { recurringTransactions } = get()
    const recurring = recurringTransactions.find((r) => r.id === id)
    if (!recurring) return

    const { error } = await supabase
      .from('recurring_transactions')
      .update({ active: !recurring.active })
      .eq('id', id)

    if (error) { console.error(error); return }
    set((state) => ({
      recurringTransactions: state.recurringTransactions.map((r) =>
        r.id === id ? { ...r, active: !r.active } : r
      ),
    }))
  },

  markRecurringAsPaid: async (id) => {
    const now = new Date().toISOString()
    const { error } = await supabase
      .from('recurring_transactions')
      .update({ last_generated: now })
      .eq('id', id)

    if (error) { console.error(error); return }
    set((state) => ({
      recurringTransactions: state.recurringTransactions.map((r) =>
        r.id === id ? { ...r, lastGenerated: now, last_generated: now } : r
      ),
    }))
  },

  processRecurringTransactions: async () => {
    const { recurringTransactions, user } = get()
    const today = new Date()
    const newTransactions = []
    const updates = []

    recurringTransactions.forEach((r) => {
      if (!r.active) return

      const lastGen = r.lastGenerated || r.last_generated
        ? new Date(r.lastGenerated || r.last_generated)
        : null
      const startDate = new Date(r.startDate || r.start_date)
      let isDue = false

      if (!lastGen) {
        isDue = startDate <= today
      } else {
        const nextDue = new Date(lastGen)
        if (r.frequency === 'weekly') nextDue.setDate(nextDue.getDate() + 7)
        else if (r.frequency === 'monthly') nextDue.setMonth(nextDue.getMonth() + 1)
        else if (r.frequency === 'yearly') nextDue.setFullYear(nextDue.getFullYear() + 1)
        isDue = nextDue <= today
      }

      if (isDue) {
        newTransactions.push({
          user_id: user.id,
          type: r.type,
          amount: r.amount,
          category: r.category,
          description: `${r.description} (Auto)`,
          date: today.toISOString().split('T')[0],
        })
        updates.push({ id: r.id, last_generated: today.toISOString() })
      }
    })

    if (newTransactions.length > 0) {
      const { data, error } = await supabase
        .from('transactions')
        .insert(newTransactions)
        .select()

      if (!error && data) {
        set((state) => ({
          transactions: [...data, ...state.transactions],
        }))
      }
    }

    for (const update of updates) {
      await supabase
        .from('recurring_transactions')
        .update({ last_generated: update.last_generated })
        .eq('id', update.id)
    }

    set((state) => ({
      recurringTransactions: state.recurringTransactions.map((r) => {
        const update = updates.find((u) => u.id === r.id)
        return update ? { ...r, lastGenerated: update.last_generated, last_generated: update.last_generated } : r
      }),
    }))
  },

  // ─── Monthly limits ───────────────────────────────────────────────────────
  setMonthlyLimit: async (month, year, limit) => {
    const { user, monthlyLimits } = get()
    const existing = monthlyLimits.find((l) => l.month === month && l.year === year)

    if (existing) {
      await supabase
        .from('monthly_limits')
        .update({ limit_amount: limit })
        .eq('user_id', user.id)
        .eq('month', month)
        .eq('year', year)

      set((state) => ({
        monthlyLimits: state.monthlyLimits.map((l) =>
          l.month === month && l.year === year ? { ...l, limit } : l
        ),
      }))
    } else {
      await supabase
        .from('monthly_limits')
        .insert({ user_id: user.id, month, year, limit_amount: limit })

      set((state) => ({
        monthlyLimits: [...state.monthlyLimits, { month, year, limit }],
      }))
    }
  },

  // ─── Custom categories ────────────────────────────────────────────────────
  addCustomCategory: async (type, name) => {
    const { user, customCategories } = get()
    const already = customCategories[type].map((c) => c.toLowerCase())
    if (already.includes(name.toLowerCase())) return

    await supabase
      .from('custom_categories')
      .insert({ user_id: user.id, type, name })

    set((state) => ({
      customCategories: {
        ...state.customCategories,
        [type]: [...state.customCategories[type], name],
      },
    }))
  },

  deleteCustomCategory: async (type, name) => {
    const { user } = get()
    await supabase
      .from('custom_categories')
      .delete()
      .eq('user_id', user.id)
      .eq('type', type)
      .eq('name', name)

    set((state) => ({
      customCategories: {
        ...state.customCategories,
        [type]: state.customCategories[type].filter((c) => c !== name),
      },
    }))
  },

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

  // ─── Dashboard widgets ────────────────────────────────────────────────────
  toggleDashboardWidget: async (widget) => {
    const { user, dashboardWidgets } = get()
    const newWidgets = {
      ...dashboardWidgets,
      [widget]: !dashboardWidgets[widget],
    }

    const { error } = await supabase
      .from('dashboard_widgets')
      .upsert({
        user_id: user.id,
        spending_forecast: newWidgets.spendingForecast,
        recent_transactions: newWidgets.recentTransactions,
        health_score: newWidgets.healthScore,
        smart_insights: newWidgets.smartInsights,
        bill_reminders: newWidgets.billReminders,
      }, { onConflict: 'user_id' })

    if (error) { console.error(error); return }

    set({ dashboardWidgets: newWidgets })
  },

  // ─── Onboarding ───────────────────────────────────────────────────────────
  completeOnboarding: async (profileData) => {
    const { user } = get()
    await supabase
      .from('profiles')
      .update({ full_name: profileData.name, currency: profileData.currency })
      .eq('id', user.id)

    set((state) => ({
      hasCompletedOnboarding: true,
      user: { ...state.user, ...profileData },
    }))
  },

  // ─── Computed values ──────────────────────────────────────────────────────
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

}))

export default useBudgetStore