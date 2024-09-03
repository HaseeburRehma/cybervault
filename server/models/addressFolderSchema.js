import mongoose from 'mongoose';

const addressFolderSchema = new mongoose.Schema({
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

const AddressFolder = mongoose.model('AddressFolder', addressFolderSchema);
export default AddressFolder;
