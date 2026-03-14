import { useState } from 'react'
import useBudgetStore from '../../store/useBudgetStore'
import { CATEGORIES } from '../../types/index'
import { X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { motion, AnimatePresence } from 'framer-motion'
import { scaleIn } from '../../lib/animations'

const defaultForm = {
  description: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10),
}

function TransactionForm({ onClose, editTransaction }) {
  const addTransaction = useBudgetStore((state) => state.addTransaction)
  const updateTransaction = useBudgetStore((state) => state.updateTransaction)
  const { addToast } = useToast()
  const getAllCategories = useBudgetStore((state) => state.getAllCategories)
  const allCategories = getAllCategories()

  const [form, setForm] = useState(
    editTransaction
      ? { ...editTransaction, amount: editTransaction.amount.toString() }
      : defaultForm
  )
  const [error, setError] = useState(null)

  const handleTypeChange = (type) => {
    setForm((f) => ({
      ...f,
      type,
      category: type === 'income' ? 'Salary' : 'Food',
    }))
  }

  const handleSubmit = () => {
    // Validation
    if (!form.description.trim()) {
      setError('Please enter a description')
      return
    }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (!form.date) {
      setError('Please select a date')
      return
    }

    const data = { ...form, amount: parseFloat(form.amount) }

    if (editTransaction) {
      updateTransaction(editTransaction.id, data)
      addToast({ message: 'Transaction updated', type: 'success' })
    } else {
      addTransaction(data)
      addToast({ message: 'Transaction added successfully', type: 'success' })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          exit="exit"
          className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md"
        >
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white font-semibold text-lg">
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Error */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Type toggle */}
          <div className="flex gap-2 bg-gray-900/60 p-1 rounded-xl">
            {['expense', 'income'].map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  form.type === type
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
              value={form.description}
              onChange={(e) => {
                setForm((f) => ({ ...f, description: e.target.value }))
                setError(null)
              }}
              placeholder="e.g. Monthly rent, Grocery shopping..."
              className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Amount (£)
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => {
                setForm((f) => ({ ...f, amount: e.target.value }))
                setError(null)
              }}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
            />
          </div>

          {/* Category and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
              >
                {allCategories[form.type].map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-800">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
              form.type === 'income'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                : 'accent-bg text-white'
            }`}
          >
            {editTransaction ? 'Update Transaction' : 'Add Transaction'}
          </button>

        </div>
      </div>
      </motion.div>
    </div>
  )
}

export default TransactionForm