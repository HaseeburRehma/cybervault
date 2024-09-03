import express from 'express';
import Address from '../models/addressSchema.js';
import AddressFolder from '../models/addressFolderSchema.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new address folder
router.post('/folder', verifyToken, async (req, res) => {
  const { name } = req.body;
  const userId = req.decodedToken.id;

  try {
    const folder = new AddressFolder({ user: userId, name });
    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    console.error('Error creating address folder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all address folders for a user
router.get('/folders', verifyToken, async (req, res) => {
  const userId = req.decodedToken.id;

  try {
    const folders = await AddressFolder.find({ user: userId });
    res.status(200).json(folders);
  } catch (error) {
    console.error('Error fetching address folders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new address in a folder
router.post('/:folderId/address', verifyToken, async (req, res) => {
  const folderId = req.params.folderId;
  const userId = req.decodedToken.id;
  const { title, personName, username, gender, birthday, company, address, city, state, postalCode, country, timezone, emailAddress, phone, notes } = req.body;

  try {
    const newAddress = new Address({
      user: userId,
      folder: folderId,
      title,
      personName,
      username,
      gender,
      birthday,
      company,
      address,
      city,
      state,
      postalCode,
      country,
      timezone,
      emailAddress,
      phone,
      notes
    });

    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all addresses in a folder
router.get('/:folderId/addresses', verifyToken, async (req, res) => {
  const folderId = req.params.folderId;
  const userId = req.decodedToken.id;

  try {
    const addresses = await Address.find({ user: userId, folder: folderId });
    res.status(200).json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






// Update an address
router.put('/address/:id', verifyToken, async (req, res) => {
  const addressId = req.params.id;
  const { title, personName, username, gender, birthday, company, address, city, state, postalCode, country, timezone, emailAddress, phone, notes } = req.body;

  try {
    const updatedAddress = await Address.findByIdAndUpdate(addressId, {
      title,
      personName,
      username,
      gender,
      birthday,
      company,
      address,
      city,
      state,
      postalCode,
      country,
      timezone,
      emailAddress,
      phone,
      notes
    }, { new: true });

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json(updatedAddress);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an address
router.delete('/address/:id', verifyToken, async (req, res) => {
  const addressId = req.params.id;

  try {
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an address folder
router.put('/folder/:id', verifyToken, async (req, res) => {
  const folderId = req.params.id;
  const { name } = req.body;

  try {
    const updatedFolder = await AddressFolder.findByIdAndUpdate(folderId, { name }, { new: true });

    if (!updatedFolder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    res.status(200).json(updatedFolder);
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an address folder and all its addresses
router.delete('/folder/:id', verifyToken, async (req, res) => {
  const folderId = req.params.id;

  try {
    const deletedFolder = await AddressFolder.findByIdAndDelete(folderId);

    if (!deletedFolder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    await Address.deleteMany({ folder: folderId });

    res.status(200).json({ message: 'Folder and all associated addresses deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
