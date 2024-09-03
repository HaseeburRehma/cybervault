import express from 'express';
import Vault from '../models/vaultSchema.js';
import VaultFolder from '../models/vaultFolderSchema.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new vault folder
router.post('/folders', verifyToken, async (req, res) => {
  try {
    const { folderName } = req.body;
    const userId = req.decodedToken.id;

    const newFolder = new VaultFolder({
      user: userId,
      folderName
    });

    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (error) {
    console.error('Error creating vault folder:', error);
    res.status(500).json({ message: 'Failed to create vault folder' });
  }
});

// Get all vault folders for a user
router.get('/folders', verifyToken, async (req, res) => {
  try {
    const userId = req.decodedToken.id;
    const folders = await VaultFolder.find({ user: userId }).populate({
      path: 'vaults',
      select: '_id'
    });

    // Map folders to include the vault count
    const foldersWithCount = folders.map(folder => ({
      ...folder.toObject(),
      vaultCount: folder.vaults.length
    }));

    res.status(200).json(foldersWithCount);
  } catch (error) {
    console.error('Error fetching vault folders:', error);
    res.status(500).json({ message: 'Failed to fetch vault folders' });
  }
});

// Edit a vault folder
router.put('/folders/:folderId', verifyToken, async (req, res) => {
  try {
    const { folderId } = req.params;
    const { folderName } = req.body;
    const userId = req.decodedToken.id;

    const updatedFolder = await VaultFolder.findOneAndUpdate(
      { _id: folderId, user: userId },
      { folderName },
      { new: true }
    );

    if (!updatedFolder) {
      return res.status(404).json({ message: 'Vault folder not found' });
    }

    res.status(200).json(updatedFolder);
  } catch (error) {
    console.error('Error updating vault folder:', error);
    res.status(500).json({ message: 'Failed to update vault folder' });
  }
});

// Delete a vault folder
router.delete('/folders/:folderId', verifyToken, async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.decodedToken.id;

    const deletedFolder = await VaultFolder.findOneAndDelete({ _id: folderId, user: userId });

    if (!deletedFolder) {
      return res.status(404).json({ message: 'Vault folder not found' });
    }

    // Also delete all vaults in this folder
    await Vault.deleteMany({ vaultFolder: folderId });

    res.status(200).json({ message: 'Vault folder and its vaults deleted successfully' });
  } catch (error) {
    console.error('Error deleting vault folder:', error);
    res.status(500).json({ message: 'Failed to delete vault folder' });
  }
});




// Create a new vault in a specific folder
router.post('/vaults', verifyToken, async (req, res) => {
  try {
    const { vaultFolderId, name, URL, username, password, notes } = req.body;
    const userId = req.decodedToken.id;

    const newVault = new Vault({
      user: userId,
      vaultFolder: vaultFolderId,
      name,
      URL,
      username,
      password,
      notes
    });

    await newVault.save();

    // Add the new vault to the folder's vaults array
    await VaultFolder.findByIdAndUpdate(vaultFolderId, {
      $push: { vaults: newVault._id }
    });

    // Decrypt and return the vault
    const decryptedVault = newVault.decryptFields();
    res.status(201).json(decryptedVault);
  } catch (error) {
    console.error('Error creating vault:', error);
    res.status(500).json({ message: 'Failed to create vault' });
  }
});

// Get all vaults in a specific folder
router.get('/vaults/:folderId', verifyToken, async (req, res) => {
  try {
    const { folderId } = req.params;

    // Fetch vaults from the database
    const vaults = await Vault.find({ vaultFolder: folderId });

    // Decrypt fields for each vault
    const decryptedVaults = vaults.map(vault => {
      try {
        return vault.decryptFields(); // Decrypt each vault
      } catch (error) {
        console.error('Error decrypting vault:', error);
        // Return the original vault data with an error message
        return {
          ...vault.toObject(),
          decryptionError: 'Failed to decrypt this vault'
        };
      }
    });

    res.status(200).json(decryptedVaults);
  } catch (error) {
    console.error('Error fetching vaults:', error);
    res.status(500).json({ message: 'Failed to fetch vaults' });
  }
});

// Edit a vault
router.put('/vaults/:vaultId', verifyToken, async (req, res) => {
  try {
    const { vaultId } = req.params;
    const { name, URL, username, password, notes } = req.body;
    const userId = req.decodedToken.id;

    const updatedVault = await Vault.findOneAndUpdate(
      { _id: vaultId, user: userId },
      { name, URL, username, password, notes },
      { new: true }
    );

    if (!updatedVault) {
      return res.status(404).json({ message: 'Vault not found' });
    }

    // Decrypt and return the updated vault
    const decryptedVault = updatedVault.decryptFields();
    res.status(200).json(decryptedVault);
  } catch (error) {
    console.error('Error updating vault:', error);
    res.status(500).json({ message: 'Failed to update vault' });
  }
});


// Delete a vault
router.delete('/vaults/:vaultId', verifyToken, async (req, res) => {
  try {
    const { vaultId } = req.params;
    const userId = req.decodedToken.id;

    const deletedVault = await Vault.findOneAndDelete({ _id: vaultId, user: userId });

    if (!deletedVault) {
      return res.status(404).json({ message: 'Vault not found' });
    }

    // Remove the vault from the folder's vaults array
    await VaultFolder.findByIdAndUpdate(deletedVault.vaultFolder, {
      $pull: { vaults: vaultId }
    });

    res.status(200).json({ message: 'Vault deleted successfully' });
  } catch (error) {
    console.error('Error deleting vault:', error);
    res.status(500).json({ message: 'Failed to delete vault' });
  }
});


// Fetch all vaults for a specific user based on the token
router.get('/user/vaults', verifyToken, async (req, res) => {
  try {
    const userId = req.decodedToken.id;

    // Fetch all vaults associated with the user
    const vaults = await Vault.find({ user: userId });

    // Decrypt fields for each vault
    const decryptedVaults = vaults.map(vault => {
      try {
        return vault.decryptFields(); // Decrypt each vault
      } catch (error) {
        console.error('Error decrypting vault:', error);
        // Return the original vault data with an error message
        return {
          ...vault.toObject(),
          decryptionError: 'Failed to decrypt this vault'
        };
      }
    });

    res.status(200).json(decryptedVaults);
  } catch (error) {
    console.error('Error fetching user vaults:', error);
    res.status(500).json({ message: 'Failed to fetch user vaults' });
  }
});

export default router;


