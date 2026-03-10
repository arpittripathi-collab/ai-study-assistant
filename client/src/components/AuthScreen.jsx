import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiBookOpen } from 'react-icons/fi';

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const action = isLogin ? login : signup;
    const result = await action(email, password);

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-black">
      <div className="glass-card w-full max-w-md p-8 md:p-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-rose-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl mb-4 shadow-xl"
            style={{ background: 'var(--gradient-primary)' }}>
            <FiBookOpen />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">StudyAI</h1>
          <p className="text-slate-500 font-medium">Your AI-Powered Study Companion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 text-sm font-medium border border-rose-200 dark:border-rose-500/20 text-center animate-fade-in-up">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2 opacity-80">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600 opacity-60">
                <FiMail />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 bg-emerald-500/5 border border-emerald-500/20 focus:border-emerald-500 focus:bg-emerald-500/10 dark:bg-emerald-500/10 dark:border-emerald-500/30"
                placeholder="student@university.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 opacity-80">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600 opacity-60">
                <FiLock />
              </div>
              <input
                type="password"
                required
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 bg-emerald-500/5 border border-emerald-500/20 focus:border-emerald-500 focus:bg-emerald-500/10 dark:bg-emerald-500/10 dark:border-emerald-500/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base mt-4 font-bold tracking-wide shadow-lg shadow-emerald-500/30 disabled:opacity-70 disabled:cursor-wait"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In to StudyAI' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm relative z-10">
          <span className="opacity-60">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
