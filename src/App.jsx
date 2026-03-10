import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/layout/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/transactions" element={
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      } />
      <Route path="/budgets" element={
        <ProtectedRoute>
          <Budgets />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App