import Layout from '../components/layout/Layout'
import SummaryCards from '../components/dashboard/SummaryCards'
import MonthFilter from '../components/layout/MonthFilter'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import SpendingForecast from '../components/dashboard/SpendingForecast'
import SmartInsights from '../components/dashboard/SmartInsights'
import FinancialHealthScore from '../components/dashboard/FinancialHealthScore'

function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Here's your financial overview</p>
          </div>
          <MonthFilter />
        </div>
        <SummaryCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingForecast />
          <RecentTransactions />
        </div>
        {/* Health Score + Smart Insights side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialHealthScore />
        <SmartInsights />
      </div>
      </div>
    </Layout>
  )
}

export default Dashboard