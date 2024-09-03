import mongoose from 'mongoose';

const noteFolderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const NoteFolder = mongoose.model('NoteFolder', noteFolderSchema);
export default NoteFolder;
