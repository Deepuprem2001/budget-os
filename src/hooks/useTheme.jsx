import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const ACCENT_COLOURS = [
  { name: 'Violet', value: 'violet', primary: '#7c3aed', light: '#8b5cf6', faint: '#7c3aed1a', border: '#7c3aed33' },
  { name: 'Blue', value: 'blue', primary: '#2563eb', light: '#3b82f6', faint: '#2563eb1a', border: '#2563eb33' },
  { name: 'Emerald', value: 'emerald', primary: '#059669', light: '#10b981', faint: '#0596691a', border: '#05966933' },
  { name: 'Rose', value: 'rose', primary: '#e11d48', light: '#f43f5e', faint: '#e11d481a', border: '#e11d4833' },
  { name: 'Amber', value: 'amber', primary: '#d97706', light: '#f59e0b', faint: '#d977061a', border: '#d9770633' },
  { name: 'Cyan', value: 'cyan', primary: '#0891b2', light: '#06b6d4', faint: '#0891b21a', border: '#0891b233' },
]

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('budget-os-theme') || 'dark'
  })

  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('budget-os-accent') || 'violet'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    localStorage.setItem('budget-os-theme', theme)
  }, [theme])

  useEffect(() => {
    const colour = ACCENT_COLOURS.find((c) => c.value === accent) || ACCENT_COLOURS[0]
    const root = document.documentElement
    root.style.setProperty('--accent-primary', colour.primary)
    root.style.setProperty('--accent-light', colour.light)
    root.style.setProperty('--accent-faint', colour.faint)
    root.style.setProperty('--accent-border', colour.border)
    localStorage.setItem('budget-os-accent', accent)
  }, [accent])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setAccentColour = (value) => setAccent(value)

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, setAccentColour }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}