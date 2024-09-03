import mongoose from 'mongoose';

const vaultFolderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folderName: {
    type: String,
    required: true
  },
  vaults: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vault'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const VaultFolder = mongoose.model('VaultFolder', vaultFolderSchema);
export default VaultFolder;
