import { motion, AnimatePresence } from 'framer-motion'
import useBudgetStore from '../../store/useBudgetStore'
import {
  X,
  TrendingUp,
  ArrowLeftRight,
  Activity,
  Lightbulb,
  LayoutDashboard,
  Bell,
} from 'lucide-react'

const WIDGETS = [
  {
    key: 'spendingForecast',
    label: 'Spending Forecast',
    description: 'Predicts your month-end spend',
    icon: TrendingUp,
  },
  {
    key: 'recentTransactions',
    label: 'Recent Transactions',
    description: 'Last 5 transactions this month',
    icon: ArrowLeftRight,
  },
  {
    key: 'healthScore',
    label: 'Financial Health Score',
    description: 'Your overall financial score out of 100',
    icon: Activity,
  },
  {
    key: 'smartInsights',
    label: 'Smart Insights',
    description: 'Personalised tips based on your data',
    icon: Lightbulb,
  },
  {
    key: 'billReminders',
    label: 'Bill Reminders',
    description: 'Upcoming bills due in the next 30 days',
    icon: Bell,
  },
]

function DashboardCustomiser({ onClose }) {
  const dashboardWidgets = useBudgetStore((state) => state.dashboardWidgets)
  const toggleDashboardWidget = useBudgetStore((state) => state.toggleDashboardWidget)

  const activeCount = Object.values(dashboardWidgets).filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={18} className="accent-text" />
            <div>
              <h2 className="text-white font-semibold">Customise Dashboard</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                {activeCount} of {WIDGETS.length} widgets visible
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Widgets list */}
        <div className="p-6 space-y-3">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-4">
            Toggle widgets on or off
          </p>

          {WIDGETS.map(({ key, label, description, icon: Icon }) => {
            const isOn = dashboardWidgets[key]
            return (
              <div
                key={key}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  isOn
                    ? 'bg-gray-700/30 border-gray-600/60'
                    : 'bg-gray-900/20 border-gray-700/40 opacity-50'
                }`}
                onClick={() => toggleDashboardWidget(key)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isOn ? 'accent-bg-faint accent-border border' : 'bg-gray-700/40'
                }`}>
                  <Icon size={18} className={isOn ? 'accent-text' : 'text-gray-600'} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isOn ? 'text-white' : 'text-gray-500'}`}>
                    {label}
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">{description}</p>
                </div>

                {/* Toggle switch */}
                <div
                  className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${
                    isOn ? 'accent-bg' : 'bg-gray-700'
                  }`}
                >
                  <motion.div
                    animate={{ x: isOn ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                  />
                </div>
              </div>
            )
          })}

          {/* Note */}
          <p className="text-gray-600 text-xs text-center pt-2">
            Summary Cards are always visible and cannot be hidden
          </p>
        </div>

      </motion.div>
    </motion.div>
  )
}

export default DashboardCustomiser