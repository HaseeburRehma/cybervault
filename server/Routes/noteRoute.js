import express from 'express';
import Note from '../models/noteSchema.js';
import NoteFolder from '../models/noteFolderSchema.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new Note Folder
router.post('/folders', verifyToken, async (req, res) => {
    const { name } = req.body;
    const userId = req.decodedToken.id; // Adjust to use `id` instead of `_id`

    if (!name) {
        return res.status(400).json({ error: 'Folder name is required' });
    }

    if (!userId) {
        return res.status(400).json({ error: 'User ID is missing' });
    }

    try {
        const newFolder = new NoteFolder({ user: userId, name });
        const savedFolder = await newFolder.save();
        res.status(201).json(savedFolder);
    } catch (error) {
        console.error('Error creating note folder:', error);
        res.status(500).json({ error: 'Error creating note folder' });
    }
});



// Get all Note Folders for a user
router.get('/folders', verifyToken, async (req, res) => {
    const userId = req.decodedToken.id; // Ensure correct field is used

    try {
        const folders = await NoteFolder.find({ user: userId });
        res.status(200).json(folders);
    } catch (error) {
        console.error('Error fetching note folders:', error);
        res.status(500).json({ error: 'Error fetching note folders' });
    }
});


// Update a Note Folder by ID
router.put('/folders/:id', verifyToken, async (req, res) => {
    const folderId = req.params.id;
    const { name } = req.body;

    try {
        const updatedFolder = await NoteFolder.findByIdAndUpdate(folderId, { name }, { new: true });
        if (!updatedFolder) return res.status(404).json({ error: 'Note folder not found' });

        res.status(200).json(updatedFolder);
    } catch (error) {
        console.error('Error updating note folder:', error);
        res.status(500).json({ error: 'Error updating note folder' });
    }
});

// Delete a Note Folder by ID
router.delete('/folders/:id', verifyToken, async (req, res) => {
    const folderId = req.params.id;

    try {
        const deletedFolder = await NoteFolder.findByIdAndDelete(folderId);
        if (!deletedFolder) return res.status(404).json({ error: 'Note folder not found' });

        await Note.deleteMany({ folder: folderId });
        res.status(200).json({ message: 'Note folder and associated notes deleted' });
    } catch (error) {
        console.error('Error deleting note folder:', error);
        res.status(500).json({ error: 'Error deleting note folder' });
    }
});

// Create a new Note in a specific folder
router.post('/notes', verifyToken, async (req, res) => {
    const { folder, title, content } = req.body;
    const userId = req.decodedToken.id; // Ensure the ID is correctly used

    if (!userId || !folder || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newNote = new Note({
            user: userId,
            folder,
            title,
            content
        });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Error creating note' });
    }
});


// Get all Notes in a specific folder
router.get('/notes/folder/:folderId', verifyToken, async (req, res) => {
    const { folderId } = req.params;
    const userId = req.decodedToken.id; // Ensure this matches your JWT payload
    console.log('inside the get api');
    try {
        const notes = await Note.find({ folder: folderId, user: userId });
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Error fetching notes' });
    }
});

// Update a Note by ID
router.put('/notes/:id', verifyToken, async (req, res) => {
    const noteId = req.params.id;
    const { title, content } = req.body;

    try {
        const updatedNote = await Note.findByIdAndUpdate(noteId, { title, content }, { new: true });
        if (!updatedNote) return res.status(404).json({ error: 'Note not found' });

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Error updating note' });
    }
});

// Delete a Note by ID
router.delete('/notes/:id', verifyToken, async (req, res) => {
    const noteId = req.params.id;

    try {
        const deletedNote = await Note.findByIdAndDelete(noteId);
        if (!deletedNote) return res.status(404).json({ error: 'Note not found' });

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Error deleting note' });
    }
});

export default router;
