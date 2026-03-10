import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function YearOverYearChart() {
  const transactions = useBudgetStore((state) => state.transactions)
  const filterYear = useBudgetStore((state) => state.filterYear)

  const [compareType, setCompareType] = useState('expenses') // 'expenses' | 'income' | 'net'

  const previousYear = filterYear - 1

  // Build monthly data for both years
  const data = MONTHS.map((month, index) => {
    const getMonthTotal = (year, type) => {
      return transactions
        .filter((t) => {
          const date = new Date(t.date)
          return (
            date.getMonth() === index &&
            date.getFullYear() === year &&
            (type === 'net' ? true : t.type === type) &&
            t.category !== 'Savings'
          )
        })
        .reduce((sum, t) => {
          if (type === 'net') {
            return sum + (t.type === 'income' ? t.amount : -t.amount)
          }
          return sum + t.amount
        }, 0)
    }

    const currentExpenses = getMonthTotal(filterYear, 'expense')
    const previousExpenses = getMonthTotal(previousYear, 'expense')
    const currentIncome = getMonthTotal(filterYear, 'income')
    const previousIncome = getMonthTotal(previousYear, 'income')
    const currentNet = getMonthTotal(filterYear, 'net')
    const previousNet = getMonthTotal(previousYear, 'net')

    return {
      month,
      [`${filterYear}`]: compareType === 'expenses'
        ? currentExpenses
        : compareType === 'income'
        ? currentIncome
        : currentNet,
      [`${previousYear}`]: compareType === 'expenses'
        ? previousExpenses
        : compareType === 'income'
        ? previousIncome
        : previousNet,
    }
  })

  // Yearly totals for summary
  const currentYearTotal = data.reduce((sum, d) => sum + (d[`${filterYear}`] || 0), 0)
  const previousYearTotal = data.reduce((sum, d) => sum + (d[`${previousYear}`] || 0), 0)
  const difference = currentYearTotal - previousYearTotal
  const percentageChange = previousYearTotal > 0
    ? Math.round((difference / previousYearTotal) * 100)
    : 0

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const current = payload.find((p) => p.name === `${filterYear}`)?.value || 0
      const previous = payload.find((p) => p.name === `${previousYear}`)?.value || 0
      const diff = current - previous
      const isUp = diff > 0

      return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white text-sm font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-violet-400" />
                <span className="text-gray-400 text-xs">{filterYear}</span>
              </div>
              <span className="text-white text-xs font-medium">
                {formatCurrency(Math.abs(current))}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-500" />
                <span className="text-gray-400 text-xs">{previousYear}</span>
              </div>
              <span className="text-white text-xs font-medium">
                {formatCurrency(Math.abs(previous))}
              </span>
            </div>
            {(current > 0 || previous > 0) && (
              <div className="border-t border-gray-700 pt-1 mt-1 flex items-center justify-between gap-6">
                <span className="text-gray-500 text-xs">Difference</span>
                <span className={`text-xs font-semibold ${
                  compareType === 'net'
                    ? isUp ? 'text-emerald-400' : 'text-rose-400'
                    : compareType === 'expenses'
                    ? isUp ? 'text-rose-400' : 'text-emerald-400'
                    : isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {diff > 0 ? '+' : ''}{formatCurrency(diff)}
                </span>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Year over Year</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            {previousYear} vs {filterYear} comparison
          </p>
        </div>

        {/* Type toggle */}
        <div className="flex gap-1 bg-gray-900/60 rounded-xl p-1">
          {['expenses', 'income', 'net'].map((type) => (
            <button
              key={type}
              onClick={() => setCompareType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                compareType === type
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Summary comparison */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/40 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">{previousYear} total</p>
          <p className="text-gray-300 text-lg font-bold">
            {formatCurrency(Math.abs(previousYearTotal))}
          </p>
        </div>
        <div className="bg-gray-900/40 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">{filterYear} total</p>
          <p className="text-violet-400 text-lg font-bold">
            {formatCurrency(Math.abs(currentYearTotal))}
          </p>
        </div>
        <div className="bg-gray-900/40 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">Change</p>
          <p className={`text-lg font-bold ${
            compareType === 'expenses'
              ? difference > 0 ? 'text-rose-400' : 'text-emerald-400'
              : difference > 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {difference > 0 ? '+' : ''}{percentageChange}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={2} barSize={14}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2937"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `£${Math.abs(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
          <Bar
            dataKey={`${previousYear}`}
            fill="#4b5563"
            radius={[4, 4, 0, 0]}
            opacity={0.7}
          />
          <Bar
            dataKey={`${filterYear}`}
            fill="#a78bfa"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-gray-500 opacity-70" />
          <span className="text-gray-400 text-xs">{previousYear}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-violet-400" />
          <span className="text-gray-400 text-xs">{filterYear}</span>
        </div>
        <div className="ml-auto text-gray-600 text-xs italic">
          Toggle between Expenses, Income and Net above
        </div>
      </div>

    </div>
  )
}

export default YearOverYearChart