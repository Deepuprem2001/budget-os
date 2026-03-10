import { Search, X } from 'lucide-react'
import { CATEGORIES } from '../../types/index'

function SearchFilter({ search, setSearch, filterType, setFilterType, filterCategory, setFilterCategory }) {

  const hasActiveFilters = search || filterType !== 'all' || filterCategory !== 'all'

  const clearAll = () => {
    setSearch('')
    setFilterType('all')
    setFilterCategory('all')
  }

  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-4">
      <div className="flex gap-3 flex-wrap">

        {/* Search input */}
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Type filter */}
        <div className="flex gap-2">
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                filterType === type
                  ? type === 'income'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : type === 'expense'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'bg-gray-700/40 text-gray-400 border border-gray-700/60 hover:bg-gray-700/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-gray-900/60 border border-gray-700 text-gray-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
        >
          <option value="all">All categories</option>
          <optgroup label="Income" className="bg-gray-800">
            {CATEGORIES.income.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
            ))}
          </optgroup>
          <optgroup label="Expenses" className="bg-gray-800">
            {CATEGORIES.expense.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
            ))}
          </optgroup>
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-gray-700/40 border border-gray-700/60 hover:bg-gray-700/60 transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        )}

      </div>

      {/* Active filter summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700/40">
          <span className="text-gray-500 text-xs">Filtering by:</span>
          {search && (
            <span className="bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs px-2.5 py-1 rounded-full">
              "{search}"
            </span>
          )}
          {filterType !== 'all' && (
            <span className="bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs px-2.5 py-1 rounded-full capitalize">
              {filterType}
            </span>
          )}
          {filterCategory !== 'all' && (
            <span className="bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs px-2.5 py-1 rounded-full">
              {filterCategory}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchFilter