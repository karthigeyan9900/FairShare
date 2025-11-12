import { useState } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
  existingUsers: string[];
}

export default function Login({ onLogin, existingUsers }: LoginProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  const handleExistingUserLogin = (user: string) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl shadow-2xl border border-white/20">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">💰</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white">FairShare</h1>
              <p className="text-sm text-purple-200">Expense Tracker</p>
            </div>
          </div>
        </div>

        {/* Existing Users */}
        {existingUsers.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>👤</span>
              Welcome Back!
            </h2>
            <p className="text-purple-200 text-sm mb-4">Select your account to continue</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {existingUsers.map(user => (
                <button
                  key={user}
                  onClick={() => handleExistingUserLogin(user)}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 hover:border-white/30 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 text-left font-semibold text-white">{user}</span>
                  <span className="text-white/60 group-hover:text-white transition-colors">→</span>
                </button>
              ))}
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-purple-200 font-medium">OR</span>
              </div>
            </div>
          </div>
        )}

        {/* New User / Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {existingUsers.length > 0 ? 'Create New Account' : 'Get Started'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {existingUsers.length > 0 
              ? 'Enter your name to create a new account' 
              : 'Enter your name to start tracking expenses'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., John Doe"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {existingUsers.length > 0 ? 'Create Account' : 'Continue'} →
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              🔒 Your data is stored locally on your device
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-purple-200 text-sm">
            Each user has their own separate groups and expenses
          </p>
        </div>
      </div>
    </div>
  );
}
