'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Key, Save, Eye, EyeOff, AlertCircle, CheckCircle, LogOut, CreditCard } from 'lucide-react'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

interface Profile {
  id: string
  email: string | null
  api_key: string | null
  free_requests_used: number
  created_at: string
  updated_at: string
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && user) {
      fetchProfile()
    }
  }, [isOpen, user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      
      const profile = data as Profile
      setProfile(profile)
      setApiKey(profile.api_key || '')
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile')
    }
  }

  const saveApiKey = async () => {
    if (!user) return

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ 
          api_key: apiKey || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage('API key saved successfully!')
      await fetchProfile()
    } catch (error: any) {
      setError('Failed to save API key')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  if (!isOpen) return null

  const freeRequestsRemaining = Math.max(0, 5 - (profile?.free_requests_used || 0))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Key className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-green-200 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Account Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Account Information</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                <strong>Email:</strong> {user?.email}
              </p>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-500" />
                <p className="text-sm text-gray-300">
                  <strong>Free requests remaining:</strong> 
                  <span className={`ml-1 ${freeRequestsRemaining > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {freeRequestsRemaining} / 5
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* API Key Management */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">OpenAI API Key</h3>
            <p className="text-sm text-gray-400 mb-3">
              Save your OpenAI API key to use when free requests are exhausted. 
              Your key is encrypted and stored securely.
            </p>
            
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-white pr-12"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={saveApiKey}
              disabled={loading}
              className="mt-3 w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save API Key
                </>
              )}
            </button>
          </div>

          {/* Sign Out */}
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
