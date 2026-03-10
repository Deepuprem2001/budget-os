import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react'

function YearlySummary() {
  const transactions = useBudgetStore((state) => state.transactions)
  const filterYear = useBudgetStore((state) => state.filterYear)

  // Calculate yearly totals
  const yearlyTransactions = transactions.filter((t) => {
    return new Date(t.date).getFullYear() === filterYear
  })

  const totalIncome = yearlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = yearlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netSavings = totalIncome - totalExpenses

  const avgMonthlyExpense = totalExpenses / 12

  const savingsRate = totalIncome > 0
    ? Math.round((netSavings / totalIncome) * 100)
    : 0

  const stats = [
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'text-rose-400',
      bg: 'bg-rose-400/10',
      border: 'border-rose-400/20',
    },
    {
      label: 'Net Savings',
      value: formatCurrency(Math.abs(netSavings)),
      icon: PiggyBank,
      color: netSavings >= 0 ? 'text-violet-400' : 'text-rose-400',
      bg: netSavings >= 0 ? 'bg-violet-400/10' : 'bg-rose-400/10',
      border: netSavings >= 0 ? 'border-violet-400/20' : 'border-rose-400/20',
      subtitle: netSavings < 0 ? 'Deficit' : `${savingsRate}% savings rate`,
    },
    {
      label: 'Avg Monthly Spend',
      value: formatCurrency(avgMonthlyExpense),
      icon: Wallet,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
    },
  ]

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-white font-semibold text-lg">Yearly Summary</h2>
        <p className="text-gray-500 text-xs mt-0.5">
          Your full financial picture for {filterYear}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, border, subtitle }) => (
          <div
            key={label}
            className={`${bg} border ${border} rounded-2xl p-4`}
          >
            <div className={`w-8 h-8 ${bg} border ${border} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            {subtitle && (
              <p className="text-gray-600 text-xs mt-1">{subtitle}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default YearlySummary