import { useState } from 'react'
import Layout from '../components/layout/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import useBudgetStore from '../store/useBudgetStore'
import { CURRENCIES } from '../types/index'
import {
  User,
  Mail,
  Lock,
  Trash2,
  Save,
  Camera,
} from 'lucide-react'
import PageWrapper from '../components/ui/PageWrapper'

function Profile() {
  const { user } = useAuth()
  const { user: mockUser } = useBudgetStore()

  const currentUser = user || mockUser

  const [fullName, setFullName] = useState(
    currentUser?.user_metadata?.full_name || ''
  )
  const [currency, setCurrency] = useState('GBP')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      showMessage('Please enter your full name', 'error')
      return
    }
    setLoading(true)
    try {
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      })
      showMessage('Profile updated successfully!')
    } catch (error) {
      showMessage('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showMessage('Please fill in all password fields', 'error')
      return
    }
    if (newPassword !== confirmPassword) {
      showMessage('Passwords do not match', 'error')
      return
    }
    if (newPassword.length < 6) {
      showMessage('Password must be at least 6 characters', 'error')
      return
    }
    setLoading(true)
    try {
      await supabase.auth.updateUser({ password: newPassword })
      showMessage('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      showMessage('Failed to update password', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      showMessage('Please type DELETE to confirm', 'error')
      return
    }
    setLoading(true)
    try {
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      showMessage('Failed to delete account', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Get initials for avatar placeholder
  const getInitials = () => {
    const name = fullName || currentUser?.email || 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Layout>
      <PageWrapper>
      <div className="max-w-2xl space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account settings</p>
        </div>

        {/* Notification */}
        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === 'error'
              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Avatar & Name */}
        <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <User size={18} className="accent-text" />
            <h2 className="text-white font-semibold">Personal Info</h2>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gray-700/40 border border-gray-700 flex items-center justify-center">
                  <span className="accent-text text-2xl font-bold">
                    {getInitials()}
                  </span>
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 w-7 h-7 accent-bg rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                <Camera size={13} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="text-white font-medium">{fullName || 'Your Name'}</p>
              <p className="text-gray-500 text-sm">{currentUser?.email}</p>
            </div>
          </div>

          {/* Full name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus  transition-colors"
              placeholder="Your full name"
            />
          </div>

          {/* Currency */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Preferred currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus  transition-colors"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-gray-800">
                  {c.symbol} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="flex items-center gap-2 accent-bg disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Save size={16} />
            Save changes
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} className="accent-text" />
            <h2 className="text-white font-semibold">Change Password</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus  transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none accent-focus  transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={loading}
            className="flex items-center gap-2 accent-bg disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Lock size={16} />
            Update password
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-800/40 border border-rose-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Trash2 size={18} className="text-rose-400" />
            <h2 className="text-white font-semibold">Danger Zone</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Once you delete your account all your data will be permanently removed.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <Trash2 size={16} />
              Delete account
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-rose-400 text-sm font-medium">
                Type DELETE to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-gray-900/60 border border-rose-500/30 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-gray-700/60 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || loading}
                  className="flex items-center gap-2 bg-rose-500/80 hover:bg-rose-500 disabled:bg-rose-900 disabled:text-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  <Trash2 size={16} />
                  Confirm delete
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
      </PageWrapper>
    </Layout>
  )
}

export default Profile