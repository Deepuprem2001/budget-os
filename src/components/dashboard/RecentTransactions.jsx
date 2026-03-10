import { Link } from 'react-router-dom'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency, formatDate } from '../../lib/utils'
import { CATEGORY_COLORS } from '../../types/index'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

function RecentTransactions() {
  const filterMonth = useBudgetStore((state) => state.filterMonth)
  const filterYear = useBudgetStore((state) => state.filterYear)
  const getFilteredTransactions = useBudgetStore(
    (state) => state.getFilteredTransactions
  )

  const transactions = getFilteredTransactions().slice(0, 5)

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Recent Transactions</h2>
          <p className="text-gray-500 text-xs mt-0.5">Last 5 transactions this month</p>
        </div>
        <Link
          to="/transactions"
          className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Transaction list */}
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-400 text-sm font-medium">No transactions this month</p>
          <p className="text-gray-600 text-xs mt-1">Add your first transaction to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-700/30 transition-colors group"
            >
              {/* Left side */}
              <div className="flex items-center gap-3">
                {/* Category color dot */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[t.category]}20`,
                  }}
                >
                  {t.type === 'income' ? (
                    <ArrowUpRight
                      size={18}
                      style={{ color: CATEGORY_COLORS[t.category] }}
                    />
                  ) : (
                    <ArrowDownRight
                      size={18}
                      style={{ color: CATEGORY_COLORS[t.category] }}
                    />
                  )}
                </div>

                {/* Description and category */}
                <div>
                  <p className="text-white text-sm font-medium">{t.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color: CATEGORY_COLORS[t.category] }}
                    >
                      {t.category}
                    </span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{formatDate(t.date)}</span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p className={`text-sm font-bold ${
                  t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
                <p className="text-gray-600 text-xs mt-0.5 capitalize">{t.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentTransactions