import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  fileName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    default: 'General',
  },
  summary: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;
