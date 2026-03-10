import { useApp } from '../context/AppContext';
import { FiUpload, FiCpu, FiMic } from 'react-icons/fi';

const tabs = [
  { id: 'upload', label: 'Upload Notes', icon: <FiUpload /> },
  { id: 'quiz', label: 'Quiz', icon: <FiCpu /> },
  { id: 'voice', label: 'Voice Q&A', icon: <FiMic /> },
];

export default function TabNav() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="flex gap-2 mb-6 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          onClick={() => setActiveTab(tab.id)}
          className={`tab-btn flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
