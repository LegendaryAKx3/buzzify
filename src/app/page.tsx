'use client';

import { useState } from 'react';
import { Sparkles, Key, Copy, CheckCircle, AlertCircle, User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';
import UserProfile from '@/components/UserProfile';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [inputText, setInputText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [freeRequestsRemaining, setFreeRequestsRemaining] = useState<number | null>(null);

  const handleBuzzify = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to buzzify');
      return;
    }

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    console.log('Making buzzify request with user:', user?.id);
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      // Get the current session to include the access token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please sign in again');
        setShowAuthModal(true);
        return;
      }

      const response = await fetch('/api/buzzify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          text: inputText,
          apiKey: apiKey,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to buzzify text');
      }

      setResult(data.result);
      setFreeRequestsRemaining(data.free_requests_remaining);
      
      if (data.used_free_request) {
        setError('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleBuzzify();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-8 border-b border-gray-800 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-green-500" />
              <h1 className="text-4xl font-bold gradient-text">Buzzify</h1>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </button>
                  {freeRequestsRemaining !== null && (
                    <div className="text-sm text-gray-400">
                      Free: {freeRequestsRemaining}/5
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            Transform your text into engaging buzzwords with AI
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {user 
              ? `Welcome back, ${user.email}! • 5 free requests, then use your own API key`
              : 'Sign up for 5 free requests • Powered by OpenAI'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {!user && (
              <div className="p-4 bg-blue-900 border border-blue-700 rounded-lg">
                <p className="text-blue-200 text-sm">
                  <User className="w-4 h-4 inline mr-2" />
                  Sign up to get 5 free buzzifications! After that, you can use your own OpenAI API key.
                </p>
              </div>
            )}

            {user && freeRequestsRemaining !== null && freeRequestsRemaining === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  OpenAI API Key (Required)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You've used all your free requests. Enter your API key or save one in your profile.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter the text you want to transform into buzzwords..."
                rows={8}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cmd/Ctrl + Enter to buzzify
              </p>
            </div>

            <button
              onClick={handleBuzzify}
              disabled={isLoading || !inputText.trim()}
              className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Buzzifying...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {user ? 'Buzzify Text' : 'Sign In to Buzzify'}
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Buzzified Text
                </label>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-sm text-green-500 hover:text-green-400 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div className="min-h-[200px] p-4 bg-gray-900 border border-gray-700 rounded-lg">
                {error && (
                  <div className="flex items-start gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                
                {result && !error && (
                  <div className="text-gray-100">
                    <p className="leading-relaxed">{result}</p>
                  </div>
                )}
                
                {!result && !error && !isLoading && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Your buzzified text will appear here...</p>
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-gray-400">Creating buzzwords...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 mt-12 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Built with Next.js, Tailwind CSS, Supabase, and OpenAI
          </p>
        </div>
      </div>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <UserProfile isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </div>
  );
}
