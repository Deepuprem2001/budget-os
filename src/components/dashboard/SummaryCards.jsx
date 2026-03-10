import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

function SummaryCards() {
  const filterMonth = useBudgetStore((state) => state.filterMonth)
  const filterYear = useBudgetStore((state) => state.filterYear)

  const getTotalIncome = useBudgetStore((state) => state.getTotalIncome)
  const getTotalExpenses = useBudgetStore((state) => state.getTotalExpenses)
  const getBalance = useBudgetStore((state) => state.getBalance)

  const income = getTotalIncome()
  const expenses = getTotalExpenses()
  const balance = getBalance()

  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0

  return (
    <div className="grid grid-cols-3 gap-6">

      {/* Total Income */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-900/10 border border-emerald-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <span className="text-emerald-400 text-sm font-medium">Total Income</span>
            </div>
            <span className="text-xs text-emerald-500/60 bg-emerald-500/10 px-2 py-1 rounded-full">
              This month
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(income)}
          </div>
          <p className="text-emerald-400/60 text-xs">
            Saving {savingsRate}% of income
          </p>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-rose-500/20 to-rose-900/10 border border-rose-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center">
                <TrendingDown size={16} className="text-rose-400" />
              </div>
              <span className="text-rose-400 text-sm font-medium">Total Expenses</span>
            </div>
            <span className="text-xs text-rose-500/60 bg-rose-500/10 px-2 py-1 rounded-full">
              This month
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(expenses)}
          </div>
          <p className="text-rose-400/60 text-xs">
            {income > 0 ? Math.round((expenses / income) * 100) : 0}% of total income
          </p>
        </div>
      </div>

      {/* Net Balance */}
      <div className={`relative overflow-hidden rounded-2xl p-6 border ${
        balance >= 0
          ? 'bg-gradient-to-br from-violet-500/20 to-violet-900/10 border-violet-500/20'
          : 'bg-gradient-to-br from-rose-500/20 to-rose-900/10 border-rose-500/20'
      }`}>
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 ${
          balance >= 0 ? 'bg-violet-500/10' : 'bg-rose-500/10'
        }`} />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                balance >= 0 ? 'bg-violet-500/20' : 'bg-rose-500/20'
              }`}>
                <Wallet size={16} className={balance >= 0 ? 'text-violet-400' : 'text-rose-400'} />
              </div>
              <span className={`text-sm font-medium ${balance >= 0 ? 'text-violet-400' : 'text-rose-400'}`}>
                Net Balance
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              balance >= 0
                ? 'text-violet-500/60 bg-violet-500/10'
                : 'text-rose-500/60 bg-rose-500/10'
            }`}>
              {balance >= 0 ? '✓ Healthy' : '⚠ Overspending'}
            </span>
          </div>
          <div className={`text-3xl font-bold mb-1 ${balance >= 0 ? 'text-white' : 'text-rose-400'}`}>
            {balance < 0 ? '-' : ''}{formatCurrency(Math.abs(balance))}
          </div>
          <p className={`text-xs ${balance >= 0 ? 'text-violet-400/60' : 'text-rose-400/60'}`}>
            {balance >= 0 ? 'You are on track this month' : 'Reduce expenses to balance'}
          </p>
        </div>
      </div>

    </div>
  )
}

export default SummaryCards