import useBudgetStore from '../store/useBudgetStore'
import Layout from '../components/layout/Layout'
import BudgetCard from '../components/budgets/BudgetCard'
import MonthFilter from '../components/layout/MonthFilter'
import { CATEGORIES } from '../types/index'
import { formatCurrency } from '../lib/utils'
import { useToast } from '../context/ToastContext'

function Budgets() {
  const getFilteredTransactions = useBudgetStore(
    (state) => state.getFilteredTransactions
  )
  const budgets = useBudgetStore((state) => state.budgets)
  const filterMonth = useBudgetStore((state) => state.filterMonth)
  const filterYear = useBudgetStore((state) => state.filterYear)
  const setBudget = useBudgetStore((state) => state.setBudget)
  const { addToast } = useToast()

  const transactions = getFilteredTransactions()

  // Calculate spent amount per category
  const getSpentAmount = (category) => {
    return transactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  // Get budget limit for a category
  const getBudgetAmount = (category) => {
    const budget = budgets.find(
      (b) =>
        b.category === category &&
        b.month === filterMonth &&
        b.year === filterYear
    )
    return budget ? budget.amount : 0
  }

  const handleSetBudget = (category, amount) => {
    setBudget({
      category,
      amount,
      month: filterMonth,
      year: filterYear,
    })
    addToast({ message: 'Budget saved', type: 'success' })
  }

  // Summary stats
  const totalBudgeted = CATEGORIES.expense.reduce(
    (sum, cat) => sum + getBudgetAmount(cat), 0
  )
  const totalSpent = CATEGORIES.expense.reduce(
    (sum, cat) => sum + getSpentAmount(cat), 0
  )
  const overBudgetCount = CATEGORIES.expense.filter(
    (cat) => {
      const budget = getBudgetAmount(cat)
      return budget > 0 && getSpentAmount(cat) > budget
    }
  ).length

  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Budgets</h1>
            <p className="text-gray-400 mt-1">Set and track your spending limits</p>
          </div>
          <MonthFilter />
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Total Budgeted</p>
            <p className="text-white text-2xl font-bold">{formatCurrency(totalBudgeted)}</p>
          </div>
          <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Total Spent</p>
            <p className="text-rose-400 text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Over Budget</p>
            <p className={`text-2xl font-bold ${overBudgetCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {overBudgetCount} {overBudgetCount === 1 ? 'category' : 'categories'}
            </p>
          </div>
        </div>

        {/* Budget cards grid */}
        <div>
          <h2 className="text-white font-semibold mb-4">Expense Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORIES.expense.map((category) => (
              <BudgetCard
                key={category}
                category={category}
                budgetAmount={getBudgetAmount(category)}
                spentAmount={getSpentAmount(category)}
                onSetBudget={handleSetBudget}
              />
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default Budgets