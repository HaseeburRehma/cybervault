import mongoose from 'mongoose';
import crypto from 'crypto';

// Ensure that you define an encryption key in your environment variables
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'utf-8'); // Use Buffer from your 32-byte key
const ALGORITHM = 'aes-256-cbc'; // AES encryption algorithm

const vaultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vaultFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VaultFolder',
    required: false
  },
  name: {
    type: String,
    required: true
  },
  URL: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt sensitive fields before saving to the database
vaultSchema.pre('save', function(next) {
  try {
    const encryptField = (field) => {
      if (field) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(field, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`;
      }
      return field;
    };

    if (this.isModified('password') || this.isNew) {
      this.password = encryptField(this.password);
      console.log('Encrypted password:', this.password);
    }

    if (this.isModified('URL') || this.isNew) {
      this.URL = encryptField(this.URL);
      console.log('Encrypted URL:', this.URL);
    }

    if (this.isModified('notes') || this.isNew) {
      this.notes = encryptField(this.notes);
      console.log('Encrypted notes:', this.notes);
    }

    next();
  } catch (error) {
    console.error('Error during encryption:', error);
    next(error);
  }
});

// Decrypt fields
vaultSchema.methods.decryptFields = function() {
  try {
    const decryptField = (encryptedField) => {
      if (encryptedField) {
        const [iv, encrypted] = encryptedField.split(':');
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      }
      return '';
    };

    return {
      _id: this._id,
      name: this.name,
      URL: decryptField(this.URL),
      username: this.username,
      password: decryptField(this.password),
      notes: decryptField(this.notes)
    };
  } catch (error) {
    console.error('Error during decryption:', error);
    return {}; // Return an empty object or handle the error as needed
  }
};

const Vault = mongoose.models.Vault || mongoose.model('Vault', vaultSchema);
export default Vault;
