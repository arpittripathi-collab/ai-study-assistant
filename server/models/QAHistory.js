import mongoose from 'mongoose';

const qaHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const QAHistory = mongoose.model('QAHistory', qaHistorySchema);
export default QAHistory;
