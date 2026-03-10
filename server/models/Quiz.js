import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  subject: {
    type: String,
    required: true,
  },
  questions: [{
    questionText: String,
    options: [String],
    correct: Number,
    explanation: String
  }],
  score: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
