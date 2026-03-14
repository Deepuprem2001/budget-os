import { useState } from 'react'
import Layout from '../components/layout/Layout'
import DebtCard from '../components/debt/DebtCard'
import useBudgetStore from '../store/useBudgetStore'
import { formatCurrency } from '../lib/utils'
import { Plus, X } from 'lucide-react'
import PageWrapper from '../components/ui/PageWrapper'

const DEBT_TYPES = [
  'Credit Card',
  'Personal Loan',
  'Student Loan',
  'Car Loan',
  'Mortgage',
  'Other',
]

const DEBT_EMOJIS = ['💳', '🎓', '🚗', '🏠', '💰', '📋', '🏦', '💸']

const DEBT_COLORS = [
  '#f43f5e', '#a78bfa', '#f59e0b',
  '#3b82f6', '#10b981', '#f97316',
]

function Debts() {
  const debts = useBudgetStore((state) => state.debts)
  const addDebt = useBudgetStore((state) => state.addDebt)

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Credit Card',
    emoji: '💳',
    color: '#f43f5e',
    originalAmount: '',
    remainingAmount: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
  })

  const activeDebts = debts.filter((d) => d.remainingAmount > 0)
  const clearedDebts = debts.filter((d) => d.remainingAmount <= 0)

  const totalDebt = debts.reduce((sum, d) => sum + d.remainingAmount, 0)
  const totalOriginal = debts.reduce((sum, d) => sum + d.originalAmount, 0)
  const totalPaid = totalOriginal - totalDebt
  const monthlyInterestCost = debts.reduce(
    (sum, d) => sum + (d.remainingAmount * (d.interestRate / 100)) / 12, 0
  )

  const handleSubmit = () => {
    if (!formData.name || !formData.originalAmount || !formData.remainingAmount) return
    addDebt({
      name: formData.name,
      type: formData.type,
      emoji: formData.emoji,
      color: formData.color,
      originalAmount: parseFloat(formData.originalAmount),
      remainingAmount: parseFloat(formData.remainingAmount),
      interestRate: parseFloat(formData.interestRate) || 0,
      minimumPayment: parseFloat(formData.minimumPayment) || 0,
      dueDate: formData.dueDate,
    })
    setFormData({
      name: '',
      type: 'Credit Card',
      emoji: '💳',
      color: '#f43f5e',
      originalAmount: '',
      remainingAmount: '',
      interestRate: '',
      minimumPayment: '',
      dueDate: '',
    })
    setShowForm(false)
  }

  return (
    <Layout>
      <PageWrapper>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Debt Tracker</h1>
            <p className="text-gray-400 mt-1">Track and pay off what you owe</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 accent-bg text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={18} />
            Add Debt
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Total Debt</p>
            <p className="text-rose-400 text-2xl font-bold">
              {formatCurrency(totalDebt)}
            </p>
          </div>
          <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Total Paid Off</p>
            <p className="text-emerald-400 text-2xl font-bold">
              {formatCurrency(totalPaid)}
            </p>
          </div>
          <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Monthly Interest</p>
            <p className="text-amber-400 text-2xl font-bold">
              {formatCurrency(Math.round(monthlyInterestCost))}
            </p>
          </div>
          <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Debts Cleared</p>
            <p className="text-white text-2xl font-bold">
              {clearedDebts.length} of {debts.length}
            </p>
          </div>
        </div>

        {/* Active debts */}
        {activeDebts.length > 0 && (
          <div>
            <h2 className="text-white font-semibold mb-4">Active Debts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeDebts.map((debt) => (
                <DebtCard key={debt.id} debt={debt} />
              ))}
            </div>
          </div>
        )}

        {/* Cleared debts */}
        {clearedDebts.length > 0 && (
          <div>
            <h2 className="text-white font-semibold mb-4">Cleared Debts 🎉</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clearedDebts.map((debt) => (
                <DebtCard key={debt.id} debt={debt} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {debts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Debt free!
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              No debts tracked yet. Add one to start monitoring your payoff progress.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="accent-bg text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Add your first debt
            </button>
          </div>
        )}

      </div>

      {/* Add Debt Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">Add Debt</h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">

              {/* Emoji */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Pick an emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEBT_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-colors ${
                        formData.emoji === emoji
                          ? 'accent-bg border-2 border-white/30'
                          : 'bg-gray-700/60 hover:bg-gray-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Pick a color
                </label>
                <div className="flex gap-2">
                  {DEBT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        formData.color === color
                          ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-gray-800'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Debt name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Barclays Credit Card"
                  className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Debt type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                >
                  {DEBT_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-gray-800">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Original amount */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Original amount
                </label>
                <input
                  type="number"
                  value={formData.originalAmount}
                  onChange={(e) => setFormData({ ...formData, originalAmount: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                />
              </div>

              {/* Remaining amount */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Remaining balance
                </label>
                <input
                  type="number"
                  value={formData.remainingAmount}
                  onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
                  placeholder="e.g. 3200"
                  className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                />
              </div>

              {/* Interest rate */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Interest rate (%) <span className="text-gray-600">(optional)</span>
                </label>
                <input
                  type="number"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  placeholder="e.g. 19.9"
                  step="0.1"
                  className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                />
              </div>

              {/* Minimum payment */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Minimum monthly payment <span className="text-gray-600">(optional)</span>
                </label>
                <input
                  type="number"
                  value={formData.minimumPayment}
                  onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
                  placeholder="e.g. 50"
                  className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.originalAmount || !formData.remainingAmount}
                className="w-full py-3 accent-bg disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Add Debt
              </button>

            </div>
          </div>
        </div>
      )}
      </PageWrapper>
    </Layout>
  )
}

export default Debts