import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Layout from '../components/layout/Layout'
import SummaryCards from '../components/dashboard/SummaryCards'
import MonthFilter from '../components/layout/MonthFilter'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import SpendingForecast from '../components/dashboard/SpendingForecast'
import SmartInsights from '../components/dashboard/SmartInsights'
import FinancialHealthScore from '../components/dashboard/FinancialHealthScore'
import DashboardCustomiser from '../components/dashboard/DashboardCustomiser'
import EmptyState from '../components/ui/EmptyState'
import useBudgetStore from '../store/useBudgetStore'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/ui/PageWrapper'
import { LayoutDashboard } from 'lucide-react'

function Dashboard() {
  const navigate = useNavigate()
  const transactions = useBudgetStore((state) => state.transactions)
  const getFilteredTransactions = useBudgetStore((state) => state.getFilteredTransactions)
  const dashboardWidgets = useBudgetStore((state) => state.dashboardWidgets)

  const filteredTransactions = getFilteredTransactions()
  const hasAnyData = transactions.length > 0
  const hasThisMonthData = filteredTransactions.length > 0

  const [showCustomiser, setShowCustomiser] = useState(false)

  // Check which row has any widgets visible
  const showRow1 = dashboardWidgets.spendingForecast || dashboardWidgets.recentTransactions
  const showRow2 = dashboardWidgets.healthScore || dashboardWidgets.smartInsights

  return (
    <Layout>
      <PageWrapper>
        <div className="space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-1">Here's your financial overview</p>
            </div>
            <div className="flex items-center gap-3">
              <MonthFilter />
              {hasAnyData && (
                <button
                  onClick={() => setShowCustomiser(true)}
                  className="flex items-center gap-2 bg-gray-700/60 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Customise
                </button>
              )}
            </div>
          </div>

          {/* Summary cards — always visible */}
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
            <EmptyState
              emoji="📅"
              title="No transactions this month"
              message="There's no data for the selected month. Switch months using the filter above or add a new transaction."
              action={() => navigate('/transactions')}
              actionLabel="Add a transaction"
            />
          ) : (
            <>
              {/* Row 1 — Forecast + Recent */}
              {showRow1 && (
                <div className={`grid grid-cols-1 gap-6 ${
                  dashboardWidgets.spendingForecast && dashboardWidgets.recentTransactions
                    ? 'lg:grid-cols-2'
                    : 'lg:grid-cols-1 max-w-2xl'
                }`}>
                  {dashboardWidgets.spendingForecast && <SpendingForecast />}
                  {dashboardWidgets.recentTransactions && <RecentTransactions />}
                </div>
              )}

              {/* Row 2 — Health Score + Smart Insights */}
              {showRow2 && (
                <div className={`grid grid-cols-1 gap-6 ${
                  dashboardWidgets.healthScore && dashboardWidgets.smartInsights
                    ? 'lg:grid-cols-2'
                    : 'lg:grid-cols-1 max-w-2xl'
                }`}>
                  {dashboardWidgets.healthScore && <FinancialHealthScore />}
                  {dashboardWidgets.smartInsights && <SmartInsights />}
                </div>
              )}

              {/* All widgets hidden */}
              {!showRow1 && !showRow2 && (
                <EmptyState
                  emoji="🧩"
                  title="All widgets are hidden"
                  message="Click Customise to turn some widgets back on."
                  action={() => setShowCustomiser(true)}
                  actionLabel="Customise dashboard"
                />
              )}
            </>
          )}

        </div>

        {/* Customiser modal */}
        <AnimatePresence>
          {showCustomiser && (
            <DashboardCustomiser onClose={() => setShowCustomiser(false)} />
          )}
        </AnimatePresence>

      </PageWrapper>
    </Layout>
  )
}

export default Dashboard