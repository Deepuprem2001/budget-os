import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../lib/utils'
import { CATEGORY_COLORS } from '../../types/index'

function PDFReport({ month, year }) {
  const transactions = useBudgetStore((state) => state.transactions)
  const budgets = useBudgetStore((state) => state.budgets)
  const goals = useBudgetStore((state) => state.goals)
  const debts = useBudgetStore((state) => state.debts)
  const assets = useBudgetStore((state) => state.assets)

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  // Filter transactions for this month
  const monthTransactions = transactions.filter((t) => {
    const date = new Date(t.date)
    return date.getMonth() + 1 === month && date.getFullYear() === year
  })

  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = monthTransactions
    .filter((t) => t.type === 'expense' && t.category !== 'Savings')
    .reduce((sum, t) => sum + t.amount, 0)

  const netBalance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0
    ? Math.round((netBalance / totalIncome) * 100)
    : 0

  // Category breakdown
  const categoryBreakdown = [...new Set(
    monthTransactions
      .filter((t) => t.type === 'expense' && t.category !== 'Savings')
      .map((t) => t.category)
  )].map((cat) => ({
    category: cat,
    amount: monthTransactions
      .filter((t) => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0),
  })).sort((a, b) => b.amount - a.amount)

  // Budgets for this month
  const monthBudgets = budgets.filter(
    (b) => b.month === month && b.year === year
  )

  // Net worth
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0)
  const totalLiabilities = debts.reduce((sum, d) => sum + d.remainingAmount, 0)
  const netWorth = totalAssets - totalLiabilities

  return (
    <div
      id="pdf-report"
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        width: '800px',
        backgroundColor: '#ffffff',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        color: '#111827',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          FinSight Financial Report
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
          {MONTH_NAMES[month - 1]} {year}
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Total Income', value: formatCurrency(totalIncome), color: '#059669' },
          { label: 'Total Expenses', value: formatCurrency(totalExpenses), color: '#dc2626' },
          { label: 'Net Balance', value: formatCurrency(netBalance), color: netBalance >= 0 ? '#7c3aed' : '#dc2626' },
          { label: 'Savings Rate', value: `${savingsRate}%`, color: '#2563eb' },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}
          >
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px 0' }}>{card.label}</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: card.color, margin: 0 }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
          Transactions ({monthTransactions.length})
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              {['Date', 'Description', 'Category', 'Type', 'Amount'].map((h) => (
                <th key={h} style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthTransactions.map((t, i) => (
              <tr
                key={t.id}
                style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}
              >
                <td style={{ padding: '8px 12px', fontSize: '12px', color: '#374151' }}>
                  {new Date(t.date).toLocaleDateString('en-GB')}
                </td>
                <td style={{ padding: '8px 12px', fontSize: '12px', color: '#111827', fontWeight: '500' }}>
                  {t.description}
                </td>
                <td style={{ padding: '8px 12px', fontSize: '12px', color: '#374151' }}>
                  {t.category}
                </td>
                <td style={{ padding: '8px 12px', fontSize: '12px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: t.type === 'income' ? '#d1fae5' : '#fee2e2',
                    color: t.type === 'income' ? '#065f46' : '#991b1b',
                  }}>
                    {t.type}
                  </span>
                </td>
                <td style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: t.type === 'income' ? '#059669' : '#dc2626',
                  textAlign: 'right',
                }}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
            Spending by Category
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {categoryBreakdown.map((cat) => {
              const pct = totalExpenses > 0
                ? Math.round((cat.amount / totalExpenses) * 100)
                : 0
              return (
                <div key={cat.category} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: CATEGORY_COLORS[cat.category] || '#6b7280',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '12px', color: '#374151', flex: 1 }}>
                    {cat.category}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{pct}%</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827' }}>
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Budgets */}
      {monthBudgets.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
            Budget Performance
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                {['Category', 'Budget', 'Spent', 'Remaining', 'Status'].map((h) => (
                  <th key={h} style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthBudgets.map((b, i) => {
                const spent = monthTransactions
                  .filter((t) => t.type === 'expense' && t.category === b.category)
                  .reduce((sum, t) => sum + t.amount, 0)
                const remaining = b.amount - spent
                const isOver = spent > b.amount
                return (
                  <tr key={b.id} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                    <td style={{ padding: '8px 12px', fontSize: '12px', color: '#111827', fontWeight: '500' }}>
                      {b.category}
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '12px', color: '#374151' }}>
                      {formatCurrency(b.amount)}
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '12px', color: '#374151' }}>
                      {formatCurrency(spent)}
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: isOver ? '#dc2626' : '#059669' }}>
                      {isOver ? '-' : '+'}{formatCurrency(Math.abs(remaining))}
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: isOver ? '#fee2e2' : '#d1fae5',
                        color: isOver ? '#991b1b' : '#065f46',
                      }}>
                        {isOver ? 'Over budget' : 'On track'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Net Worth Summary */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
          Net Worth Summary
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Total Assets', value: formatCurrency(totalAssets), color: '#059669' },
            { label: 'Total Liabilities', value: formatCurrency(totalLiabilities), color: '#dc2626' },
            { label: 'Net Worth', value: formatCurrency(netWorth), color: netWorth >= 0 ? '#7c3aed' : '#dc2626' },
          ].map((item) => (
            <div key={item.label} style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px 0' }}>{item.label}</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: item.color, margin: 0 }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Goals summary */}
      {goals.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
            Financial Goals
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                {['Goal', 'Target', 'Saved', 'Progress', 'Status'].map((h) => (
                  <th key={h} style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {goals.map((g, i) => {
                const pct = Math.round((g.currentAmount / g.targetAmount) * 100)
                return (
                  <tr key={g.id} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                    <td style={{ padding: '8px 12px', fontSize: '12px', color: '#111827', fontWeight: '500' }}>
                      {g.emoji} {g.name}
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '12px', color: '#374151' }}>
                      {formatCurrency(g.targetAmount)}
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '12px', color: '#374151' }}>
                      {formatCurrency(g.currentAmount)}
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '12px', color: '#374151' }}>
                      {pct}%
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: g.completed ? '#d1fae5' : '#ede9fe',
                        color: g.completed ? '#065f46' : '#5b21b6',
                      }}>
                        {g.completed ? 'Completed' : 'In progress'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
          Generated by FinSight
        </p>
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

    </div>
  )
}

export default PDFReport