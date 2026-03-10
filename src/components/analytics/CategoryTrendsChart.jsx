import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'
import { CATEGORIES, CATEGORY_COLORS } from '../../types/index'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function CategoryTrendsChart() {
  const transactions = useBudgetStore((state) => state.transactions)
  const filterYear = useBudgetStore((state) => state.filterYear)

  // Start with top 4 expense categories selected
  const [selectedCategories, setSelectedCategories] = useState(
    ['Food', 'Housing', 'Transport', 'Entertainment']
  )

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.length === 1
          ? prev // always keep at least one selected
          : prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  // Build monthly data for each selected category
  const data = MONTHS.map((month, index) => {
    const monthData = { month }
    selectedCategories.forEach((category) => {
      const total = transactions
        .filter((t) => {
          const date = new Date(t.date)
          return (
            t.type === 'expense' &&
            t.category === category &&
            date.getMonth() === index &&
            date.getFullYear() === filterYear
          )
        })
        .reduce((sum, t) => sum + t.amount, 0)
      monthData[category] = total
    })
    return monthData
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white text-sm font-semibold mb-2">{label}</p>
          {payload
            .filter((p) => p.value > 0)
            .sort((a, b) => b.value - a.value)
            .map((entry) => (
              <div key={entry.name} className="flex items-center gap-3 text-sm">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-400">{entry.name}:</span>
                <span className="text-white font-medium ml-auto">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          {payload.every((p) => p.value === 0) && (
            <p className="text-gray-500 text-xs">No spending</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-white font-semibold text-lg">Category Spending Trends</h2>
        <p className="text-gray-500 text-xs mt-0.5">
          Monthly spending per category for {filterYear}
        </p>
      </div>

      {/* Category toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.expense.map((category) => {
          const isSelected = selectedCategories.includes(category)
          const color = CATEGORY_COLORS[category] || '#6b7280'
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'border'
                  : 'bg-gray-700/40 border border-gray-700/60 text-gray-500 hover:text-gray-400'
              }`}
              style={isSelected ? {
                backgroundColor: color + '20',
                borderColor: color + '50',
                color: color,
              } : {}}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isSelected ? color : '#6b7280' }}
              />
              {category}
            </button>
          )
        })}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
            tickFormatter={(v) => `£${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff15' }} />
          {selectedCategories.map((category) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={CATEGORY_COLORS[category] || '#6b7280'}
              strokeWidth={2}
              dot={{ r: 3, fill: CATEGORY_COLORS[category] || '#6b7280' }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}

export default CategoryTrendsChart