import { useState } from 'react'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'
import { TrendingUp, TrendingDown, Minus, Settings } from 'lucide-react'

// Categories that are typically fixed monthly costs
const FIXED_CATEGORIES = [
  'Housing',
  'Utilities',
  'Healthcare',
  'Education',
  'Savings',
  'Insurance',
]

function SpendingForecast() {
  const getFilteredTransactions = useBudgetStore(
    (state) => state.getFilteredTransactions
  )
  const budgets = useBudgetStore((state) => state.budgets)
  const monthlyLimits = useBudgetStore((state) => state.monthlyLimits)
  const setMonthlyLimit = useBudgetStore((state) => state.setMonthlyLimit)
  const filterMonth = useBudgetStore((state) => state.filterMonth)
  const filterYear = useBudgetStore((state) => state.filterYear)

  const [showLimitInput, setShowLimitInput] = useState(false)
  const [limitInput, setLimitInput] = useState('')

  const transactions = getFilteredTransactions()

  // Get custom monthly limit for this month
  const monthlyLimitObj = monthlyLimits.find(
    (l) => l.month === filterMonth && l.year === filterYear
  )
  const customLimit = monthlyLimitObj?.limit || 0

  // Fall back to total budgets if no custom limit set
  const totalBudget = customLimit || budgets
    .filter((b) => b.month === filterMonth && b.year === filterYear)
    .reduce((sum, b) => sum + b.amount, 0)

  // Date info
  const today = new Date()
  const currentDay = today.getDate()
  const daysInMonth = new Date(filterYear, filterMonth, 0).getDate()
  const daysRemaining = daysInMonth - currentDay
  const monthProgress = (currentDay / daysInMonth) * 100

  // Split transactions into fixed and variable
const expenseTransactions = transactions.filter(
  (t) => t.type === 'expense' && t.category !== 'Savings'
)
  const fixedExpenses = expenseTransactions
    .filter((t) => FIXED_CATEGORIES.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0)

  const variableExpenses = expenseTransactions
    .filter((t) => !FIXED_CATEGORIES.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = fixedExpenses + variableExpenses

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  // Daily rate uses ONLY variable spending
  const dailyRate = currentDay > 0 ? variableExpenses / currentDay : 0

  // Forecast = fixed costs (already paid) + projected variable spending
  const forecastedSpend = fixedExpenses + dailyRate * daysInMonth
  const forecastedRemaining = forecastedSpend - totalExpenses

  const forecastVsBudget = totalBudget > 0 ? forecastedSpend - totalBudget : null
  const isOverForecast = forecastVsBudget > 0

  const handleSetLimit = () => {
    const value = parseFloat(limitInput)
    if (value > 0) {
      setMonthlyLimit(filterMonth, filterYear, value)
      setLimitInput('')
      setShowLimitInput(false)
    }
  }

  const getForecastStatus = () => {
    if (totalBudget === 0) {
      if (forecastedSpend > totalIncome) {
        return {
          label: 'Overspending likely',
          color: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          icon: TrendingUp,
        }
      }
      return {
        label: 'On track',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        icon: TrendingDown,
      }
    }
    if (isOverForecast) {
      return {
        label: 'Over budget likely',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        icon: TrendingUp,
      }
    }
    if (forecastVsBudget > -totalBudget * 0.1) {
      return {
        label: 'Close to limit',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        icon: Minus,
      }
    }
    return {
      label: 'Well within limit',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: TrendingDown,
    }
  }

  const status = getForecastStatus()
  const StatusIcon = status.icon

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Spending Forecast</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            Based on your variable spending pace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.bg} ${status.border}`}>
            <StatusIcon size={12} className={status.color} />
            <span className={`text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
          <button
            onClick={() => setShowLimitInput(!showLimitInput)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
            title="Set monthly spending limit"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Custom limit input */}
      {showLimitInput && (
        <div className="flex gap-2 mb-5 p-3 bg-gray-900/40 rounded-xl border border-gray-700/60">
          <div className="flex-1">
            <p className="text-gray-400 text-xs mb-1.5">
              Set monthly spending limit for this month
            </p>
            <input
              type="number"
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
              placeholder={customLimit > 0 ? `Current: £${customLimit}` : 'e.g. 2000'}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleSetLimit()}
            />
          </div>
          <button
            onClick={handleSetLimit}
            className="self-end bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Set
          </button>
        </div>
      )}

      {/* Month progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Day {currentDay} of {daysInMonth}</span>
          <span>{daysRemaining} days remaining</span>
        </div>
        <div className="h-1.5 bg-gray-700/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all"
            style={{ width: `${monthProgress}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-900/40 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">Spent so far</p>
          <p className="text-white text-lg font-bold">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            {formatCurrency(Math.round(dailyRate))}/day variable avg
          </p>
        </div>
        <div className="bg-gray-900/40 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">Forecasted total</p>
          <p className={`text-lg font-bold ${
            isOverForecast ? 'text-rose-400' : 'text-white'
          }`}>
            {formatCurrency(Math.round(forecastedSpend))}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            ~{formatCurrency(Math.round(forecastedRemaining))} more likely
          </p>
        </div>
      </div>

      {/* Fixed vs variable breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center justify-between bg-gray-900/30 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-gray-500 text-xs">Fixed costs</span>
          </div>
          <span className="text-gray-400 text-xs font-medium">
            {formatCurrency(fixedExpenses)}
          </span>
        </div>
        <div className="flex items-center justify-between bg-gray-900/30 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <span className="text-gray-500 text-xs">Variable costs</span>
          </div>
          <span className="text-gray-400 text-xs font-medium">
            {formatCurrency(variableExpenses)}
          </span>
        </div>
      </div>

      {/* Budget comparison */}
      {totalBudget > 0 && (
        <div className={`rounded-xl p-4 border ${
          isOverForecast
            ? 'bg-rose-500/10 border-rose-500/20'
            : 'bg-emerald-500/10 border-emerald-500/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${
                isOverForecast ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {isOverForecast
                  ? `£${Math.round(forecastVsBudget)} over limit by month end`
                  : `£${Math.round(Math.abs(forecastVsBudget))} under limit by month end`}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                {customLimit > 0 ? 'Custom' : 'Budget'} limit: {formatCurrency(totalBudget)}
              </p>
            </div>
            <div className="text-2xl">
              {isOverForecast ? '⚠️' : '✅'}
            </div>
          </div>
        </div>
      )}

      {/* No limit set prompt */}
      {totalBudget === 0 && (
        <button
          onClick={() => setShowLimitInput(true)}
          className="w-full py-3 rounded-xl border border-dashed border-gray-700 text-gray-500 text-sm hover:border-violet-500/50 hover:text-violet-400 transition-colors"
        >
          + Set a monthly spending limit for better insights
        </button>
      )}

    </div>
  )
}

export default SpendingForecast