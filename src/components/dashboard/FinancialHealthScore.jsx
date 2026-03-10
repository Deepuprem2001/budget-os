import { useState } from 'react'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency, getPercentage } from '../../lib/utils'
import { Trophy, TrendingUp, Shield, Target, Activity, Info, X } from 'lucide-react'

function FinancialHealthScore() {
  const [showInfo, setShowInfo] = useState(false)
  const transactions = useBudgetStore((state) => state.transactions)
  const budgets = useBudgetStore((state) => state.budgets)
  const goals = useBudgetStore((state) => state.goals)
  const debts = useBudgetStore((state) => state.debts)
  const filterMonth = useBudgetStore((state) => state.filterMonth)
  const filterYear = useBudgetStore((state) => state.filterYear)

  const getMonthTransactions = (month, year) =>
    transactions.filter((t) => {
      const date = new Date(t.date)
      return date.getMonth() + 1 === month && date.getFullYear() === year
    })

  const prevMonth = filterMonth === 1 ? 12 : filterMonth - 1
  const prevYear = filterMonth === 1 ? filterYear - 1 : filterYear

  const currentTxns = getMonthTransactions(filterMonth, filterYear)
  const prevTxns = getMonthTransactions(prevMonth, prevYear)

  const currentBudgets = budgets.filter(
    (b) => b.month === filterMonth && b.year === filterYear
  )

  const totalIncome = currentTxns
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = currentTxns
    .filter((t) => t.type === 'expense' && t.category !== 'Savings')
    .reduce((sum, t) => sum + t.amount, 0)

  const netSavings = totalIncome - totalExpenses

  // ─── FACTOR 1: Savings Rate (25 pts) ─────────────────────────
  const savingsRate = totalIncome > 0
    ? (netSavings / totalIncome) * 100
    : 0

  let savingsScore = 0
  if (savingsRate >= 20) savingsScore = 25
  else if (savingsRate >= 15) savingsScore = 20
  else if (savingsRate >= 10) savingsScore = 15
  else if (savingsRate >= 5) savingsScore = 10
  else if (savingsRate > 0) savingsScore = 5

  // ─── FACTOR 2: Budget Adherence (25 pts) ─────────────────────
  let budgetScore = 0
  if (currentBudgets.length === 0) {
    budgetScore = 12 // neutral if no budgets set
  } else {
    const categorySpend = (category) =>
      currentTxns
        .filter((t) => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0)

    const underBudget = currentBudgets.filter(
      (b) => categorySpend(b.category) <= b.amount
    ).length

    budgetScore = Math.round((underBudget / currentBudgets.length) * 25)
  }

  // ─── FACTOR 3: Debt to Income Ratio (20 pts) ─────────────────
  const totalDebt = debts.reduce((sum, d) => sum + d.remainingAmount, 0)
  const monthlyDebtPayments = debts.reduce((sum, d) => sum + d.minimumPayment, 0)

  let debtScore = 20 // full points if no debt
  if (totalIncome > 0 && monthlyDebtPayments > 0) {
    const debtToIncomeRatio = (monthlyDebtPayments / totalIncome) * 100
    if (debtToIncomeRatio <= 10) debtScore = 20
    else if (debtToIncomeRatio <= 20) debtScore = 15
    else if (debtToIncomeRatio <= 30) debtScore = 10
    else if (debtToIncomeRatio <= 40) debtScore = 5
    else debtScore = 0
  }

  // ─── FACTOR 4: Goal Progress (15 pts) ────────────────────────
  const activeGoals = goals.filter((g) => !g.completed)
  let goalScore = 0

  if (activeGoals.length === 0) {
    goalScore = 8 // neutral if no goals
  } else {
    const avgProgress = activeGoals.reduce(
      (sum, g) => sum + getPercentage(g.currentAmount, g.targetAmount), 0
    ) / activeGoals.length

    if (avgProgress >= 75) goalScore = 15
    else if (avgProgress >= 50) goalScore = 12
    else if (avgProgress >= 25) goalScore = 8
    else goalScore = 4
  }

  // ─── FACTOR 5: Spending Consistency (15 pts) ─────────────────
  let consistencyScore = 15 // full points if no previous data

  if (prevTxns.length > 0) {
    const prevExpenses = prevTxns
      .filter((t) => t.type === 'expense' && t.category !== 'Savings')
      .reduce((sum, t) => sum + t.amount, 0)

    if (prevExpenses > 0) {
      const change = Math.abs((totalExpenses - prevExpenses) / prevExpenses) * 100
      if (change <= 10) consistencyScore = 15
      else if (change <= 20) consistencyScore = 12
      else if (change <= 35) consistencyScore = 8
      else if (change <= 50) consistencyScore = 4
      else consistencyScore = 0
    }
  }

  // ─── TOTAL SCORE ──────────────────────────────────────────────
  const totalScore = savingsScore + budgetScore + debtScore + goalScore + consistencyScore

  const getScoreBand = () => {
    if (totalScore >= 90) return { label: 'Excellent', color: '#34d399', emoji: '🏆', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
    if (totalScore >= 70) return { label: 'Good', color: '#a78bfa', emoji: '👍', bg: 'bg-violet-500/10', border: 'border-violet-500/20' }
    if (totalScore >= 50) return { label: 'Fair', color: '#f59e0b', emoji: '📈', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
    if (totalScore >= 30) return { label: 'Needs Work', color: '#f97316', emoji: '⚠️', bg: 'bg-orange-500/10', border: 'border-orange-500/20' }
    return { label: 'Critical', color: '#f43f5e', emoji: '🚨', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
  }

  const band = getScoreBand()

  const factors = [
    {
      label: 'Savings Rate',
      score: savingsScore,
      max: 25,
      icon: TrendingUp,
      detail: savingsRate > 0
        ? `${Math.round(savingsRate)}% of income saved`
        : 'No savings this month',
    },
    {
      label: 'Budget Adherence',
      score: budgetScore,
      max: 25,
      icon: Shield,
      detail: currentBudgets.length === 0
        ? 'No budgets set'
        : `${currentBudgets.filter((b) => {
            const spent = currentTxns
              .filter((t) => t.type === 'expense' && t.category === b.category)
              .reduce((sum, t) => sum + t.amount, 0)
            return spent <= b.amount
          }).length} of ${currentBudgets.length} categories on track`,
    },
    {
      label: 'Debt Management',
      score: debtScore,
      max: 20,
      icon: Trophy,
      detail: totalDebt === 0
        ? 'Debt free! 🎉'
        : `${formatCurrency(Math.round(monthlyDebtPayments))}/month in payments`,
    },
    {
      label: 'Goal Progress',
      score: goalScore,
      max: 15,
      icon: Target,
      detail: activeGoals.length === 0
        ? 'No active goals'
        : `${activeGoals.length} active ${activeGoals.length === 1 ? 'goal' : 'goals'}`,
    },
    {
      label: 'Spending Consistency',
      score: consistencyScore,
      max: 15,
      icon: Activity,
      detail: prevTxns.length === 0
        ? 'Not enough history'
        : consistencyScore >= 12
        ? 'Stable spending pattern'
        : 'Spending varies significantly',
    },
  ]

  // Circumference for the circular progress
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (totalScore / 100) * circumference

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">

      {/* Header */}
      {/* Header */}
<div className="flex items-center justify-between mb-6">
  <div>
    <h2 className="text-white font-semibold text-lg">Financial Health Score</h2>
    <p className="text-gray-500 text-xs mt-0.5">
      Based on your financial habits this month
    </p>
  </div>
  <button
    onClick={() => setShowInfo(!showInfo)}
    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
    title="How is this calculated?"
  >
    {showInfo ? <X size={16} /> : <Info size={16} />}
  </button>
</div>

{/* Info panel */}
{showInfo && (
  <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-4 mb-6 space-y-4">
    <p className="text-white text-xs font-semibold uppercase tracking-wider">
      How your score is calculated
    </p>

    <div className="space-y-3">

      <div className="flex gap-3">
        <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <TrendingUp size={13} className="text-violet-400" />
        </div>
        <div>
          <p className="text-gray-300 text-xs font-semibold mb-0.5">
            Savings Rate — 25 pts
          </p>
          <p className="text-gray-500 text-xs leading-relaxed">
            What % of your income you save each month.
            20%+ = full 25pts. 15% = 20pts. 10% = 15pts. 5% = 10pts. 1-4% = 5pts.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield size={13} className="text-violet-400" />
        </div>
        <div>
          <p className="text-gray-300 text-xs font-semibold mb-0.5">
            Budget Adherence — 25 pts
          </p>
          <p className="text-gray-500 text-xs leading-relaxed">
            How many expense categories you stay within budget.
            All categories under = full 25pts. Scored proportionally.
            If no budgets set, a neutral 12pts is given.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Trophy size={13} className="text-violet-400" />
        </div>
        <div>
          <p className="text-gray-300 text-xs font-semibold mb-0.5">
            Debt Management — 20 pts
          </p>
          <p className="text-gray-500 text-xs leading-relaxed">
            Based on your debt-to-income ratio (monthly payments ÷ income).
            No debt = full 20pts. Under 10% = 20pts. 10-20% = 15pts.
            20-30% = 10pts. 30-40% = 5pts. Over 40% = 0pts.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Target size={13} className="text-violet-400" />
        </div>
        <div>
          <p className="text-gray-300 text-xs font-semibold mb-0.5">
            Goal Progress — 15 pts
          </p>
          <p className="text-gray-500 text-xs leading-relaxed">
            Average progress across all your active financial goals.
            75%+ avg progress = full 15pts. 50% = 12pts.
            25% = 8pts. Under 25% = 4pts.
            No goals set gives a neutral 8pts.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Activity size={13} className="text-violet-400" />
        </div>
        <div>
          <p className="text-gray-300 text-xs font-semibold mb-0.5">
            Spending Consistency — 15 pts
          </p>
          <p className="text-gray-500 text-xs leading-relaxed">
            How stable your spending is vs last month.
            Under 10% change = full 15pts. 10-20% = 12pts.
            20-35% = 8pts. 35-50% = 4pts. Over 50% change = 0pts.
          </p>
        </div>
      </div>

    </div>

    {/* Score bands */}
    <div className="border-t border-gray-700/60 pt-3">
      <p className="text-gray-500 text-xs font-medium mb-2">Score bands</p>
      <div className="grid grid-cols-5 gap-1.5">
        {[
          { range: '90-100', label: 'Excellent', color: '#34d399' },
          { range: '70-89', label: 'Good', color: '#a78bfa' },
          { range: '50-69', label: 'Fair', color: '#f59e0b' },
          { range: '30-49', label: 'Needs Work', color: '#f97316' },
          { range: '0-29', label: 'Critical', color: '#f43f5e' },
        ].map((band) => (
          <div
            key={band.range}
            className="text-center p-2 rounded-lg"
            style={{ backgroundColor: band.color + '15', border: `1px solid ${band.color}30` }}
          >
            <p className="text-xs font-bold" style={{ color: band.color }}>
              {band.range}
            </p>
            <p className="text-xs mt-0.5" style={{ color: band.color + 'aa' }}>
              {band.label}
            </p>
          </div>
        ))}
      </div>
    </div>

  </div>
)}

      {/* Score display */}
      <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">

        {/* Circular progress */}
        <div className="relative flex-shrink-0">
          <svg width="140" height="140" className="-rotate-90">
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#1f2937"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={band.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          {/* Score text in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{totalScore}</span>
            <span className="text-gray-500 text-xs">out of 100</span>
          </div>
        </div>

        {/* Score band info */}
        <div className="flex-1">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border mb-3 ${band.bg} ${band.border}`}>
            <span className="text-lg">{band.emoji}</span>
            <span className="font-bold text-lg" style={{ color: band.color }}>
              {band.label}
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {totalScore >= 90
              ? 'Outstanding financial management! You\'re saving well, managing debt effectively and hitting your goals.'
              : totalScore >= 70
              ? 'Good financial habits overall. A few areas to improve but you\'re on the right track.'
              : totalScore >= 50
              ? 'Room for improvement. Focus on building your savings rate and sticking to budgets.'
              : totalScore >= 30
              ? 'Your finances need attention. Consider reviewing your spending and setting budgets.'
              : 'Take action now. Review your spending urgently and look for ways to cut costs.'}
          </p>
        </div>
      </div>

      {/* Factor breakdown */}
      <div className="space-y-3">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-4">
          Score Breakdown
        </p>
        {factors.map(({ label, score, max, icon: Icon, detail }) => (
          <div key={label} className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-700/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon size={14} className="text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-xs font-medium">{label}</span>
                <span className="text-white text-xs font-bold">
                  {score}/{max}
                </span>
              </div>
              <div className="h-1.5 bg-gray-700/60 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(score / max) * 100}%`,
                    backgroundColor: score / max >= 0.8
                      ? '#34d399'
                      : score / max >= 0.5
                      ? '#f59e0b'
                      : '#f43f5e',
                  }}
                />
              </div>
              <p className="text-gray-600 text-xs mt-0.5">{detail}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default FinancialHealthScore