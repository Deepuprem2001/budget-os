import { useState } from 'react'
import Layout from '../components/layout/Layout'
import PageWrapper from '../components/ui/PageWrapper'
import useBudgetStore from '../store/useBudgetStore'
import { formatCurrency } from '../lib/utils'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts'
import {
  Plus, Trash2, X, TrendingUp,
  TrendingDown, Wallet, Save,
} from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { motion } from 'framer-motion'
import { containerVariants, cardVariants } from '../lib/animations'

const ASSET_CATEGORIES = [
  { label: 'Cash & Savings', emoji: '🏦', value: 'Cash' },
  { label: 'Investments', emoji: '📈', value: 'Investments' },
  { label: 'Property', emoji: '🏠', value: 'Property' },
  { label: 'Vehicle', emoji: '🚗', value: 'Vehicle' },
  { label: 'Pension', emoji: '👴', value: 'Pension' },
  { label: 'Other', emoji: '💰', value: 'Other' },
]

function NetWorth() {
  const assets = useBudgetStore((state) => state.assets)
  const debts = useBudgetStore((state) => state.debts)
  const netWorthHistory = useBudgetStore((state) => state.netWorthHistory)
  const addAsset = useBudgetStore((state) => state.addAsset)
  const updateAsset = useBudgetStore((state) => state.updateAsset)
  const deleteAsset = useBudgetStore((state) => state.deleteAsset)
  const saveNetWorthSnapshot = useBudgetStore((state) => state.saveNetWorthSnapshot)
  const { addToast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cash',
    emoji: '🏦',
    value: '',
  })

  // Calculations
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0)
  const totalLiabilities = debts.reduce((sum, d) => sum + d.remainingAmount, 0)
  const netWorth = totalAssets - totalLiabilities
  const isPositive = netWorth >= 0

  // Group assets by category
  const assetsByCategory = ASSET_CATEGORIES.map((cat) => ({
    ...cat,
    assets: assets.filter((a) => a.category === cat.value),
    total: assets
      .filter((a) => a.category === cat.value)
      .reduce((sum, a) => sum + a.value, 0),
  })).filter((cat) => cat.assets.length > 0)

  // Chart data
  const chartData = netWorthHistory.map((h) => ({
    month: h.month,
    'Net Worth': h.netWorth,
    Assets: h.assets,
    Liabilities: h.liabilities,
  }))

  const handleAddAsset = () => {
    if (!formData.name || !formData.value) return
    addAsset({
      ...formData,
      value: parseFloat(formData.value),
    })
    addToast({ message: `${formData.name} added to assets`, type: 'success' })
    setFormData({ name: '', category: 'Cash', emoji: '🏦', value: '' })
    setShowForm(false)
  }

  const handleUpdateValue = (id) => {
    const value = parseFloat(editValue)
    if (isNaN(value) || value < 0) return
    updateAsset(id, { value })
    addToast({ message: 'Asset value updated', type: 'success' })
    setEditingId(null)
    setEditValue('')
  }

  const handleSnapshot = () => {
    saveNetWorthSnapshot()
    addToast({ message: 'Net worth snapshot saved 📸', type: 'success' })
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white text-sm font-semibold mb-2">{label}</p>
          {payload.map((p) => (
            <div key={p.name} className="flex items-center justify-between gap-6 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-gray-400">{p.name}</span>
              </div>
              <span className="text-white font-medium">{formatCurrency(p.value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Layout>
      <PageWrapper>
        <div className="space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Net Worth</h1>
              <p className="text-gray-400 mt-1">Assets minus liabilities</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSnapshot}
                className="flex items-center gap-2 bg-gray-700/60 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <Save size={16} />
                Save snapshot
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 accent-bg text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <Plus size={18} />
                Add Asset
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {/* Total Assets */}
            <motion.div
              variants={cardVariants}
              className="bg-gradient-to-br from-emerald-500/20 to-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} className="text-emerald-400" />
                </div>
                <span className="text-emerald-400 text-sm font-medium">Total Assets</span>
              </div>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalAssets)}</p>
              <p className="text-emerald-400/60 text-xs mt-1">
                {assets.length} asset{assets.length !== 1 ? 's' : ''} tracked
              </p>
            </motion.div>

            {/* Total Liabilities */}
            <motion.div
              variants={cardVariants}
              className="bg-gradient-to-br from-rose-500/20 to-rose-900/10 border border-rose-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center">
                  <TrendingDown size={16} className="text-rose-400" />
                </div>
                <span className="text-rose-400 text-sm font-medium">Total Liabilities</span>
              </div>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalLiabilities)}</p>
              <p className="text-rose-400/60 text-xs mt-1">
                From {debts.length} debt{debts.length !== 1 ? 's' : ''} tracked
              </p>
            </motion.div>

            {/* Net Worth */}
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl p-6 border ${
                isPositive
                  ? 'bg-gradient-to-br from-violet-500/20 to-violet-900/10 border-violet-500/20'
                  : 'bg-gradient-to-br from-rose-500/20 to-rose-900/10 border-rose-500/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isPositive ? 'bg-violet-500/20' : 'bg-rose-500/20'
                }`}>
                  <Wallet size={16} className={isPositive ? 'accent-text' : 'text-rose-400'} />
                </div>
                <span className={`text-sm font-medium ${isPositive ? 'accent-text' : 'text-rose-400'}`}>
                  Net Worth
                </span>
              </div>
              <p className={`text-3xl font-bold ${isPositive ? 'text-white' : 'text-rose-400'}`}>
                {netWorth < 0 ? '-' : ''}{formatCurrency(Math.abs(netWorth))}
              </p>
              <p className={`text-xs mt-1 ${isPositive ? 'text-violet-400/60' : 'text-rose-400/60'}`}>
                {isPositive ? '✓ Positive net worth' : '⚠ Liabilities exceed assets'}
              </p>
            </motion.div>
          </motion.div>

          {/* Net Worth Chart */}
          {chartData.length > 0 && (
            <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">
              <div className="mb-6">
                <h2 className="text-white font-semibold text-lg">Net Worth Over Time</h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  Click "Save snapshot" monthly to track your progress
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="#374151" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="Assets" stroke="#34d399" strokeWidth={2} dot={{ r: 3, fill: '#34d399' }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Liabilities" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, fill: '#f43f5e' }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Net Worth" stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 4, fill: '#a78bfa' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                  <span className="text-gray-400 text-xs">Assets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-rose-400" />
                  <span className="text-gray-400 text-xs">Liabilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-violet-400" />
                  <span className="text-gray-400 text-xs">Net Worth</span>
                </div>
              </div>
            </div>
          )}

          {/* No snapshot yet */}
          {chartData.length === 0 && (
            <div className="bg-gray-800/40 border border-dashed border-gray-700/60 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">📸</div>
              <p className="text-gray-400 text-sm font-medium">No history yet</p>
              <p className="text-gray-600 text-xs mt-1 mb-4">
                Click "Save snapshot" to start tracking your net worth over time
              </p>
              <button
                onClick={handleSnapshot}
                className="accent-bg text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Save first snapshot
              </button>
            </div>
          )}

          {/* Assets breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Assets */}
            <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-700/60">
                <h2 className="text-white font-semibold">Assets</h2>
                <span className="text-emerald-400 text-sm font-bold">
                  {formatCurrency(totalAssets)}
                </span>
              </div>

              {assets.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-sm">No assets added yet</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-3 accent-bg text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Add your first asset
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-700/40">
                  {assetsByCategory.map((cat) => (
                    <div key={cat.value}>
                      <div className="flex items-center justify-between px-6 py-3 bg-gray-900/20">
                        <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                          {cat.emoji} {cat.label}
                        </span>
                        <span className="text-gray-400 text-xs font-semibold">
                          {formatCurrency(cat.total)}
                        </span>
                      </div>
                      {cat.assets.map((asset) => (
                        <div
                          key={asset.id}
                          className="flex items-center justify-between px-6 py-3 hover:bg-gray-700/20 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{asset.emoji}</span>
                            <p className="text-white text-sm">{asset.name}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {editingId === asset.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  autoFocus
                                  className="w-28 bg-gray-900/60 border border-gray-700 text-white rounded-lg px-2 py-1 text-sm focus:outline-none accent-focus"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleUpdateValue(asset.id)
                                    if (e.key === 'Escape') setEditingId(null)
                                  }}
                                />
                                <button
                                  onClick={() => handleUpdateValue(asset.id)}
                                  className="accent-bg text-white px-2 py-1 rounded-lg text-xs"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(asset.id)
                                  setEditValue(asset.value.toString())
                                }}
                                className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors"
                              >
                                {formatCurrency(asset.value)}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                deleteAsset(asset.id)
                                addToast({ message: `${asset.name} deleted`, type: 'success' })
                              }}
                              className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Liabilities — from debts */}
            <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-700/60">
                <div>
                  <h2 className="text-white font-semibold">Liabilities</h2>
                  <p className="text-gray-500 text-xs mt-0.5">Auto-synced from Debt Tracker</p>
                </div>
                <span className="text-rose-400 text-sm font-bold">
                  {formatCurrency(totalLiabilities)}
                </span>
              </div>

              {debts.filter((d) => d.remainingAmount > 0).length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="text-gray-500 text-sm">No outstanding debts!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700/40">
                  {debts
                    .filter((d) => d.remainingAmount > 0)
                    .map((debt) => (
                      <div
                        key={debt.id}
                        className="flex items-center justify-between px-6 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                            style={{ backgroundColor: debt.color + '20' }}
                          >
                            {debt.emoji}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{debt.name}</p>
                            <p className="text-gray-500 text-xs">{debt.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-rose-400 text-sm font-bold">
                            -{formatCurrency(debt.remainingAmount)}
                          </p>
                          <p className="text-gray-600 text-xs">{debt.interestRate}% APR</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Add Asset Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-lg">Add Asset</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ASSET_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setFormData({
                          ...formData,
                          category: cat.value,
                          emoji: cat.emoji,
                        })}
                        className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition-all ${
                          formData.category === cat.value
                            ? 'accent-bg-faint accent-border accent-text'
                            : 'bg-gray-900/40 border-gray-700/60 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Asset name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Barclays Savings, Tesla shares"
                    autoFocus
                    className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                  />
                </div>

                {/* Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Current value
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
                  />
                </div>

                <p className="text-gray-600 text-xs">
                  💡 Click on any asset value to update it anytime
                </p>

                <button
                  onClick={handleAddAsset}
                  disabled={!formData.name || !formData.value}
                  className="w-full py-3 accent-bg disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Add Asset
                </button>

              </div>
            </div>
          </div>
        )}

      </PageWrapper>
    </Layout>
  )
}

export default NetWorth