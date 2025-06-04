import express from "express"
import Vault from "../models/vaultSchema.js"
import VaultFolder from "../models/vaultFolderSchema.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import mongoose from "mongoose"

const router = express.Router()

// Validation middleware
const validateVaultData = (req, res, next) => {
  const { name, username, password } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Vault name is required" })
  }

  if (!username || !username.trim()) {
    return res.status(400).json({ message: "Username is required" })
  }

  if (!password || !password.trim()) {
    return res.status(400).json({ message: "Password is required" })
  }

  next()
}

// Create a new vault folder
router.post("/folders", verifyToken, async (req, res) => {
  try {
    const { folderName } = req.body
    const userId = req.decodedToken.id

    if (!folderName || !folderName.trim()) {
      return res.status(400).json({ message: "Folder name is required" })
    }

    // Check if folder with same name already exists for this user
    const existingFolder = await VaultFolder.findOne({
      user: userId,
      folderName: folderName.trim(),
    })

    if (existingFolder) {
      return res.status(409).json({ message: "Folder with this name already exists" })
    }

    const newFolder = new VaultFolder({
      user: userId,
      folderName: folderName.trim(),
    })

    await newFolder.save()
    res.status(201).json(newFolder)
  } catch (error) {
    console.error("Error creating vault folder:", error)
    res.status(500).json({ message: "Failed to create vault folder" })
  }
})

// Get all vault folders for a user
router.get("/folders", verifyToken, async (req, res) => {
  try {
    const userId = req.decodedToken.id

    const folders = await VaultFolder.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "vaults",
          localField: "_id",
          foreignField: "vaultFolder",
          as: "vaults",
        },
      },
      {
        $addFields: {
          vaultCount: { $size: "$vaults" },
        },
      },
      {
        $project: {
          _id: 1,
          folderName: 1,
          createdAt: 1,
          updatedAt: 1,
          vaultCount: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ])

    res.status(200).json(folders)
  } catch (error) {
    console.error("Error fetching vault folders:", error)
    res.status(500).json({ message: "Failed to fetch vault folders" })
  }
})

// Edit a vault folder
router.put("/folders/:folderId", verifyToken, async (req, res) => {
  try {
    const { folderId } = req.params
    const { folderName } = req.body
    const userId = req.decodedToken.id

    if (!folderName || !folderName.trim()) {
      return res.status(400).json({ message: "Folder name is required" })
    }

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: "Invalid folder ID" })
    }

    // Check if another folder with same name exists
    const existingFolder = await VaultFolder.findOne({
      user: userId,
      folderName: folderName.trim(),
      _id: { $ne: folderId },
    })

    if (existingFolder) {
      return res.status(409).json({ message: "Folder with this name already exists" })
    }

    const updatedFolder = await VaultFolder.findOneAndUpdate(
      { _id: folderId, user: userId },
      {
        folderName: folderName.trim(),
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!updatedFolder) {
      return res.status(404).json({ message: "Vault folder not found" })
    }

    res.status(200).json(updatedFolder)
  } catch (error) {
    console.error("Error updating vault folder:", error)
    res.status(500).json({ message: "Failed to update vault folder" })
  }
})

// Delete a vault folder
router.delete("/folders/:folderId", verifyToken, async (req, res) => {
  try {
    const { folderId } = req.params
    const userId = req.decodedToken.id

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: "Invalid folder ID" })
    }

    // Start a transaction to ensure data consistency
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const deletedFolder = await VaultFolder.findOneAndDelete({ _id: folderId, user: userId }, { session })

      if (!deletedFolder) {
        await session.abortTransaction()
        return res.status(404).json({ message: "Vault folder not found" })
      }

      // Delete all vaults in this folder
      await Vault.deleteMany({ vaultFolder: folderId }, { session })

      await session.commitTransaction()
      res.status(200).json({ message: "Vault folder and its vaults deleted successfully" })
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  } catch (error) {
    console.error("Error deleting vault folder:", error)
    res.status(500).json({ message: "Failed to delete vault folder" })
  }
})

// Create a new vault in a specific folder
router.post("/vaults", verifyToken, validateVaultData, async (req, res) => {
  try {
    const { vaultFolderId, name, URL, username, password, notes } = req.body
    const userId = req.decodedToken.id

    // Validate folder exists and belongs to user
    if (vaultFolderId) {
      if (!mongoose.Types.ObjectId.isValid(vaultFolderId)) {
        return res.status(400).json({ message: "Invalid folder ID" })
      }

      const folder = await VaultFolder.findOne({ _id: vaultFolderId, user: userId })
      if (!folder) {
        return res.status(404).json({ message: "Vault folder not found" })
      }
    }

    const newVault = new Vault({
      user: userId,
      vaultFolder: vaultFolderId || null,
      name: name.trim(),
      URL: URL ? URL.trim() : "",
      username: username.trim(),
      password: password,
      notes: notes ? notes.trim() : "",
    })

    await newVault.save()

    // Return decrypted vault data
    const decryptedVault = newVault.decryptFields()
    res.status(201).json(decryptedVault)
  } catch (error) {
    console.error("Error creating vault:", error)
    res.status(500).json({ message: "Failed to create vault" })
  }
})

