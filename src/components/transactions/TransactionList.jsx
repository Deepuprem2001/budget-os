import { useState } from 'react'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency, formatDate } from '../../lib/utils'
import { CATEGORY_COLORS } from '../../types/index'
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2 } from 'lucide-react'
import TransactionForm from './TransactionForm'

function TransactionList() {
  const filterMonth = useBudgetStore((state) => state.filterMonth)
  const filterYear = useBudgetStore((state) => state.filterYear)

  const getFilteredTransactions = useBudgetStore(
    (state) => state.getFilteredTransactions
  )
  const deleteTransaction = useBudgetStore((state) => state.deleteTransaction)

  const [editTransaction, setEditTransaction] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const transactions = getFilteredTransactions()

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700/60">
        <div>
          <h2 className="text-white font-semibold text-lg">All Transactions</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} this month
          </p>
        </div>
      </div>

      {/* Empty state */}
      {transactions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-400 text-sm font-medium">No transactions this month</p>
          <p className="text-gray-600 text-xs mt-1">
            Click "Add Transaction" to get started
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-700/40">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-700/20 transition-colors group"
            >
              {/* Left side */}
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${CATEGORY_COLORS[t.category]}20` }}
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

              {/* Right side */}
              <div className="flex items-center gap-4">
                <p className={`text-sm font-bold ${
                  t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>

                {/* Action buttons - visible on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditTransaction(t)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(t.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editTransaction && (
        <TransactionForm
          editTransaction={editTransaction}
          onClose={() => setEditTransaction(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-semibold text-lg mb-2">Delete Transaction</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-gray-700/60 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTransaction(deleteId)
                  setDeleteId(null)
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

export default TransactionList