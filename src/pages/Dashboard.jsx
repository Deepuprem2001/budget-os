import Layout from '../components/layout/Layout'
import SummaryCards from '../components/dashboard/SummaryCards'
import MonthFilter from '../components/layout/MonthFilter'

function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Here's your financial overview</p>
          </div>
          <MonthFilter />
        </div>
        <SummaryCards />
      </div>
    </Layout>
  )
}

export default Dashboard