// Get all vaults in a specific folder
router.get("/vaults/:folderId", verifyToken, async (req, res) => {
  try {
    const { folderId } = req.params
    const userId = req.decodedToken.id

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: "Invalid folder ID" })
    }

    // Verify folder belongs to user
    const folder = await VaultFolder.findOne({ _id: folderId, user: userId })
    if (!folder) {
      return res.status(404).json({ message: "Vault folder not found" })
    }

    // Fetch vaults from the database
    const vaults = await Vault.find({
      vaultFolder: folderId,
      user: userId,
    }).sort({ createdAt: -1 })

    // Decrypt fields for each vault
    const decryptedVaults = Vault.decryptMultiple(vaults)

    res.status(200).json(decryptedVaults)
  } catch (error) {
    console.error("Error fetching vaults:", error)
    res.status(500).json({ message: "Failed to fetch vaults" })
  }
})

// Edit a vault
router.put("/vaults/:vaultId", verifyToken, validateVaultData, async (req, res) => {
  try {
    const { vaultId } = req.params
    const { name, URL, username, password, notes } = req.body
    const userId = req.decodedToken.id

    if (!mongoose.Types.ObjectId.isValid(vaultId)) {
      return res.status(400).json({ message: "Invalid vault ID" })
    }

    const updatedVault = await Vault.findOneAndUpdate(
      { _id: vaultId, user: userId },
      {
        name: name.trim(),
        URL: URL ? URL.trim() : "",
        username: username.trim(),
        password: password,
        notes: notes ? notes.trim() : "",
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!updatedVault) {
      return res.status(404).json({ message: "Vault not found" })
    }

    // Return decrypted vault data
    const decryptedVault = updatedVault.decryptFields()
    res.status(200).json(decryptedVault)
  } catch (error) {
    console.error("Error updating vault:", error)
    res.status(500).json({ message: "Failed to update vault" })
  }
})

// Delete a vault
router.delete("/vaults/:vaultId", verifyToken, async (req, res) => {
  try {
    const { vaultId } = req.params
    const userId = req.decodedToken.id

    if (!mongoose.Types.ObjectId.isValid(vaultId)) {
      return res.status(400).json({ message: "Invalid vault ID" })
    }

    const deletedVault = await Vault.findOneAndDelete({
      _id: vaultId,
      user: userId,
    })

    if (!deletedVault) {
      return res.status(404).json({ message: "Vault not found" })
    }

    res.status(200).json({ message: "Vault deleted successfully" })
  } catch (error) {
    console.error("Error deleting vault:", error)
    res.status(500).json({ message: "Failed to delete vault" })
  }
})

// Get all vaults for a user (across all folders)
router.get("/user/vaults", verifyToken, async (req, res) => {
  try {
    const userId = req.decodedToken.id
    const { search, sortBy = "createdAt", sortOrder = "desc" } = req.query

    const query = { user: userId }

    // Add search functionality
    if (search) {
      query.name = { $regex: search, $options: "i" }
    }

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    const vaults = await Vault.find(query).populate("vaultFolder", "folderName").sort(sort)

    // Decrypt fields for each vault
    const decryptedVaults = Vault.decryptMultiple(vaults)

    res.status(200).json(decryptedVaults)
  } catch (error) {
    console.error("Error fetching user vaults:", error)
    res.status(500).json({ message: "Failed to fetch user vaults" })
  }
})

// Get vault statistics
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const userId = req.decodedToken.id

    const stats = await Vault.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalVaults: { $sum: 1 },
          vaultsThisMonth: {
            $sum: {
              $cond: [
                {
                  $gte: ["$createdAt", new Date(new Date().getFullYear(), new Date().getMonth(), 1)],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ])

    const folderCount = await VaultFolder.countDocuments({ user: userId })

    res.status(200).json({
      totalVaults: stats[0]?.totalVaults || 0,
      totalFolders: folderCount,
      vaultsThisMonth: stats[0]?.vaultsThisMonth || 0,
    })
  } catch (error) {
    console.error("Error fetching vault statistics:", error)
    res.status(500).json({ message: "Failed to fetch vault statistics" })
  }
})

export default router
