import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { summarizeNotes } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { FiUploadCloud, FiFileText, FiCheck, FiLoader } from 'react-icons/fi';

export default function UploadNotes() {
  const { subjects, addNote, activeSubject } = useApp();
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(activeSubject === 'All' ? 'General' : activeSubject);
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const result = await summarizeNotes(text);
      setSummary(result);
      addNote({
        text: text,
        summary: result,
        subject: selectedSubject,
        fileName: fileName || 'Pasted Notes',
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to summarize. Check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-1 gradient-text">Upload & Summarize Notes</h2>
      <p className="text-sm opacity-60 mb-6">Upload your study notes or paste text to get an AI-powered summary</p>

      {/* Subject selector */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block opacity-70">Subject</label>
        <select
          id="subject-selector"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer transition-all duration-200"
          style={{
            background: 'rgba(102, 126, 234, 0.08)',
            border: '1px solid rgba(102, 126, 234, 0.15)',
          }}
        >
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Upload Zone */}
      <div
        id="upload-zone"
        className={`upload-zone mb-4 ${dragging ? 'dragging' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.text"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div className="animate-float">
          <FiUploadCloud className="mx-auto text-4xl mb-3" style={{ color: '#667eea' }} />
        </div>
        <p className="font-semibold mb-1">
          {fileName ? (
            <span className="flex items-center justify-center gap-2">
              <FiFileText /> {fileName}
            </span>
          ) : (
            'Drop your notes here or click to upload'
          )}
        </p>
        <p className="text-xs opacity-50">Supports .txt and .md files</p>
      </div>

      {/* Text Area */}
      <textarea
        id="notes-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Or paste your notes here..."
        rows={6}
        className="w-full px-5 py-4 rounded-2xl text-sm outline-none resize-none transition-all duration-200"
        style={{
          background: 'rgba(102, 126, 234, 0.04)',
          border: '1px solid rgba(102, 126, 234, 0.12)',
        }}
      />

      {/* Summarize Button */}
      <button
        id="summarize-btn"
        onClick={handleSummarize}
        disabled={loading || !text.trim()}
        className="btn-primary mt-4 flex items-center gap-2"
      >
        {loading ? (
          <>
            <FiLoader className="animate-spin" /> Summarizing...
          </>
        ) : (
          <>
            <FiCheck /> Summarize Notes
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 rounded-xl text-sm" style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Summary Result */}
      {summary && (
        <div className="glass-card mt-6 p-6 animate-fade-in-up">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
              style={{ background: 'var(--gradient-success)' }}>
              ✨
            </span>
            AI Summary
          </h3>
          <div className="markdown-content">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
