import { useState } from 'react'
import Layout from '../components/layout/Layout'
import TransactionList from '../components/transactions/TransactionList'
import TransactionForm from '../components/transactions/TransactionForm'
import MonthFilter from '../components/layout/MonthFilter'
import SearchFilter from '../components/transactions/SearchFilter'
import useBudgetStore from '../store/useBudgetStore'
import { CATEGORIES } from '../types/index'
import { exportToCSV } from '../lib/utils'
import { Plus, Download } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import PageWrapper from '../components/ui/PageWrapper'
import RecurringTransactions from '../components/transactions/RecurringTransactions'
import PDFReport from '../components/ui/PDFReport'
import { exportToPDF } from '../lib/exportPDF'
import { FileText } from 'lucide-react'

function Transactions() {
  const transactions = useBudgetStore((state) => state.transactions)
  const filterMonth = useBudgetStore((state) => state.filterMonth)
  const filterYear = useBudgetStore((state) => state.filterYear)

  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // Filter by month first
  const monthTransactions = transactions.filter((t) => {
    const date = new Date(t.date)
    return (
      date.getMonth() + 1 === filterMonth &&
      date.getFullYear() === filterYear
    )
  })

  // Then apply search and filters
  const filteredTransactions = monthTransactions.filter((t) => {
    const matchesSearch = search
      ? t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      : true
    const matchesType = filterType !== 'all' ? t.type === filterType : true
    const matchesCategory =
      filterCategory !== 'all' ? t.category === filterCategory : true
    return matchesSearch && matchesType && matchesCategory
  })

  const totalThisMonth = monthTransactions.length

  const [exportingPDF, setExportingPDF] = useState(false)

  const handleExportPDF = async () => {
    setExportingPDF(true)
    // Small delay to let the hidden component render
    await new Promise((resolve) => setTimeout(resolve, 300))
    await exportToPDF({
      elementId: 'pdf-report',
      filename: `FinSight-${filterYear}-${String(filterMonth).padStart(2, '0')}.pdf`,
      title: `FinSight Report — ${filterMonth}/${filterYear}`,
    })
    setExportingPDF(false)
  }

  return (
    <Layout>
      <PageWrapper>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Transactions</h1>
            <p className="text-gray-400 mt-1">
              Showing {filteredTransactions.length} of {totalThisMonth} transactions
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <MonthFilter />
            <button
              onClick={() => exportToCSV(filteredTransactions, `transactions-${filterYear}-${String(filterMonth).padStart(2, '0')}.csv`)}
              disabled={filteredTransactions.length === 0}
              className="flex items-center gap-2 bg-gray-700/60 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-gray-700"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exportingPDF || filteredTransactions.length === 0}
              className="flex items-center gap-2 bg-gray-700/60 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-gray-700"
            >
              <FileText size={18} />
              {exportingPDF ? 'Generating...' : 'Export PDF'}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 accent-bg text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              <Plus size={18} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Search & filter bar */}
        <SearchFilter
          search={search}
          setSearch={setSearch}
          filterType={filterType}
          setFilterType={setFilterType}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        />

        {/* Transaction list */}
        {filteredTransactions.length === 0 ? (
          search || filterType !== 'all' || filterCategory !== 'all' ? (
            <EmptyState
              emoji="🔍"
              title="No transactions found"
              message="No transactions match your search or filters. Try adjusting or clearing your filters."
            />
          ) : (
            <EmptyState
              emoji="📭"
              title="No transactions this month"
              message="You haven't added any transactions for this month yet."
              action={() => setShowForm(true)}
              actionLabel="Add your first transaction"
            />
          )
        ) : (
          <TransactionList transactions={filteredTransactions} />
        )}

        <RecurringTransactions />

        <PDFReport month={filterMonth} year={filterYear} />

      </div>

      {/* Add transaction modal */}
      {showForm && (
        <TransactionForm onClose={() => setShowForm(false)} />
      )}
      </PageWrapper>
    </Layout>
  )
}

export default Transactions