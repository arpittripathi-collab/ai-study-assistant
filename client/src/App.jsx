import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/AuthScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TabNav from './components/TabNav';
import UploadNotes from './components/UploadNotes';
import QuizGenerator from './components/QuizGenerator';
import VoiceQuestion from './components/VoiceQuestion';

function AppContent() {
  const { activeTab } = useApp();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-black">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="max-w-[1400px] mx-auto">
        <Header />

        <div className="flex gap-8 lg:gap-12 mt-8">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <TabNav />

            <div className="glass-card p-10 md:p-12 mt-6">
              {activeTab === 'upload' && <UploadNotes />}
              {activeTab === 'quiz' && <QuizGenerator />}
              {activeTab === 'voice' && <VoiceQuestion />}
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs opacity-40 pb-4">
          <p>StudyAI — Your AI-Powered Study Companion • Built with React + Gemini API</p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
