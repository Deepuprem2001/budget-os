import { useState } from 'react'
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
  Menu,
  X,
  Target,
  CreditCard,
  Palette,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTheme, ACCENT_COLOURS } from '../../hooks/useTheme'
import { TrendingUp } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/budgets', icon: PiggyBank, label: 'Budgets' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/debts', icon: CreditCard, label: 'Debts' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/networth', icon: TrendingUp, label: 'Net Worth' },
]

function Sidebar() {
  const navigate = useNavigate()
  const { theme, toggleTheme, accent, setAccentColour } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAccentPicker, setShowAccentPicker] = useState(false)

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.log('Supabase signOut error:', error)
    } finally {
      navigate('/')
    }
  }

  const closeMobile = () => setMobileOpen(false)

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center accent-bg"
          >
            <span className="text-white font-bold text-lg">₿</span>
          </div>
          <span className="text-white font-bold text-xl">FinSight</span>
        </div>
        <button
          onClick={closeMobile}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={closeMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'accent-bg text-white'
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

        {/* Accent colour picker */}
        <button
          onClick={() => setShowAccentPicker((p) => !p)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-colors w-full"
        >
          <Palette size={20} />
          Accent colour
          <div
            className="ml-auto w-4 h-4 rounded-full border-2 border-gray-600"
            style={{ backgroundColor: ACCENT_COLOURS.find((c) => c.value === accent)?.primary }}
          />
        </button>

        {/* Colour swatches */}
        {showAccentPicker && (
          <div className="px-4 py-3 grid grid-cols-6 gap-2">
            {ACCENT_COLOURS.map((colour) => (
              <button
                key={colour.value}
                onClick={() => {
                  setAccentColour(colour.value)
                  setShowAccentPicker(false)
                }}
                title={colour.name}
                className={`w-7 h-7 rounded-lg transition-all hover:scale-110 ${
                  accent === colour.value
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110'
                    : ''
                }`}
                style={{ backgroundColor: colour.primary }}
              />
            ))}
          </div>
        )}

        <NavLink
          to="/profile"
          onClick={closeMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'accent-bg text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <User size={20} />
          Profile
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-colors w-full"
        >
          <LogOut size={20} />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeMobile}
        />
      )}

      <aside className={`
        lg:hidden fixed left-0 top-0 h-screen w-64 bg-gray-800 border-r border-gray-700
        flex flex-col z-50 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-gray-800 border-r border-gray-700 flex-col">
        <SidebarContent />
      </aside>
    </>
  )
}

export default Sidebar