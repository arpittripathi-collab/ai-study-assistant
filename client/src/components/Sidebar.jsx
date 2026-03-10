import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FiPlus, FiX, FiFilter } from 'react-icons/fi';

export default function Sidebar() {
  const { subjects, addSubject, removeSubject, activeSubject, setActiveSubject } = useApp();
  const [newSubject, setNewSubject] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newSubject.trim()) {
      addSubject(newSubject.trim());
      setNewSubject('');
    }
  };

  return (
    <aside className="glass-card p-8 sidebar-desktop" style={{ minWidth: '280px' }}>
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="text-lg" style={{ color: '#10b981' }} />
        <h2 className="font-semibold text-sm uppercase tracking-wide opacity-70">Subjects</h2>
      </div>

      {/* Add subject form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          id="subject-input"
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Add subject..."
          className="flex-1 px-3 py-2 rounded-xl text-sm border-none outline-none transition-all duration-200"
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
          }}
        />
        <button
          type="submit"
          id="add-subject-btn"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <FiPlus />
        </button>
      </form>

      {/* Subject tags */}
      <div className="flex flex-col gap-2">
        <button
          id="filter-all"
          onClick={() => setActiveSubject('All')}
          className={`subject-tag justify-center ${activeSubject === 'All' ? 'active' : ''}`}
        >
          📚 All Subjects
        </button>
        {subjects.map((subject) => (
          <div key={subject} className="flex items-center gap-1">
            <button
              onClick={() => setActiveSubject(subject)}
              className={`subject-tag flex-1 ${activeSubject === subject ? 'active' : ''}`}
            >
              {subject}
            </button>
            {subject !== 'General' && (
              <button
                onClick={() => removeSubject(subject)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-40 hover:opacity-100 hover:text-red-500 transition-all"
              >
                <FiX />
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
