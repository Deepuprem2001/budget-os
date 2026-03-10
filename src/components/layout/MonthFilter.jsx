import useBudgetStore from '../../store/useBudgetStore'
import { getMonths, getYears } from '../../lib/utils'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

function MonthFilter() {
  const filterMonth = useBudgetStore((state) => state.filterMonth)
  const filterYear = useBudgetStore((state) => state.filterYear)
  const setFilterMonth = useBudgetStore((state) => state.setFilterMonth)
  const setFilterYear = useBudgetStore((state) => state.setFilterYear)

  const months = getMonths()
  const years = getYears()

  const handlePrev = () => {
    if (filterMonth === 1) {
      setFilterMonth(12)
      setFilterYear(filterYear - 1)
    } else {
      setFilterMonth(filterMonth - 1)
    }
  }

  const handleNext = () => {
    if (filterMonth === 12) {
      setFilterMonth(1)
      setFilterYear(filterYear + 1)
    } else {
      setFilterMonth(filterMonth + 1)
    }
  }

  const currentMonthLabel = months.find((m) => m.value === filterMonth)?.label

  return (
    <div className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/60 rounded-2xl p-1.5 backdrop-blur-sm">
      
      {/* Calendar icon */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-r border-gray-700/60">
        <Calendar size={14} className="text-violet-400" />
        <span className="text-gray-400 text-xs font-medium">Period</span>
      </div>

      {/* Prev button */}
      <button
        onClick={handlePrev}
        className="w-7 h-7 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all"
      >
        <ChevronLeft size={14} />
      </button>

      {/* Month select */}
      <select
        value={filterMonth}
        onChange={(e) => setFilterMonth(Number(e.target.value))}
        className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
      >
        {months.map((m) => (
          <option key={m.value} value={m.value} className="bg-gray-800">
            {m.label}
          </option>
        ))}
      </select>

      {/* Year select */}
      <select
        value={filterYear}
        onChange={(e) => setFilterYear(Number(e.target.value))}
        className="bg-transparent text-violet-400 text-sm font-semibold focus:outline-none cursor-pointer"
      >
        {years.map((y) => (
          <option key={y} value={y} className="bg-gray-800">
            {y}
          </option>
        ))}
      </select>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="w-7 h-7 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all"
      >
        <ChevronRight size={14} />
      </button>

    </div>
  )
}

export default MonthFilter