import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [registered, setRegistered] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

if (registered) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-6">📧</div>
        <h1 className="text-2xl font-bold text-white mb-3">Check your email!</h1>
        <p className="text-gray-400 mb-2">
          We've sent a confirmation link to
        </p>
        <p className="text-white font-semibold mb-6">{email}</p>
        <p className="text-gray-500 text-sm">
          Click the link in the email to confirm your account and get started.
        </p>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 accent-bg rounded-xl mb-4">
            <span className="text-white text-xl font-bold">₿</span>
          </div>
          <h1 className="text-3xl font-bold text-white">FinSight</h1>
          <p className="text-gray-400 mt-2">Create your account to get started</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">

          {/* Error message */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Smith"
                required
                className="w-full bg-gray-900 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-gray-900 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-gray-900 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none accent-focus transition-colors"
              />
              <p className="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full accent-bg disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

          </form>

          {/* Login link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/" className="accent-text hover:opacity-80 font-medium">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Register