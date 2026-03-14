import { useState, useEffect } from 'react'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'
import { CATEGORY_COLORS } from '../../types/index'
import { useToast } from '../../context/ToastContext'
import {
  Plus, Trash2, RefreshCw, X,
  ToggleLeft, ToggleRight, Repeat,
} from 'lucide-react'

const FREQUENCIES = [
  { value: 'weekly', label: 'Weekly', icon: '📅' },
  { value: 'monthly', label: 'Monthly', icon: '🗓️' },
  { value: 'yearly', label: 'Yearly', icon: '📆' },
]

function RecurringTransactions() {
  const recurringTransactions = useBudgetStore((state) => state.recurringTransactions)
  const addRecurringTransaction = useBudgetStore((state) => state.addRecurringTransaction)
  const deleteRecurringTransaction = useBudgetStore((state) => state.deleteRecurringTransaction)
  const toggleRecurringTransaction = useBudgetStore((state) => state.toggleRecurringTransaction)
  const processRecurringTransactions = useBudgetStore((state) => state.processRecurringTransactions)
  const getAllCategories = useBudgetStore((state) => state.getAllCategories)
  const { addToast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category: 'Housing',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
  })

  const allCategories = getAllCategories()

  // Auto-process on mount
  useEffect(() => {
    processRecurringTransactions()
  }, [])

  const handleSubmit = () => {
    if (!formData.description || !formData.amount) return
    addRecurringTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
      active: true,
    })
    addToast({ message: `Recurring ${formData.description} added`, type: 'success' })
    setFormData({
      type: 'expense',
      description: '',
      amount: '',
      category: 'Housing',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
    })
    setShowForm(false)
  }

  const handleProcess = () => {
    processRecurringTransactions()
    addToast({ message: 'Recurring transactions processed', type: 'success' })
  }

  const getNextDueDate = (r) => {
    if (!r.lastGenerated) return 'Due now'
    const last = new Date(r.lastGenerated)
    const next = new Date(last)
    if (r.frequency === 'weekly') next.setDate(next.getDate() + 7)
    else if (r.frequency === 'monthly') next.setMonth(next.getMonth() + 1)
    else if (r.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1)
    return next.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700/60">
        <div className="flex items-center gap-2">
          <Repeat size={18} className="accent-text" />
          <div>
            <h2 className="text-white font-semibold text-lg">Recurring Transactions</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              {recurringTransactions.filter((r) => r.active).length} active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleProcess}
            className="flex items-center gap-1.5 bg-gray-700/60 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
            title="Process due recurring transactions"
          >
            <RefreshCw size={13} />
            Process now
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 accent-bg text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {/* List */}
      {recurringTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔁</div>
          <p className="text-gray-400 text-sm font-medium">No recurring transactions</p>
          <p className="text-gray-600 text-xs mt-1">
            Add your salary, rent or subscriptions to auto-generate them
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-700/40">
          {recurringTransactions.map((r) => (
            <div
              key={r.id}
              className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                !r.active ? 'opacity-50' : ''
              }`}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${CATEGORY_COLORS[r.category] || '#6b7280'}20` }}
              >
                <Repeat
                  size={16}
                  style={{ color: CATEGORY_COLORS[r.category] || '#6b7280' }}
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-medium truncate">
                    {r.description}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-400 flex-shrink-0">
                    {FREQUENCIES.find((f) => f.value === r.frequency)?.icon}{' '}
                    {r.frequency}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-xs font-medium"
                    style={{ color: CATEGORY_COLORS[r.category] || '#6b7280' }}
                  >
                    {r.category}
                  </span>
                  <span className="text-gray-600 text-xs">·</span>
                  <span className="text-gray-500 text-xs">
                    Next: {getNextDueDate(r)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <p className={`text-sm font-bold flex-shrink-0 ${
                r.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount)}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleRecurringTransaction(r.id)}
                  className="text-gray-500 hover:text-white transition-colors"
                  title={r.active ? 'Pause' : 'Resume'}
                >
                  {r.active
                    ? <ToggleRight size={20} className="accent-text" />
                    : <ToggleLeft size={20} />
                  }
                </button>
                <button
                  onClick={() => {
                    deleteRecurringTransaction(r.id)
                    addToast({ message: 'Recurring transaction deleted', type: 'success' })
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">New Recurring Transaction</h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">

              {/* Type toggle */}
              <div className="flex gap-2 bg-gray-900/60 p-1 rounded-xl">
                {['expense', 'income'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({
                      ...formData,
                      type,
                      category: type === 'income' ? 'Salary' : 'Housing',
                    })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      formData.type === type
                        ? type === 'income'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Monthly rent, Netflix, Salary"
                  autoFocus
                  className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                />
              </div>

              {/* Amount + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                  >
                    {allCategories[formData.type].map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-800">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFormData({ ...formData, frequency: f.value })}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        formData.frequency === f.value
                          ? 'accent-bg-faint accent-border accent-text'
                          : 'bg-gray-900/40 border-gray-700/60 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {f.icon} {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start date */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Start date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.description || !formData.amount}
                className="w-full py-3 accent-bg disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Add Recurring Transaction
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default RecurringTransactions