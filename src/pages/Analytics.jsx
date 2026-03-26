import Layout from '../components/layout/Layout'
import MonthFilter from '../components/layout/MonthFilter'
import ExpensePieChart from '../components/analytics/ExpensePieChart'
import MonthlyBarChart from '../components/analytics/MonthlyBarChart'
import BalanceLineChart from '../components/analytics/BalanceLineChart'
import YearlySummary from '../components/analytics/YearlySummary'
import BudgetActualChart from '../components/analytics/BudgetActualChart'
import CategoryTrendsChart from '../components/analytics/CategoryTrendsChart'
import YearOverYearChart from '../components/analytics/YearOverYearChart'
import EmptyState from '../components/ui/EmptyState'
import useBudgetStore from '../store/useBudgetStore'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/ui/PageWrapper'

function Analytics() {
  const navigate = useNavigate()
  const transactions = useBudgetStore((state) => state.transactions)
  const hasData = transactions.length > 0

  return (
    <Layout>
      <PageWrapper>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-1">Visualise your financial data</p>
          </div>
        </div>

        {!hasData ? (
          <EmptyState
            emoji="📊"
            title="No data to analyse yet"
            message="Add some transactions first and your charts will automatically populate with your spending patterns and trends."
            action={() => navigate('/transactions')}
            actionLabel="Add transactions"
          />
        ) : (
          <>
            <YearlySummary />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <p className="text-white font-semibold">This Month's Breakdown</p>
                  <MonthFilter />
                </div>
                <ExpensePieChart />
              </div>
              <BalanceLineChart />
            </div>

            <BudgetActualChart />
            <YearOverYearChart />
            <CategoryTrendsChart />
            <MonthlyBarChart />
          </>
        )}

      </div>
      </PageWrapper>
    </Layout>
  )
}

export default Analytics