import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateQuiz } from '../services/api';
import { FiCpu, FiLoader, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';

export default function QuizGenerator() {
  const { getFilteredNotes, activeSubject, getAllNotesText } = useApp();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);

  const handleGenerate = async () => {
    const notesText = getAllNotesText();
    if (!notesText.trim()) {
      setError('No notes found! Upload some notes first to generate a quiz.');
      return;
    }

    setLoading(true);
    setError('');
    setQuiz(null);
    setCurrentQ(0);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const result = await generateQuiz(notesText, activeSubject === 'All' ? '' : activeSubject, questionCount);
      setQuiz(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex, optionIndex) => {
    if (showResults) return;
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: optionIndex });
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const getScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) correct++;
    });
    return correct;
  };

  const getOptionClass = (qIndex, optIndex) => {
    if (!showResults) {
      return selectedAnswers[qIndex] === optIndex ? 'selected' : '';
    }
    const q = quiz[qIndex];
    if (optIndex === q.correct) return 'correct';
    if (selectedAnswers[qIndex] === optIndex && optIndex !== q.correct) return 'wrong';
    return '';
  };

  const notes = getFilteredNotes();

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-1 gradient-text">Generate Quiz</h2>
      <p className="text-sm opacity-60 mb-6">
        Test your knowledge with AI-generated quizzes from your notes
        {activeSubject !== 'All' && <span className="font-medium"> • Filtered: {activeSubject}</span>}
      </p>

      {notes.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="font-semibold mb-2">No notes uploaded yet</p>
          <p className="text-sm opacity-60">Upload some study notes first, then come back to generate a quiz!</p>
        </div>
      ) : !quiz ? (
        <div className="glass-card p-8 text-center">
          <div className="mb-4">
            <label className="text-sm font-medium opacity-70 block mb-2">Number of Questions</label>
            <select
              id="question-count"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
              }}
            >
              {[3, 5, 8, 10].map(n => (
                <option key={n} value={n}>{n} questions</option>
              ))}
            </select>
          </div>
          <p className="text-sm opacity-60 mb-4">
            {notes.length} note{notes.length > 1 ? 's' : ''} available for quiz generation
          </p>
          <button
            id="generate-quiz-btn"
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <><FiLoader className="animate-spin" /> Generating Quiz...</>
            ) : (
              <><FiCpu /> Generate Quiz</>
            )}
          </button>
        </div>
      ) : (
        <div>
          {/* Progress */}
          {!showResults && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(Object.keys(selectedAnswers).length / quiz.length) * 100}%`,
                    background: 'var(--gradient-primary)',
                  }}
                />
              </div>
              <span className="text-sm font-medium opacity-60">
                {Object.keys(selectedAnswers).length}/{quiz.length}
              </span>
            </div>
          )}

          {/* Score Card */}
          {showResults && (
            <div className="score-card mb-6 animate-fade-in-up">
              <p className="text-lg font-medium opacity-90 mb-1">Your Score</p>
              <p className="text-5xl font-extrabold mb-2">{getScore()}/{quiz.length}</p>
              <p className="text-sm opacity-80">
                {getScore() === quiz.length ? '🎉 Perfect Score!' :
                 getScore() >= quiz.length * 0.7 ? '👏 Great Job!' :
                 getScore() >= quiz.length * 0.5 ? '📖 Keep Studying!' :
                 '💪 You\'ll do better next time!'}
              </p>
              <button
                id="retake-quiz-btn"
                onClick={handleGenerate}
                className="mt-4 px-6 py-2 rounded-xl font-medium text-sm"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                <span className="flex items-center gap-2 justify-center">
                  <FiRefreshCw /> Generate New Quiz
                </span>
              </button>
            </div>
          )}

          {/* Questions */}
          {quiz.map((q, qIndex) => (
            <div key={qIndex} className="glass-card p-6 mb-4 animate-fade-in-up" style={{ animationDelay: `${qIndex * 0.05}s` }}>
              <p className="font-semibold mb-4">
                <span className="inline-flex w-7 h-7 rounded-lg items-center justify-center text-sm text-white mr-2"
                  style={{ background: 'var(--gradient-primary)' }}>
                  {qIndex + 1}
                </span>
                {q.question}
              </p>
              <div className="flex flex-col gap-2">
                {q.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    onClick={() => handleSelectAnswer(qIndex, optIndex)}
                    className={`quiz-option text-left flex items-center gap-3 ${getOptionClass(qIndex, optIndex)}`}
                  >
                    <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0"
                      style={{
                        borderColor: selectedAnswers[qIndex] === optIndex ? '#10b981' : 'rgba(16, 185, 129, 0.2)',
                        background: selectedAnswers[qIndex] === optIndex ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      }}
                    >
                      {showResults && optIndex === q.correct && <FiCheckCircle className="text-green-500" />}
                      {showResults && selectedAnswers[qIndex] === optIndex && optIndex !== q.correct && <FiXCircle className="text-red-500" />}
                      {!showResults && String.fromCharCode(65 + optIndex)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
              {showResults && q.explanation && (
                <div className="mt-3 p-3 rounded-xl text-sm" style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  borderLeft: '3px solid #10b981',
                }}>
                  💡 {q.explanation}
                </div>
              )}
            </div>
          ))}

          {/* Submit Button */}
          {!showResults && (
            <button
              id="submit-quiz-btn"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length < quiz.length}
              className="btn-primary flex items-center gap-2 mt-2"
            >
              <FiCheckCircle /> Submit Quiz
            </button>
          )}
        </div>
      )}

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
    </div>
  );
}
