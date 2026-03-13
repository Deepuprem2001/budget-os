import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency, getPercentage } from '../../lib/utils'
import { useToast } from '../../context/ToastContext'

function DebtCard({ debt }) {
  const updateDebt = useBudgetStore((state) => state.updateDebt)
  const deleteDebt = useBudgetStore((state) => state.deleteDebt)
  const addTransaction = useBudgetStore((state) => state.addTransaction)
  const { addToast } = useToast()

  const [showPayment, setShowPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const paidOff = debt.originalAmount - debt.remainingAmount
  const percentage = getPercentage(paidOff, debt.originalAmount)
  const isCleared = debt.remainingAmount <= 0

  // Payoff estimate in months
  const monthsToPayoff = debt.minimumPayment > 0
    ? Math.ceil(debt.remainingAmount / debt.minimumPayment)
    : null

  const payoffDate = monthsToPayoff
    ? new Date(Date.now() + monthsToPayoff * 30 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : null

  // Monthly interest cost
  const monthlyInterest = (debt.remainingAmount * (debt.interestRate / 100)) / 12

  const handlePayment = () => {
    const value = parseFloat(paymentAmount)
    if (value <= 0 || isNaN(value)) return

    const newRemaining = Math.max(debt.remainingAmount - value, 0)
    updateDebt(debt.id, { remainingAmount: newRemaining })

    // Auto-create expense transaction
    addTransaction({
      type: 'expense',
      amount: value,
      category: 'Bills',
      description: `Payment: ${debt.name}`,
      date: new Date().toISOString().split('T')[0],
    })

    setPaymentAmount('')
    setShowPayment(false)
    addToast({ message: `Payment of ${formatCurrency(value)} recorded 💳`, type: 'success' })
  }

  return (
    <div className={`bg-gray-800/40 border rounded-2xl p-5 transition-all ${
      isCleared
        ? 'border-emerald-500/30'
        : 'border-gray-700/60'
    }`}>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: debt.color + '20', border: `1px solid ${debt.color}30` }}
          >
            {debt.emoji}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{debt.name}</h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: debt.color + '20', color: debt.color }}
            >
              {debt.type}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Remaining balance */}
      <div className="mb-4">
        <p className="text-gray-500 text-xs mb-1">Remaining balance</p>
        <p className={`text-2xl font-bold ${
          isCleared ? 'text-emerald-400' : 'text-white'
        }`}>
          {isCleared ? '✅ Cleared!' : formatCurrency(debt.remainingAmount)}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          of {formatCurrency(debt.originalAmount)} original
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>{percentage}% paid off</span>
          <span>{formatCurrency(paidOff)} paid</span>
        </div>
        <div className="h-2 bg-gray-700/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: isCleared ? '#34d399' : debt.color,
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-900/40 rounded-xl p-2.5 text-center">
          <p className="text-gray-600 text-xs mb-0.5">Interest</p>
          <p className="text-white text-xs font-semibold">{debt.interestRate}%</p>
        </div>
        <div className="bg-gray-900/40 rounded-xl p-2.5 text-center">
          <p className="text-gray-600 text-xs mb-0.5">Min payment</p>
          <p className="text-white text-xs font-semibold">
            {formatCurrency(debt.minimumPayment)}
          </p>
        </div>
        <div className="bg-gray-900/40 rounded-xl p-2.5 text-center">
          <p className="text-gray-600 text-xs mb-0.5">Monthly cost</p>
          <p className="text-rose-400 text-xs font-semibold">
            {formatCurrency(Math.round(monthlyInterest))}
          </p>
        </div>
      </div>

      {/* Payoff estimate */}
      {!isCleared && payoffDate && (
        <div className="bg-gray-900/40 rounded-xl px-3 py-2 mb-4">
          <p className="text-gray-500 text-xs">
            At minimum payments — paid off by{' '}
            <span className="text-white font-semibold">{payoffDate}</span>
            {' '}({monthsToPayoff} months)
          </p>
        </div>
      )}

      {/* Make payment */}
      {!isCleared && (
        showPayment ? (
          <div className="flex gap-2">
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder={`Min: £${debt.minimumPayment}`}
              autoFocus
              className="flex-1 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handlePayment()}
            />
            <button
              onClick={handlePayment}
              className="px-3 py-2 text-white text-sm font-medium rounded-xl transition-colors"
              style={{ backgroundColor: debt.color }}
            >
              Pay
            </button>
            <button
              onClick={() => { setShowPayment(false); setPaymentAmount('') }}
              className="px-3 py-2 bg-gray-700/60 text-gray-400 text-sm rounded-xl transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPayment(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-700 text-gray-500 text-sm hover:border-violet-500/50 hover:text-violet-400 transition-colors"
          >
            <Plus size={14} />
            Make a payment
          </button>
        )
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-semibold mb-2">Delete debt?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This will permanently delete "{debt.name}".
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-gray-700/60 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteDebt(debt.id)
                  addToast({ message: 'Debt deleted', type: 'success' })
                }}
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

export default DebtCard