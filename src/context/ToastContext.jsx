import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'

const TOAST_STYLES = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon_color: 'text-emerald-400',
    text: 'text-emerald-100',
  },
  error: {
    icon: XCircle,
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    icon_color: 'text-rose-400',
    text: 'text-rose-100',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon_color: 'text-amber-400',
    text: 'text-amber-100',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon_color: 'text-blue-400',
    text: 'text-blue-100',
  },
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.type] || TOAST_STYLES.success
        const Icon = style.icon
        return (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl
              backdrop-blur-sm pointer-events-auto min-w-[280px] max-w-[360px]
              animate-slide-in
              ${style.bg} ${style.border}
            `}
          >
            <Icon size={16} className={`flex-shrink-0 ${style.icon_color}`} />
            <p className={`text-sm font-medium flex-1 ${style.text}`}>
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ message, type = 'success', duration = 3000 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((prev) => [...prev, { id, message, type, duration }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}