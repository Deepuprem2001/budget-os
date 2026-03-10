import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'
import { CATEGORY_COLORS, CATEGORIES } from '../../types/index'

function BudgetActualChart() {
  const budgets = useBudgetStore((state) => state.budgets)
const getFilteredTransactions = useBudgetStore(
  (state) => state.getFilteredTransactions
)
const filterMonth = useBudgetStore((state) => state.filterMonth)
const filterYear = useBudgetStore((state) => state.filterYear)

const transactions = getFilteredTransactions()

// Build data for ALL expense categories
const data = CATEGORIES.expense.map((category) => {
  const budget = budgets.find(
    (b) =>
      b.category === category &&
      b.month === filterMonth &&
      b.year === filterYear
  )

  const actual = transactions
    .filter((t) => t.type === 'expense' && t.category === category)
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    category,
    Budget: budget ? budget.amount : 0,
    Actual: actual,
    over: budget ? actual > budget.amount : false,
  }
})
.filter((d) => d.Budget > 0 || d.Actual > 0) // hide completely empty categories
.sort((a, b) => b.Budget - a.Budget)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const budget = payload.find((p) => p.name === 'Budget')?.value || 0
      const actual = payload.find((p) => p.name === 'Actual')?.value || 0
      const diff = budget - actual
      const isOver = actual > budget

      return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white text-sm font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-6">
              <span className="text-gray-400 text-xs">Budget</span>
              <span className="text-violet-400 text-xs font-medium">
                {formatCurrency(budget)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-gray-400 text-xs">Actual</span>
              <span className={`text-xs font-medium ${
                isOver ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {formatCurrency(actual)}
              </span>
            </div>
            <div className="border-t border-gray-700 pt-1 mt-1 flex items-center justify-between gap-6">
              <span className="text-gray-400 text-xs">
                {isOver ? 'Over by' : 'Under by'}
              </span>
              <span className={`text-xs font-semibold ${
                isOver ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {formatCurrency(Math.abs(diff))}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const CustomBar = (props) => {
    const { x, y, width, height, over } = props
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        ry={4}
        fill={over ? '#f43f5e' : '#34d399'}
        opacity={0.9}
      />
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-white font-semibold text-lg">Budget vs Actual</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            Set budgets on the Budgets page to see this chart
          </p>
        </div>
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-400 text-sm">No budgets set for this month</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-white font-semibold text-lg">Budget vs Actual</h2>
        <p className="text-gray-500 text-xs mt-0.5">
          How your spending compares to your limits this month
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          barGap={4}
          barSize={20}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2937"
            vertical={false}
          />
          <XAxis
            dataKey="category"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `£${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
          <Bar
            dataKey="Budget"
            fill="#a78bfa"
            radius={[4, 4, 0, 0]}
            opacity={0.5}
          />
          <Bar
            dataKey="Actual"
            radius={[4, 4, 0, 0]}
            shape={(props) => {
              const entry = data[props.index]
              return (
                <rect
                  x={props.x}
                  y={props.y}
                  width={props.width}
                  height={props.height}
                  rx={4}
                  ry={4}
                  fill={entry?.over ? '#f43f5e' : '#34d399'}
                />
              )
            }}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-violet-400 opacity-50" />
          <span className="text-gray-400 text-xs">Budget limit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-400" />
          <span className="text-gray-400 text-xs">Under budget</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-rose-500" />
          <span className="text-gray-400 text-xs">Over budget</span>
        </div>
      </div>
    </div>
  )
}

export default BudgetActualChart