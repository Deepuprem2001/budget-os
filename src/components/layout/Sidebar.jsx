import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  LogOut,
  User,
  Sun,
  Moon,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../hooks/useTheme'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/budgets', icon: PiggyBank, label: 'Budgets' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
]

function Sidebar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.log('Supabase signOut error:', error)
    } finally {
      navigate('/')
    }
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-800 border-r border-gray-700 flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-700">
        <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">₹</span>
        </div>
        <span className="text-white font-bold text-xl">BudgetOS</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-6 border-t border-gray-700 space-y-1">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-colors w-full"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        {/* Profile link */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <User size={20} />
          Profile
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-colors w-full"
        >
          <LogOut size={20} />
          Sign out
        </button>

      </div>
    </aside>
  )
}

export default Sidebar