import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import useBudgetStore from '../../store/useBudgetStore'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const hasCompletedOnboarding = useBudgetStore((state) => state.hasCompletedOnboarding)
  const bootstrapping = useBudgetStore((state) => state.bootstrapping)

  // Still loading auth
  if (loading) return null

  // Auth loaded but no user
  if (!user) return <Navigate to="/" replace />

  // User exists but still fetching their data from Supabase
  if (bootstrapping) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">💰</div>
        <p className="text-white font-semibold text-lg">FinSight</p>
        <p className="text-gray-500 text-sm mt-2">Loading your data...</p>
      </div>
    </div>
  )

  // Data loaded — check onboarding
  if (!hasCompletedOnboarding) return <Navigate to="/onboarding" replace />

  return children
}

export default ProtectedRoute