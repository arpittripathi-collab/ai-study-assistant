const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in server/.env');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-3.0-flash' });
}

// POST /api/summarize
router.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const model = getModel();
    const prompt = `You are an expert study assistant. Summarize the following notes in a clear, well-structured format using markdown. Include:
- A brief overview paragraph
- Key concepts as bullet points
- Important definitions or formulas if any
- A "Quick Review" section at the end with the most critical takeaways

Notes:
${text}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/quiz
router.post('/quiz', async (req, res) => {
  try {
    const { text, subject, questionCount = 5 } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const model = getModel();
    const prompt = `You are an expert quiz creator for students. Based on the following study notes${subject ? ` about "${subject}"` : ''}, generate exactly ${questionCount} multiple-choice questions.

Return ONLY a valid JSON array (no markdown code blocks, no extra text) with this exact format:
[
  {
    "question": "What is...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Brief explanation of why this answer is correct"
  }
]

The "correct" field should be the zero-based index of the correct option.
Make questions that test understanding, not just memorization.

Notes:
${text}`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    // Clean up potential markdown code blocks
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const quiz = JSON.parse(responseText);
    res.json({ quiz });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ask
router.post('/ask', async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'No question provided' });
    }

    const model = getModel();
    const prompt = `You are a helpful and friendly study assistant. Answer the following question clearly and concisely.
${context ? `\nUse these study notes as context for your answer:\n${context}\n` : ''}
Question: ${question}

Provide a clear, educational answer in markdown format. If the question is about something in the notes, reference the relevant parts. If it's a general knowledge question, answer from your knowledge.`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.json({ answer });
  } catch (error) {
    console.error('Ask error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
