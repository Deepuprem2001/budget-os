import Layout from '../components/layout/Layout'
import SummaryCards from '../components/dashboard/SummaryCards'
import MonthFilter from '../components/layout/MonthFilter'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import SpendingForecast from '../components/dashboard/SpendingForecast'
import SmartInsights from '../components/dashboard/SmartInsights'
import FinancialHealthScore from '../components/dashboard/FinancialHealthScore'
import EmptyState from '../components/ui/EmptyState'
import useBudgetStore from '../store/useBudgetStore'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const transactions = useBudgetStore((state) => state.transactions)
  const getFilteredTransactions = useBudgetStore((state) => state.getFilteredTransactions)
  const filteredTransactions = getFilteredTransactions()

  const hasAnyData = transactions.length > 0
  const hasThisMonthData = filteredTransactions.length > 0

  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Here's your financial overview</p>
          </div>
          <MonthFilter />
        </div>

        {/* Summary cards always visible */}
        <SummaryCards />

        {/* No data at all */}
        {!hasAnyData ? (
          <EmptyState
            emoji="💰"
            title="Welcome to BudgetOS!"
            message="Start by adding your first transaction — your income, bills or expenses. Everything else will fill in automatically."
            action={() => navigate('/transactions')}
            actionLabel="Add your first transaction"
          />
        ) : !hasThisMonthData ? (
          /* Has data but not this month */
          <EmptyState
            emoji="📅"
            title="No transactions this month"
            message="There's no data for the selected month. Switch months using the filter above or add a new transaction."
            action={() => navigate('/transactions')}
            actionLabel="Add a transaction"
          />
        ) : (
          /* Has data — show everything */
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingForecast />
              <RecentTransactions />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialHealthScore />
              <SmartInsights />
            </div>
          </>
        )}

      </div>
    </Layout>
  )
}

export default Dashboard