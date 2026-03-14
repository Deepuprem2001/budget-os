import { CATEGORY_COLORS } from '../../types/index'
import { getPercentage, formatCurrency } from '../../lib/utils'
import { AlertTriangle, CheckCircle } from 'lucide-react'

function BudgetCard({ category, budgetAmount, spentAmount, onSetBudget }) {
  const percentage = getPercentage(spentAmount, budgetAmount)
  const isOver = spentAmount > budgetAmount && budgetAmount > 0
  const isWarning = percentage >= 80 && percentage < 100
  const color = CATEGORY_COLORS[category] || '#6b7280'
  const remaining = budgetAmount - spentAmount

  return (
    <div className={`bg-gray-800/40 border rounded-2xl p-5 transition-all ${
      isOver
        ? 'border-rose-500/40'
        : isWarning
        ? 'border-amber-500/40'
        : 'border-gray-700/60'
    }`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-white text-sm font-semibold">{category}</span>
        </div>

        {budgetAmount > 0 && (
          isOver ? (
            <div className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full">
              <AlertTriangle size={11} />
              <span className="text-xs font-medium">Over budget</span>
            </div>
          ) : isWarning ? (
            <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
              <AlertTriangle size={11} />
              <span className="text-xs font-medium">Almost there</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
              <CheckCircle size={11} />
              <span className="text-xs font-medium">On track</span>
            </div>
          )
        )}
      </div>

      {/* Amounts */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-gray-500 text-xs mb-1">Spent</p>
          <p className={`text-xl font-bold ${isOver ? 'text-rose-400' : 'text-white'}`}>
            {formatCurrency(spentAmount)}
          </p>
        </div>
        {budgetAmount > 0 && (
          <div className="text-right">
            <p className="text-gray-500 text-xs mb-1">
              {isOver ? 'Over by' : 'Remaining'}
            </p>
            <p className={`text-sm font-semibold ${
              isOver ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {isOver
                ? formatCurrency(Math.abs(remaining))
                : formatCurrency(remaining)}
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {budgetAmount > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{percentage}% used</span>
            <span>Limit: {formatCurrency(budgetAmount)}</span>
          </div>
          <div className="h-2 bg-gray-700/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: isOver
                  ? '#f43f5e'
                  : isWarning
                  ? '#f59e0b'
                  : color,
              }}
            />
          </div>
        </div>
      )}

      {/* Set budget input */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700/40">
        <input
          type="number"
          placeholder={budgetAmount > 0 ? 'Update limit...' : 'Set limit...'}
          min="0"
          step="10"
          className="flex-1 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none accent-focus transition-colors"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value) {
              onSetBudget(category, parseFloat(e.target.value))
              e.target.value = ''
            }
          }}
        />
        <button
          className="px-3 py-2 accent-bg text-white text-sm font-medium rounded-xl transition-colors"
          onClick={(e) => {
            const input = e.target.previousSibling
            if (input.value) {
              onSetBudget(category, parseFloat(input.value))
              input.value = ''
            }
          }}
        >
          Set
        </button>
      </div>

    </div>
  )
}

export default BudgetCard