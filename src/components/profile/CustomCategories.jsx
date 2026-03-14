import { useState } from 'react'
import useBudgetStore from '../../store/useBudgetStore'
import { CATEGORIES, CATEGORY_COLORS } from '../../types/index'
import { Plus, X, Tag } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const DEFAULT_COLORS = [
  '#f97316', '#eab308', '#3b82f6', '#ec4899',
  '#a855f7', '#06b6d4', '#84cc16', '#f59e0b',
  '#10b981', '#6b7280', '#ef4444', '#8b5cf6',
]

function CustomCategories() {
  const customCategories = useBudgetStore((state) => state.customCategories)
  const addCustomCategory = useBudgetStore((state) => state.addCustomCategory)
  const deleteCustomCategory = useBudgetStore((state) => state.deleteCustomCategory)
  const { addToast } = useToast()

  const [activeTab, setActiveTab] = useState('expense')
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#8b5cf6')

  const handleAdd = () => {
    const name = newName.trim()
    if (!name) return

    const allExisting = [
      ...CATEGORIES[activeTab],
      ...customCategories[activeTab],
    ].map((c) => c.toLowerCase())

    if (allExisting.includes(name.toLowerCase())) {
      addToast({ message: 'Category already exists', type: 'error' })
      return
    }

    // Store color for new category
    CATEGORY_COLORS[name] = newColor

    addCustomCategory(activeTab, name)
    addToast({ message: `"${name}" category added`, type: 'success' })
    setNewName('')
  }

  const handleDelete = (type, name) => {
    deleteCustomCategory(type, name)
    addToast({ message: `"${name}" category deleted`, type: 'success' })
  }

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Tag size={18} className="accent-text" />
        <h2 className="text-white font-semibold">Custom Categories</h2>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-gray-900/60 p-1 rounded-xl mb-6 w-fit">
        {['expense', 'income'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'accent-bg text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Default categories */}
      <div className="mb-4">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3">
          Default categories
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES[activeTab].map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-700/40 border border-gray-700/60 text-gray-400"
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[cat] || '#6b7280' }}
              />
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Custom categories */}
      {customCategories[activeTab].length > 0 && (
        <div className="mb-6">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3">
            Your custom categories
          </p>
          <div className="flex flex-wrap gap-2">
            {customCategories[activeTab].map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: (CATEGORY_COLORS[cat] || '#8b5cf6') + '20',
                  borderColor: (CATEGORY_COLORS[cat] || '#8b5cf6') + '40',
                  color: CATEGORY_COLORS[cat] || '#8b5cf6',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[cat] || '#8b5cf6' }}
                />
                {cat}
                <button
                  onClick={() => handleDelete(activeTab, cat)}
                  className="ml-1 hover:opacity-60 transition-opacity"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new category */}
      <div className="border-t border-gray-700/40 pt-5">
        <p className="text-gray-400 text-xs font-medium mb-3">
          Add a new {activeTab} category
        </p>

        {/* Color picker */}
        <div className="flex flex-wrap gap-2 mb-3">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setNewColor(color)}
              className={`w-6 h-6 rounded-lg transition-all hover:scale-110 ${
                newColor === color
                  ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-800 scale-110'
                  : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-2 flex-1 bg-gray-900/60 border border-gray-700 rounded-xl px-3 py-2.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: newColor }}
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`e.g. ${activeTab === 'expense' ? 'Gym, Coffee, Pet care' : 'Dividends, Gift'}`}
              className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              maxLength={20}
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="flex items-center gap-1.5 accent-bg disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
        <p className="text-gray-600 text-xs mt-2">
          Max 20 characters. Custom categories can be deleted anytime.
        </p>
      </div>

    </div>
  )
}

export default CustomCategories