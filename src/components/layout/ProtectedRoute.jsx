import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import useBudgetStore from '../../store/useBudgetStore'

function ProtectedRoute({ children }) {
  const hasCompletedOnboarding = useBudgetStore((state) => state.hasCompletedOnboarding)

  // After real auth is connected, uncomment this:
  // const { user, loading } = useAuth()
  // if (loading) return null
  // if (!user) return <Navigate to="/" replace />

  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

export default ProtectedRoute