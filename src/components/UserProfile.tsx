'use client'

import { useAuth } from '@/contexts/AuthContext'
import { AlertCircle, CheckCircle, LogOut, User as UserIcon } from 'lucide-react'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, signOut } = useAuth()

  if (!isOpen) return null

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-bold text-white">Account</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
            <p className="mb-2 text-sm font-medium text-gray-300">Signed in as</p>
            <p className="text-white">{user?.email}</p>
          </div>

          <div className="rounded-lg border border-green-700 bg-green-950/60 p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
              <p className="text-sm text-green-100">
                Signing in unlocks the history sidebar on this device.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-blue-700 bg-blue-950/60 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-300" />
              <p className="text-sm text-blue-100">
                Generation history is stored only in this browser. It does not sync between
                devices or accounts.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
