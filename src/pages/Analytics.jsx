import Layout from '../components/layout/Layout'
import MonthFilter from '../components/layout/MonthFilter'
import ExpensePieChart from '../components/analytics/ExpensePieChart'
import MonthlyBarChart from '../components/analytics/MonthlyBarChart'
import BalanceLineChart from '../components/analytics/BalanceLineChart'
import YearlySummary from '../components/analytics/YearlySummary'

function Analytics() {
  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-1">Visualise your financial data</p>
        </div>
        </div>

        {/* Yearly summary */}
        <YearlySummary />

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-6">
        <div>
            <div className="flex items-center justify-between mb-4">
            <p className="text-white font-semibold">This Month's Breakdown</p>
            <MonthFilter />
            </div>
            <ExpensePieChart />
        </div>
        <BalanceLineChart />
        </div>

        {/* Full width bar chart */}
        <MonthlyBarChart />

      </div>
    </Layout>
  )
}

export default Analytics