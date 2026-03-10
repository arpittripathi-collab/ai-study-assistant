import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon, FiBookOpen, FiLogOut } from 'react-icons/fi';

export default function Header() {
  const { darkMode, toggleDarkMode } = useApp();
  const { user, logout } = useAuth();

  return (
    <header className="glass-card mb-10 px-8 py-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl"
          style={{ background: 'var(--gradient-primary)' }}>
          <FiBookOpen />
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-text">StudyAI</h1>
          <p className="text-xs opacity-60">Your AI-Powered Study Companion</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden sm:block text-sm font-medium opacity-80 mr-2">
            {user.email}
          </div>
        )}

        <button
          onClick={logout}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          title="Log out"
        >
          <FiLogOut />
        </button>

        <button
          id="dark-mode-toggle"
          onClick={toggleDarkMode}
          className="w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all duration-300 hover:scale-110"
          style={{
            background: darkMode
              ? 'rgba(250, 204, 21, 0.15)'
              : 'rgba(99, 102, 241, 0.1)',
            color: darkMode ? '#facc15' : '#6366f1',
          }}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </header>
  );
}
