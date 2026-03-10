import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TabNav from './components/TabNav';
import UploadNotes from './components/UploadNotes';
import QuizGenerator from './components/QuizGenerator';
import VoiceQuestion from './components/VoiceQuestion';

function AppContent() {
  const { activeTab } = useApp();

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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
