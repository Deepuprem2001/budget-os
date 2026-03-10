import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'

function MonthlyBarChart() {
  const transactions = useBudgetStore((state) => state.transactions)
  const filterYear = useBudgetStore((state) => state.filterYear)

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Build data for each month
  const data = MONTHS.map((month, index) => {
    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date)
      return (
        date.getMonth() === index &&
        date.getFullYear() === filterYear
      )
    })

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return { month, income, expenses }
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white text-sm font-semibold mb-2">{label}</p>
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-400 capitalize">{entry.name}:</span>
              <span className="text-white font-medium">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-white font-semibold text-lg">Income vs Expenses</h2>
        <p className="text-gray-500 text-xs mt-0.5">Monthly comparison for {filterYear}</p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={4} barSize={16}>
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
            tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
          <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} name="income" />
          <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="expenses" />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-400" />
          <span className="text-gray-400 text-xs">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-rose-500" />
          <span className="text-gray-400 text-xs">Expenses</span>
        </div>
      </div>
    </div>
  )
}

export default MonthlyBarChart