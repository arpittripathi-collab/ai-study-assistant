import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { askQuestion } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { FiMic, FiMicOff, FiSend, FiLoader, FiVolume2 } from 'react-icons/fi';

export default function VoiceQuestion() {
  const { getAllNotesText } = useApp();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [history, setHistory] = useState([]);
  const recognitionRef = useRef(null);

  // Check for speech recognition support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const hasSpeechSupport = !!SpeechRecognition;

  const startRecording = () => {
    if (!hasSpeechSupport) {
      setError('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
      setError('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t;
        } else {
          interimTranscript += t;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
      if (finalTranscript) {
        setQuestion(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      if (event.error !== 'aborted') {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleAsk = async () => {
    const q = question.trim();
    if (!q) return;

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const context = getAllNotesText();
      const result = await askQuestion(q, context);
      setAnswer(result);
      setHistory(prev => [{ question: q, answer: result, time: new Date().toLocaleTimeString() }, ...prev]);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to get answer.');
    } finally {
      setLoading(false);
    }
  };

  const speakAnswer = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Strip markdown formatting for speech
      const plainText = text.replace(/[#*`_\[\]()]/g, '').replace(/\n+/g, '. ');
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-1 gradient-text">Voice Q&A</h2>
      <p className="text-sm opacity-60 mb-6">Ask questions with your voice or type — get AI-powered answers from your notes</p>

      {/* Voice Input */}
      <div className="flex flex-col items-center mb-6">
        <button
          id="mic-btn"
          onClick={isRecording ? stopRecording : startRecording}
          className={`mic-btn mb-4 ${isRecording ? 'recording animate-pulse-ring' : ''}`}
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? <FiMicOff /> : <FiMic />}
        </button>
        <p className="text-sm opacity-60">
          {isRecording ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Listening... speak your question
            </span>
          ) : hasSpeechSupport ? (
            'Tap the mic to ask a question'
          ) : (
            'Voice not supported — type your question below'
          )}
        </p>
        {transcript && isRecording && (
          <p className="mt-2 text-sm opacity-70 italic">"{transcript}"</p>
        )}
      </div>

      {/* Text Input */}
      <div className="flex gap-3 mb-6">
        <input
          id="question-input"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          className="flex-1 px-5 py-3.5 rounded-2xl text-sm outline-none transition-all duration-200"
          style={{
            background: 'rgba(79, 70, 229, 0.06)',
            border: '1px solid rgba(79, 70, 229, 0.14)',
          }}
        />
        <button
          id="ask-btn"
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiSend />}
          Ask
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-xl text-sm" style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Current Answer */}
      {answer && (
        <div className="glass-card p-6 mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                style={{ background: 'var(--gradient-success)' }}>
                🤖
              </span>
              AI Answer
            </h3>
            <button
              id="speak-answer-btn"
              onClick={() => speakAnswer(answer)}
              className="btn-secondary flex items-center gap-2 text-sm py-2 px-4"
              title="Read answer aloud"
            >
              <FiVolume2 /> Listen
            </button>
          </div>
          <div className="markdown-content">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wide opacity-50 mb-3">Previous Questions</h3>
          {history.slice(1).map((item, i) => (
            <div key={i} className="glass-card p-4 mb-3" style={{ opacity: 0.7 }}>
              <p className="text-sm font-medium mb-2">❓ {item.question}</p>
              <div className="markdown-content text-sm opacity-80">
                <ReactMarkdown>{item.answer.length > 200 ? item.answer.slice(0, 200) + '...' : item.answer}</ReactMarkdown>
              </div>
              <p className="text-xs opacity-40 mt-2">{item.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
