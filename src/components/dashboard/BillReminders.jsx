import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'
import { CATEGORY_COLORS } from '../../types/index'
import { useToast } from '../../context/ToastContext'
import { Bell, CheckCircle, Link } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function BillReminders() {
  const recurringTransactions = useBudgetStore((state) => state.recurringTransactions)
  const addTransaction = useBudgetStore((state) => state.addTransaction)
  const { addToast } = useToast()
  const navigate = useNavigate()
  const markRecurringAsPaid = useBudgetStore((state) => state.markRecurringAsPaid)

  const today = new Date()

  // Calculate next due date for a recurring transaction
  const getNextDueDate = (r) => {
    if (!r.lastGenerated) return new Date(r.startDate)
    const last = new Date(r.lastGenerated)
    const next = new Date(last)
    if (r.frequency === 'weekly') next.setDate(next.getDate() + 7)
    else if (r.frequency === 'monthly') next.setMonth(next.getMonth() + 1)
    else if (r.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1)
    return next
  }

  // Get days until due
  const getDaysUntil = (date) => {
    const diff = date - today
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  // Get urgency style
  const getUrgency = (daysUntil) => {
    if (daysUntil <= 0) return {
      label: 'Overdue',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      dot: 'bg-rose-400',
    }
    if (daysUntil <= 3) return {
      label: `${daysUntil}d`,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      dot: 'bg-rose-400',
    }
    if (daysUntil <= 7) return {
      label: `${daysUntil}d`,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      dot: 'bg-amber-400',
    }
    return {
      label: `${daysUntil}d`,
      color: 'text-gray-400',
      bg: 'bg-gray-700/30',
      border: 'border-gray-700/60',
      dot: 'bg-gray-500',
    }
  }

  // Only show expense bills due in the next 30 days
  const upcomingBills = recurringTransactions
    .filter((r) => r.active && r.type === 'expense')
    .map((r) => ({
      ...r,
      nextDue: getNextDueDate(r),
      daysUntil: getDaysUntil(getNextDueDate(r)),
    }))
    .filter((r) => r.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil)

  const urgentCount = upcomingBills.filter((b) => b.daysUntil <= 7).length

    const handleMarkAsPaid = (bill) => {
    addTransaction({
        type: 'expense',
        amount: bill.amount,
        category: bill.category,
        description: `${bill.description} (Manual)`,
        date: today.toISOString().split('T')[0],
    })
    markRecurringAsPaid(bill.id)
    addToast({ message: `${bill.description} marked as paid ✅`, type: 'success' })
    }

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700/60">
        <div className="flex items-center gap-2">
          <Bell size={18} className="accent-text" />
          <div>
            <h2 className="text-white font-semibold text-lg">Bill Reminders</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Upcoming bills in the next 30 days
            </p>
          </div>
        </div>
        {urgentCount > 0 && (
          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">
            {urgentCount} urgent
          </span>
        )}
      </div>

      {/* Bills list */}
      {upcomingBills.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-gray-400 text-sm font-medium">No bills due soon</p>
          <p className="text-gray-600 text-xs mt-1 mb-4">
            Add recurring transactions to track upcoming bills
          </p>
          <button
            onClick={() => navigate('/transactions')}
            className="accent-bg text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            Add recurring transactions
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-700/40">
          {upcomingBills.map((bill) => {
            const urgency = getUrgency(bill.daysUntil)
            return (
              <div
                key={bill.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-700/20 transition-colors group"
              >
                {/* Category icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${CATEGORY_COLORS[bill.category] || '#6b7280'}20` }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[bill.category] || '#6b7280' }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {bill.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color: CATEGORY_COLORS[bill.category] || '#6b7280' }}
                    >
                      {bill.category}
                    </span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs capitalize">
                      {bill.frequency}
                    </span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">
                      {bill.nextDue.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <p className="text-sm font-bold text-rose-400 flex-shrink-0">
                  -{formatCurrency(bill.amount)}
                </p>

                {/* Due badge */}
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${urgency.bg} ${urgency.border} ${urgency.color}`}>
                  {bill.daysUntil <= 0 ? 'Overdue' : `${bill.daysUntil}d`}
                </div>

                {/* Mark as paid */}
                <button
                  onClick={() => handleMarkAsPaid(bill)}
                  className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all flex-shrink-0"
                  title="Mark as paid"
                >
                  <CheckCircle size={16} />
                </button>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default BillReminders