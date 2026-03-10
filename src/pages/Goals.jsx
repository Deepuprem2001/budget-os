import { useState } from 'react'
import Layout from '../components/layout/Layout'
import GoalCard from '../components/goals/GoalCard'
import useBudgetStore from '../store/useBudgetStore'
import { formatCurrency } from '../lib/utils'
import { Plus, X, Target } from 'lucide-react'

const GOAL_EMOJIS = ['✈️', '🛡️', '💻', '🏠', '🚗', '📚', '💍', '🏋️', '🎓', '🌴', '💰', '🎯']

function Goals() {
  const goals = useBudgetStore((state) => state.goals)
  const addGoal = useBudgetStore((state) => state.addGoal)

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    emoji: '🎯',
  })

  const activeGoals = goals.filter((g) => !g.completed)
  const completedGoals = goals.filter((g) => g.completed)

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)

  const handleSubmit = () => {
    if (!formData.name || !formData.targetAmount || !formData.targetDate) return
    addGoal({
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      targetDate: formData.targetDate,
      emoji: formData.emoji,
    })
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      emoji: '🎯',
    })
    setShowForm(false)
  }

  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Financial Goals</h1>
            <p className="text-gray-400 mt-1">Track your savings targets</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={18} />
            New Goal
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Active Goals</p>
            <p className="text-white text-2xl font-bold">{activeGoals.length}</p>
          </div>
          <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Total Saved</p>
            <p className="text-violet-400 text-2xl font-bold">
              {formatCurrency(totalSaved)}
            </p>
          </div>
          <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Completed Goals</p>
            <p className="text-emerald-400 text-2xl font-bold">
              {completedGoals.length}
            </p>
          </div>
        </div>

        {/* Active goals */}
        {activeGoals.length > 0 && (
          <div>
            <h2 className="text-white font-semibold mb-4">Active Goals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}

        {/* Completed goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-white font-semibold mb-4">
              Completed Goals 🎉
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {goals.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No goals yet
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Set your first financial goal and start tracking your progress
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Create your first goal
            </button>
          </div>
        )}

      </div>

      {/* Add Goal Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md">

            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">New Goal</h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">

              {/* Emoji picker */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Pick an emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {GOAL_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-colors ${
                        formData.emoji === emoji
                          ? 'bg-violet-600 border-2 border-violet-400'
                          : 'bg-gray-700/60 hover:bg-gray-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Goal name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Holiday to Japan"
                  className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Target amount */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Target amount
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="e.g. 3000"
                  className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Current amount */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Already saved <span className="text-gray-600">(optional)</span>
                </label>
                <input
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  placeholder="e.g. 500"
                  className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Target date */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Target date
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.targetAmount || !formData.targetDate}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-900 disabled:text-violet-500 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Create Goal
              </button>

            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}

export default Goals