import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'

function BalanceLineChart() {
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

    return { month, net: income - expenses }
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white text-sm font-semibold mb-1">{label}</p>
          <p className={`text-sm font-medium ${
            value >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {value >= 0 ? '+' : ''}{formatCurrency(value)}
          </p>
        </div>
      )
    }
    return null
  }

  const CustomDot = ({ cx, cy, payload }) => {
    const isPositive = payload.net >= 0
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={isPositive ? '#34d399' : '#f43f5e'}
        stroke={isPositive ? '#34d39940' : '#f43f5e40'}
        strokeWidth={6}
      />
    )
  }

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-white font-semibold text-lg">Net Balance Trend</h2>
        <p className="text-gray-500 text-xs mt-0.5">
          Monthly savings or deficit for {filterYear}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
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
            tickFormatter={(v) => `£${(v / 1000).toFixed(1)}k`}
            tickCount={5}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff15' }} />
          <ReferenceLine
            y={0}
            stroke="#374151"
            strokeDasharray="4 4"
          />
          <Line
            type="monotone"
            dataKey="net"
            stroke="#a78bfa"
            strokeWidth={2.5}
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: '#a78bfa' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BalanceLineChart