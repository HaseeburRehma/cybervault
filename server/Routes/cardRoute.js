import express from 'express';
import BankCard from '../models/bankCardSchema.js';
import BankCardFolder from '../models/bankCardFolderSchema.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Card Endpoints

// Create a new card
router.post('/', verifyToken, async (req, res) => {
    const { folder, nameOnCard, type, number, securityCode, startDate, expirationDate, notes } = req.body;
    const userId = req.decodedToken.id;

    try {
        // Create the new card
        const newCard = new BankCard({
            user: userId,
            folder,
            nameOnCard,
            type,
            number,
            securityCode,
            startDate,
            expirationDate,
            notes
        });

        // Save the card
        await newCard.save();

        // Update the folder with the new card ID
        await BankCardFolder.findByIdAndUpdate(folder, {
            $push: { bankCards: newCard._id }
        });

        res.status(201).json(newCard);
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all cards for a specific folder
router.get('/', verifyToken, async (req, res) => {
    const userId = req.decodedToken.id;
    const { folder } = req.query;

    try {
        const cards = await BankCard.find({ user: userId, folder }).populate('folder', 'name'); // Populate folder info if needed
        res.status(200).json(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a card
router.put('/:id', verifyToken, async (req, res) => {
    const cardId = req.params.id;
    const { nameOnCard, type, number, securityCode, startDate, expirationDate, notes } = req.body;

    try {
        // Find and update the card
        const updatedCard = await BankCard.findByIdAndUpdate(cardId, {
            nameOnCard,
            type,
            number,
            securityCode,
            startDate,
            expirationDate,
            notes
        }, { new: true });

        // Check if the card exists
        if (!updatedCard) {
            return res.status(404).json({ message: 'Card not found' });
        }

        // Return the updated card
        res.status(200).json(updatedCard);
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a card
router.delete('/:id', verifyToken, async (req, res) => {
    const cardId = req.params.id;

    try {
        // Find and delete the card
        const deletedCard = await BankCard.findByIdAndDelete(cardId);

        if (!deletedCard) {
            return res.status(404).json({ message: 'Card not found' });
        }

        // Remove the card from the folder's bankCards array
        await BankCardFolder.findByIdAndUpdate(deletedCard.folder, {
            $pull: { bankCards: cardId }
        });

        res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Card Folder Endpoints

// Create a new card folder
router.post('/folders', verifyToken, async (req, res) => {
    const { name } = req.body;
    const userId = req.decodedToken.id;

    try {
        const folder = new BankCardFolder({ user: userId, name });
        await folder.save();
        res.status(201).json(folder);
    } catch (error) {
        console.error('Error creating card folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all card folders for a user
router.get('/folders', verifyToken, async (req, res) => {
    const userId = req.decodedToken.id;

    try {
        const folders = await BankCardFolder.find({ user: userId });
        res.status(200).json(folders);
    } catch (error) {
        console.error('Error fetching card folders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a card folder
router.put('/folders/:id', verifyToken, async (req, res) => {
    const folderId = req.params.id;
    const { name } = req.body;

    try {
        const updatedFolder = await BankCardFolder.findByIdAndUpdate(folderId, { name }, { new: true });

        if (!updatedFolder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        res.status(200).json(updatedFolder);
    } catch (error) {
        console.error('Error updating card folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a card folder and all its cards
router.delete('/folders/:id', verifyToken, async (req, res) => {
    const folderId = req.params.id;

    try {
        const deletedFolder = await BankCardFolder.findByIdAndDelete(folderId);

        if (!deletedFolder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        await BankCard.deleteMany({ folder: folderId });

        res.status(200).json({ message: 'Folder and all associated cards deleted successfully' });
    } catch (error) {
        console.error('Error deleting card folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
