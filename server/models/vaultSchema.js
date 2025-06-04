import mongoose from "mongoose"
import crypto from "crypto"

// Ensure proper encryption key handling
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  ? Buffer.from(process.env.ENCRYPTION_KEY, "hex")
  : crypto.randomBytes(32) // 32 bytes for AES-256

const ALGORITHM = "aes-256-cbc"

const vaultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  vaultFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VaultFolder",
    required: false,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  URL: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Helper function to encrypt data
const encryptField = (text) => {
  if (!text || text === "") return ""
  try {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY, iv)
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")
    return `${iv.toString("hex")}:${encrypted}`
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

// Helper function to decrypt data
const decryptField = (encryptedText) => {
  if (!encryptedText || encryptedText === "") return ""
  try {
    const [ivHex, encrypted] = encryptedText.split(":")
    if (!ivHex || !encrypted) return ""

    const iv = Buffer.from(ivHex, "hex")
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY, iv)
    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    return "[Decryption Failed]"
  }
}

// Pre-save middleware for encryption
vaultSchema.pre("save", function (next) {
  try {
    // Update the updatedAt field
    this.updatedAt = new Date()

    // Encrypt sensitive fields only if they are modified or new
    if (this.isModified("password") || this.isNew) {
      this.password = encryptField(this.password)
    }

    if (this.isModified("URL") || this.isNew) {
      this.URL = encryptField(this.URL)
    }

    if (this.isModified("notes") || this.isNew) {
      this.notes = encryptField(this.notes)
    }

    // Don't encrypt username as it might be needed for searches
    // but you can encrypt it if needed: this.username = encryptField(this.username);

    next()
  } catch (error) {
    console.error("Error during encryption:", error)
    next(error)
  }
})

// Method to decrypt fields for frontend consumption
vaultSchema.methods.decryptFields = function () {
  try {
    return {
      _id: this._id,
      user: this.user,
      vaultFolder: this.vaultFolder,
      name: this.name,
      URL: decryptField(this.URL),
      username: this.username, // Not encrypted in this version
      password: decryptField(this.password),
      notes: decryptField(this.notes),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  } catch (error) {
    console.error("Error during decryption:", error)
    return {
      _id: this._id,
      name: this.name,
      username: this.username,
      URL: "[Decryption Failed]",
      password: "[Decryption Failed]",
      notes: "[Decryption Failed]",
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      decryptionError: true,
    }
  }
}

// Static method to decrypt multiple vaults
vaultSchema.statics.decryptMultiple = function (vaults) {
  return vaults.map((vault) => {
    if (typeof vault.decryptFields === "function") {
      return vault.decryptFields()
    }
    // If it's a plain object, create a temporary instance
    const tempVault = new this(vault)
    return tempVault.decryptFields()
  })
}

// Add indexes for better performance
vaultSchema.index({ user: 1, vaultFolder: 1 })
vaultSchema.index({ user: 1, name: 1 })
vaultSchema.index({ createdAt: -1 })

const Vault = mongoose.models.Vault || mongoose.model("Vault", vaultSchema)
export default Vault
