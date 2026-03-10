import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for AI responses
});

export const summarizeNotes = async (text) => {
  const response = await api.post('/summarize', { text });
  return response.data.summary;
};

export const generateQuiz = async (text, subject, questionCount = 5) => {
  const response = await api.post('/quiz', { text, subject, questionCount });
  return response.data.quiz;
};

export const askQuestion = async (question, context) => {
  const response = await api.post('/ask', { question, context });
  return response.data.answer;
};

export default api;
