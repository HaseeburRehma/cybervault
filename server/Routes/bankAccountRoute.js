import express from 'express';
import BankAccountFolder from '../models/bankAccountFolderSchema.js';
import BankAccount from '../models/bankAccountSchema.js';
import {verifyToken} from '../middleware/authMiddleware.js';

const router = express.Router();

// CREATE Bank Account Folder
router.post('/folders', verifyToken, async (req, res) => {
    const { folderName } = req.body;

    try {
        const newFolder = new BankAccountFolder({
            user: req.decodedToken.id,
            folderName,
        });
        await newFolder.save();
        res.status(201).json(newFolder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create folder' });
    }
});

// READ All Bank Account Folders for a User
router.get('/folders', verifyToken, async (req, res) => {
    try {
        const folders = await BankAccountFolder.find({ user: req.decodedToken.id });
        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch folders' });
    }
});

// UPDATE Bank Account Folder by ID
router.put('/folders/:id', verifyToken, async (req, res) => {
    const { folderName } = req.body;

    try {
        const updatedFolder = await BankAccountFolder.findByIdAndUpdate(
            req.params.id,
            { folderName },
            { new: true }
        );
        if (!updatedFolder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        res.status(200).json(updatedFolder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update folder' });
    }
});

// DELETE Bank Account Folder by ID
router.delete('/folders/:id', verifyToken, async (req, res) => {
    try {
        // Delete all bank accounts associated with this folder
        await BankAccount.deleteMany({ folder: req.params.id });

        // Then delete the folder itself
        const deletedFolder = await BankAccountFolder.findByIdAndDelete(req.params.id);
        if (!deletedFolder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        res.status(200).json({ message: 'Folder and associated accounts deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete folder' });
    }
});

// CREATE Bank Account inside a Folder
router.post('/accounts', verifyToken, async (req, res) => {
    const { folderId, bankName, accountType, routingNumber, accountNumber, swiftCode, ibanNumber, pin, branchAddress, branchPhone, notes } = req.body;

    try {
        const newAccount = new BankAccount({
            folder: folderId,
            bankName,
            accountType,
            routingNumber,
            accountNumber,
            swiftCode,
            ibanNumber,
            pin,
            branchAddress,
            branchPhone,
            notes
        });
        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create bank account' });
    }
});

// READ All Bank Accounts in a Specific Folder
router.get('/accounts/:folderId', verifyToken, async (req, res) => {
    try {
        const accounts = await BankAccount.find({ folder: req.params.folderId });
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bank accounts' });
    }
});

// READ a Specific Bank Account by ID
router.get('/accounts/detail/:id', verifyToken, async (req, res) => {
    try {
        const account = await BankAccount.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bank account' });
    }
});

// UPDATE Bank Account by ID
router.put('/accounts/:id', verifyToken, async (req, res) => {
    const { bankName, accountType, routingNumber, accountNumber, swiftCode, ibanNumber, pin, branchAddress, branchPhone, notes } = req.body;

    try {
        const updatedAccount = await BankAccount.findByIdAndUpdate(
            req.params.id,
            { bankName, accountType, routingNumber, accountNumber, swiftCode, ibanNumber, pin, branchAddress, branchPhone, notes },
            { new: true }
        );
        if (!updatedAccount) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update bank account' });
    }
});

// DELETE Bank Account by ID
router.delete('/accounts/:id', verifyToken, async (req, res) => {
    try {
        const deletedAccount = await BankAccount.findByIdAndDelete(req.params.id);
        if (!deletedAccount) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json({ message: 'Bank account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete bank account' });
    }
});

export default router;
