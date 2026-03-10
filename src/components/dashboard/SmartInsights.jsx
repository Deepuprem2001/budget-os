import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  CreditCard,
  Lightbulb,
  Sparkles,
} from 'lucide-react'

function SmartInsights() {
  const transactions = useBudgetStore((state) => state.transactions)
  const budgets = useBudgetStore((state) => state.budgets)
  const goals = useBudgetStore((state) => state.goals)
  const debts = useBudgetStore((state) => state.debts)
  const filterMonth = useBudgetStore((state) => state.filterMonth)
  const filterYear = useBudgetStore((state) => state.filterYear)

  const insights = []

  // Helper — get expense total for a category in a specific month/year
  const getCategorySpend = (category, month, year) =>
    transactions
      .filter((t) => {
        const d = new Date(t.date)
        return (
          t.type === 'expense' &&
          t.category !== 'Savings' &&
          (category ? t.category === category : true) &&
          d.getMonth() + 1 === month &&
          d.getFullYear() === year
        )
      })
      .reduce((sum, t) => sum + t.amount, 0)

  // Helper — get previous month and year
  const prevMonth = filterMonth === 1 ? 12 : filterMonth - 1
  const prevYear = filterMonth === 1 ? filterYear - 1 : filterYear

  // Helper — get all expense categories this month
  const thisMonthExpenses = transactions.filter((t) => {
    const d = new Date(t.date)
    return (
      t.type === 'expense' &&
      t.category !== 'Savings' &&
      d.getMonth() + 1 === filterMonth &&
      d.getFullYear() === filterYear
    )
  })

  const prevMonthExpenses = transactions.filter((t) => {
    const d = new Date(t.date)
    return (
      t.type === 'expense' &&
      t.category !== 'Savings' &&
      d.getMonth() + 1 === prevMonth &&
      d.getFullYear() === prevYear
    )
  })

  // Total income this month
  const thisMonthIncome = transactions
    .filter((t) => {
      const d = new Date(t.date)
      return (
        t.type === 'income' &&
        d.getMonth() + 1 === filterMonth &&
        d.getFullYear() === filterYear
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)

  // Total income last month
  const prevMonthIncome = transactions
    .filter((t) => {
      const d = new Date(t.date)
      return (
        t.type === 'income' &&
        d.getMonth() + 1 === prevMonth &&
        d.getFullYear() === prevYear
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const totalThisMonth = thisMonthExpenses.reduce((sum, t) => sum + t.amount, 0)
  const totalPrevMonth = prevMonthExpenses.reduce((sum, t) => sum + t.amount, 0)

  // Get unique categories
  const categories = [...new Set(thisMonthExpenses.map((t) => t.category))]

  // ── INSIGHT 1: Overspending alerts (over budget 2+ months) ──
  budgets
    .filter((b) => b.month === filterMonth && b.year === filterYear)
    .forEach((budget) => {
      const thisMonthSpend = getCategorySpend(budget.category, filterMonth, filterYear)
      const prevMonthSpend = getCategorySpend(budget.category, prevMonth, prevYear)
      const prevBudget = budgets.find(
        (b) => b.category === budget.category &&
          b.month === prevMonth && b.year === prevYear
      )
      if (
        thisMonthSpend > budget.amount &&
        prevBudget && prevMonthSpend > prevBudget.amount
      ) {
        insights.push({
          type: 'warning',
          icon: AlertTriangle,
          color: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          title: `${budget.category} over budget again`,
          message: `You've exceeded your ${budget.category} budget 2 months in a row. Consider raising your limit or cutting back.`,
        })
      }
    })

  // ── INSIGHT 2: Spending spike (category up 40%+ vs last month) ──
  categories.forEach((category) => {
    const thisSpend = getCategorySpend(category, filterMonth, filterYear)
    const prevSpend = getCategorySpend(category, prevMonth, prevYear)
    if (prevSpend > 0) {
      const increase = ((thisSpend - prevSpend) / prevSpend) * 100
      if (increase >= 40) {
        insights.push({
          type: 'warning',
          icon: TrendingUp,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          title: `${category} spending spiked`,
          message: `Your ${category} spending is up ${Math.round(increase)}% vs last month (${formatCurrency(prevSpend)} → ${formatCurrency(thisSpend)}).`,
        })
      }
    }
  })

  // ── INSIGHT 3: Savings opportunity ──
  const biggestCategory = categories
    .map((cat) => ({
      category: cat,
      amount: getCategorySpend(cat, filterMonth, filterYear),
    }))
    .filter((c) => !['Housing', 'Utilities', 'Healthcare', 'Education'].includes(c.category))
    .sort((a, b) => b.amount - a.amount)[0]

  if (biggestCategory && biggestCategory.amount > 50) {
    const saving = Math.round(biggestCategory.amount * 0.2)
    insights.push({
      type: 'tip',
      icon: Lightbulb,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      title: `Save on ${biggestCategory.category}`,
      message: `Cutting your ${biggestCategory.category} spending by 20% would save you ${formatCurrency(saving)} this month.`,
    })
  }

  // ── INSIGHT 4: Goal progress nudge ──
  goals
    .filter((g) => !g.completed)
    .forEach((goal) => {
      const today = new Date()
      const targetDate = new Date(goal.targetDate)
      const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))
      const remaining = goal.targetAmount - goal.currentAmount
      const monthsRemaining = daysRemaining / 30
      const monthlyNeeded = remaining / monthsRemaining
      const currentMonthlySavings = thisMonthIncome - totalThisMonth

      if (monthlyNeeded > currentMonthlySavings && daysRemaining > 0) {
        insights.push({
          type: 'goal',
          icon: Target,
          color: 'text-violet-400',
          bg: 'bg-violet-500/10',
          border: 'border-violet-500/20',
          title: `${goal.name} goal at risk`,
          message: `You need to save ${formatCurrency(Math.round(monthlyNeeded))}/month for "${goal.name}" but you're currently saving ${formatCurrency(Math.round(currentMonthlySavings))}/month.`,
        })
      }
    })

  // ── INSIGHT 5: Debt interest warning ──
  const highInterestDebt = debts
    .filter((d) => d.remainingAmount > 0 && d.interestRate > 15)
    .sort((a, b) => b.interestRate - a.interestRate)[0]

  if (highInterestDebt) {
    const monthlyInterest = Math.round(
      (highInterestDebt.remainingAmount * (highInterestDebt.interestRate / 100)) / 12
    )
    insights.push({
      type: 'debt',
      icon: CreditCard,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      title: `High interest debt costing you`,
      message: `Your ${highInterestDebt.name} at ${highInterestDebt.interestRate}% is costing ${formatCurrency(monthlyInterest)}/month in interest alone.`,
    })
  }

  // ── INSIGHT 6: Positive — under budget categories ──
  const underBudgetCategories = budgets
    .filter((b) => b.month === filterMonth && b.year === filterYear)
    .filter((b) => getCategorySpend(b.category, filterMonth, filterYear) < b.amount * 0.8)

  if (underBudgetCategories.length >= 2) {
    insights.push({
      type: 'win',
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      title: `Great budgeting this month!`,
      message: `You're well under budget in ${underBudgetCategories.length} categories: ${underBudgetCategories.map((b) => b.category).join(', ')}.`,
    })
  }

  // ── INSIGHT 7: Savings rate celebration ──
  const savingsRate = thisMonthIncome > 0
    ? ((thisMonthIncome - totalThisMonth) / thisMonthIncome) * 100
    : 0

  if (savingsRate >= 20) {
    insights.push({
      type: 'win',
      icon: Sparkles,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      title: `Excellent savings rate!`,
      message: `You're saving ${Math.round(savingsRate)}% of your income this month. Financial experts recommend at least 20% — you're nailing it! 🎉`,
    })
  }

  // ── INSIGHT 8: Biggest expense vs last month ──
  const biggestThisMonth = thisMonthExpenses
    .filter((t) => t.category !== 'Savings')
    .sort((a, b) => b.amount - a.amount)[0]

  const biggestLastMonth = prevMonthExpenses
    .filter((t) => t.category !== 'Savings')
    .sort((a, b) => b.amount - a.amount)[0]

  if (biggestThisMonth && biggestLastMonth) {
    const diff = biggestThisMonth.amount - biggestLastMonth.amount
    if (Math.abs(diff) > 50) {
      insights.push({
        type: 'insight',
        icon: diff > 0 ? TrendingUp : TrendingDown,
        color: diff > 0 ? 'text-amber-400' : 'text-emerald-400',
        bg: diff > 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10',
        border: diff > 0 ? 'border-amber-500/20' : 'border-emerald-500/20',
        title: `Biggest expense ${diff > 0 ? 'increased' : 'decreased'}`,
        message: `Your biggest single expense this month is "${biggestThisMonth.description}" at ${formatCurrency(biggestThisMonth.amount)}, ${diff > 0 ? 'up' : 'down'} ${formatCurrency(Math.abs(diff))} vs last month.`,
      })
    }
  }

  // ── INSIGHT 9: Most improved category ──
  const mostImproved = categories
    .map((cat) => {
      const thisSpend = getCategorySpend(cat, filterMonth, filterYear)
      const prevSpend = getCategorySpend(cat, prevMonth, prevYear)
      if (prevSpend > 0 && thisSpend < prevSpend) {
        return { category: cat, saving: prevSpend - thisSpend, percent: Math.round(((prevSpend - thisSpend) / prevSpend) * 100) }
      }
      return null
    })
    .filter(Boolean)
    .sort((a, b) => b.saving - a.saving)[0]

  if (mostImproved && mostImproved.saving > 20) {
    insights.push({
      type: 'win',
      icon: TrendingDown,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      title: `Most improved: ${mostImproved.category}`,
      message: `You spent ${formatCurrency(mostImproved.saving)} less on ${mostImproved.category} this month — a ${mostImproved.percent}% improvement vs last month! 💪`,
    })
  }

  // ── INSIGHT 10: Projected savings by end of year ──
  const currentMonth = filterMonth
  const monthsLeft = 12 - currentMonth
  const avgMonthlySavings = thisMonthIncome - totalThisMonth
  const yearToDateSavings = transactions
    .filter((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === filterYear
    })
    .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : t.category !== 'Savings' ? -t.amount : 0), 0)

  if (avgMonthlySavings > 0 && monthsLeft > 0) {
    const projectedYearEnd = yearToDateSavings + (avgMonthlySavings * monthsLeft)
    insights.push({
      type: 'forecast',
      icon: Sparkles,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      title: `Projected year-end savings`,
      message: `At your current pace you'll save ${formatCurrency(Math.round(projectedYearEnd))} by end of ${filterYear}.`,
    })
  }

  // ── INSIGHT 11: Category closest to budget limit ──
  const closestToLimit = budgets
    .filter((b) => b.month === filterMonth && b.year === filterYear)
    .map((b) => {
      const spent = getCategorySpend(b.category, filterMonth, filterYear)
      const percentage = (spent / b.amount) * 100
      return { ...b, spent, percentage }
    })
    .filter((b) => b.percentage >= 70 && b.percentage < 100)
    .sort((a, b) => b.percentage - a.percentage)[0]

  if (closestToLimit) {
    insights.push({
      type: 'alert',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      title: `${closestToLimit.category} almost at limit`,
      message: `You've used ${Math.round(closestToLimit.percentage)}% of your ${closestToLimit.category} budget. Only ${formatCurrency(closestToLimit.amount - closestToLimit.spent)} remaining.`,
    })
  }

  // ── INSIGHT 12: Income drop warning ──
  if (prevMonthIncome > 0 && thisMonthIncome < prevMonthIncome * 0.8) {
    const drop = prevMonthIncome - thisMonthIncome
    insights.push({
      type: 'warning',
      icon: TrendingDown,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      title: `Income dropped this month`,
      message: `Your income is ${formatCurrency(drop)} lower than last month (${formatCurrency(prevMonthIncome)} → ${formatCurrency(thisMonthIncome)}). Keep an eye on your spending.`,
    })
  }

  // ── No insights fallback ──
  if (insights.length === 0) {
    insights.push({
      type: 'win',
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      title: 'Everything looks great!',
      message: 'No issues detected this month. Keep up the good work! 🎉',
    })
  }

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={18} className="text-violet-400" />
        <div>
          <h2 className="text-white font-semibold text-lg">Smart Insights</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            Personalised tips based on your data
          </p>
        </div>
        <span className="ml-auto bg-violet-500/20 text-violet-400 text-xs font-medium px-2.5 py-1 rounded-full border border-violet-500/30">
          {insights.length} insights
        </span>
      </div>

      {/* Insights list */}
      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div
              key={index}
              className={`flex gap-3 p-4 rounded-xl border ${insight.bg} ${insight.border}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${insight.bg}`}>
                <Icon size={16} className={insight.color} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${insight.color}`}>
                  {insight.title}
                </p>
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default SmartInsights