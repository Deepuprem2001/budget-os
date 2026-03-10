import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import useBudgetStore from '../../store/useBudgetStore'
import { CATEGORY_COLORS } from '../../types/index'
import { formatCurrency } from '../../lib/utils'

function ExpensePieChart() {
  const filterMonth = useBudgetStore((state) => state.filterMonth)
  const filterYear = useBudgetStore((state) => state.filterYear)

  const getFilteredTransactions = useBudgetStore(
    (state) => state.getFilteredTransactions
  )

  const transactions = getFilteredTransactions()

  // Build pie data from expenses
  const data = transactions
    .filter((t) => t.type === 'expense' && t.category !== 'Savings')
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.category)
      if (existing) {
        existing.value += t.amount
      } else {
        acc.push({ name: t.category, value: t.amount })
      }
      return acc
    }, [])
    .sort((a, b) => b.value - a.value)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white text-sm font-semibold">{name}</p>
          <p className="text-gray-400 text-sm">{formatCurrency(value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-white font-semibold text-lg">Expenses by Category</h2>
        <p className="text-gray-500 text-xs mt-0.5">Breakdown of spending this month</p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-400 text-sm">No expense data this month</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] || '#6b7280'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[entry.name] || '#6b7280' }}
                />
                <span className="text-gray-400 text-xs truncate">{entry.name}</span>
                <span className="text-gray-500 text-xs ml-auto">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ExpensePieChart