import { useState } from 'react'
import Layout from '../components/layout/Layout'
import TransactionList from '../components/transactions/TransactionList'
import TransactionForm from '../components/transactions/TransactionForm'
import MonthFilter from '../components/layout/MonthFilter'
import { Plus } from 'lucide-react'

function Transactions() {
  const [showForm, setShowForm] = useState(false)

  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Transactions</h1>
            <p className="text-gray-400 mt-1">Manage your income and expenses</p>
          </div>
          <div className="flex items-center gap-3">
            <MonthFilter />
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus size={18} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Transaction list */}
        <TransactionList />

      </div>

      {/* Add transaction modal */}
      {showForm && (
        <TransactionForm onClose={() => setShowForm(false)} />
      )}

    </Layout>
  )
}

export default Transactions