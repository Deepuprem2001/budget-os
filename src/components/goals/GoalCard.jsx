import { Trash2, CheckCircle, Plus, Calendar } from 'lucide-react'
import { formatCurrency, getPercentage } from '../../lib/utils'
import useBudgetStore from '../../store/useBudgetStore'
import { useState } from 'react'

function GoalCard({ goal }) {
  const updateGoal = useBudgetStore((state) => state.updateGoal)
  const deleteGoal = useBudgetStore((state) => state.deleteGoal)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [fundAmount, setFundAmount] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const addTransaction = useBudgetStore((state) => state.addTransaction)
  const filterMonth = useBudgetStore((state) => state.filterMonth)
  const filterYear = useBudgetStore((state) => state.filterYear)

  const percentage = getPercentage(goal.currentAmount, goal.targetAmount)
  const remaining = goal.targetAmount - goal.currentAmount
  const isCompleted = goal.completed || goal.currentAmount >= goal.targetAmount

  // Days remaining calculation
  const today = new Date()
  const targetDate = new Date(goal.targetDate)
  const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))
  const isOverdue = daysRemaining < 0 && !isCompleted

  // Monthly savings needed
  const monthlySavingsNeeded = daysRemaining > 0 && remaining > 0
    ? remaining / (daysRemaining / 30)
    : 0

  const handleAddFunds = () => {
  const amount = parseFloat(fundAmount)
  if (amount > 0) {
    // Update goal progress
    const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount)
    updateGoal(goal.id, {
      currentAmount: newAmount,
      completed: newAmount >= goal.targetAmount,
    })

    // Auto-create a transaction
    addTransaction({
      type: 'expense',
      amount: amount,
      category: 'Savings',
      description: `Savings: ${goal.name}`,
      date: new Date().toISOString().split('T')[0],
    })

    setFundAmount('')
    setShowAddFunds(false)
  }
}

  const getProgressColor = () => {
    if (isCompleted) return '#34d399'
    if (isOverdue) return '#f43f5e'
    if (percentage >= 75) return '#a78bfa'
    if (percentage >= 50) return '#3b82f6'
    return '#f59e0b'
  }

  return (
    <div className={`bg-gray-800/40 border rounded-2xl p-5 transition-all ${
      isCompleted
        ? 'border-emerald-500/30'
        : isOverdue
        ? 'border-rose-500/30'
        : 'border-gray-700/60'
    }`}>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700/60 rounded-xl flex items-center justify-center text-xl">
            {goal.emoji}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{goal.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar size={11} className="text-gray-500" />
              <span className={`text-xs ${
                isOverdue
                  ? 'text-rose-400'
                  : isCompleted
                  ? 'text-emerald-400'
                  : 'text-gray-500'
              }`}>
                {isCompleted
                  ? 'Goal achieved! 🎉'
                  : isOverdue
                  ? `${Math.abs(daysRemaining)} days overdue`
                  : `${daysRemaining} days remaining`}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {isCompleted && (
            <CheckCircle size={18} className="text-emerald-400 mr-1" />
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-400 font-medium">
            {formatCurrency(goal.currentAmount)}
          </span>
          <span className="text-gray-500">
            {formatCurrency(goal.targetAmount)}
          </span>
        </div>
        <div className="h-2.5 bg-gray-700/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: getProgressColor(),
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs font-semibold" style={{ color: getProgressColor() }}>
            {percentage}% saved
          </span>
          {!isCompleted && (
            <span className="text-gray-600 text-xs">
              {formatCurrency(remaining)} to go
            </span>
          )}
        </div>
      </div>

      {/* Monthly savings needed */}
      {!isCompleted && monthlySavingsNeeded > 0 && (
        <div className="bg-gray-900/40 rounded-xl px-3 py-2 mb-4">
          <p className="text-gray-500 text-xs">
            Save <span className="text-white font-semibold">
              {formatCurrency(Math.round(monthlySavingsNeeded))}
            </span> /month to reach your goal on time
          </p>
        </div>
      )}

      {/* Add funds */}
      {!isCompleted && (
        <>
          {showAddFunds ? (
            <div className="flex gap-2">
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="Amount to add..."
                className="flex-1 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleAddFunds()}
                autoFocus
              />
              <button
                onClick={handleAddFunds}
                className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddFunds(false)
                  setFundAmount('')
                }}
                className="px-3 py-2 bg-gray-700/60 hover:bg-gray-700 text-gray-400 text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddFunds(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-700 text-gray-500 text-sm hover:border-violet-500/50 hover:text-violet-400 transition-colors"
            >
              <Plus size={14} />
              Add funds
            </button>
          )}
        </>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-semibold mb-2">Delete goal?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This will permanently delete "{goal.name}".
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-gray-700/60 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-rose-500/80 hover:bg-rose-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default GoalCard