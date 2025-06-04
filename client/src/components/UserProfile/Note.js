import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaShareAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { createNote, getNotesInFolder, updateNote, deleteNote, setAuthToken } from '../Api_integration/noteApi';

const Note = ({ folderId }) => {
    const [notes, setNotes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentNote, setCurrentNote] = useState({ title: '', content: '', id: null });
    const [openNoteId, setOpenNoteId] = useState(null);

    useEffect(() => {
        if (folderId) {
            loadNotes();
        }
    }, [folderId]);

    const loadNotes = async () => {
        setAuthToken();
        try {
            const data = await getNotesInFolder(folderId);
            setNotes(data);
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    };

    const handleCreateOrUpdateNote = async () => {
        setAuthToken();
        try {
            if (currentNote.id) {
                await updateNote(currentNote.id, currentNote.title, currentNote.content);
            } else {
                await createNote(folderId, currentNote.title, currentNote.content);
            }
            loadNotes();
            setShowPopup(false);
            setCurrentNote({ title: '', content: '', id: null });
        } catch (error) {
            console.error('Error creating/updating note:', error);
        }
    };

    const handleEdit = (note) => {
        setCurrentNote({
            title: note.title,
            content: note.content,
            id: note._id
        });
        setShowPopup(true);
    };

    const handleDelete = async (id) => {
        setAuthToken();
        try {
            await deleteNote(id);
            loadNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleOpenCreatePopup = () => {
        setCurrentNote({ title: '', content: '', id: null });
        setShowPopup(true);
    };

    const toggleNote = (id) => {
        setOpenNoteId(openNoteId === id ? null : id);
    };

    return (
        <div className="min-h-screen p-4">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Notes</h2>
            <div className="grid grid-cols-1 gap-4">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <div key={note._id} className="bg-gray-100 rounded-lg px-4">
                            <div className="flex items-center justify-between p-4 border-b border-gray-500 mb-4">
                                <h3 className="text-lg font-semibold">{note.title}</h3>
                                <div className="flex space-x-2">
                                    {openNoteId === note._id ? (
                                        <FaChevronUp className="text-gray-500 cursor-pointer" onClick={() => toggleNote(note._id)} />
                                    ) : (
                                        <FaChevronDown className="text-gray-500 cursor-pointer" onClick={() => toggleNote(note._id)} />
                                    )}
                                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEdit(note)} />
                                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(note._id)} />
                                    <FaShareAlt className="text-green-500 cursor-pointer" />

                                </div>
                            </div>
                            {openNoteId === note._id && (
                                <div className="pb-4">
                                    <p className='text-lg'>{note.content}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500">No notes available</div>
                )}
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-xl mb-4">{currentNote.id ? 'Edit Note' : 'Create Note'}</h3>
                        <input
                            type="text"
                            value={currentNote.title}
                            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                            placeholder="Note Title"
                            className="border p-2 mb-4 w-full"
                        />
                        <textarea
                            value={currentNote.content}
                            onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                            placeholder="Note Content"
                            className="border p-2 mb-4 w-full"
                        />
                        <div className="flex justify-end space-x-4">
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setShowPopup(false)}>Cancel</button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreateOrUpdateNote}>
                                {currentNote.id ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <FaPlus className="fixed bottom-4 right-4 text-4xl text-blue-500 cursor-pointer" onClick={handleOpenCreatePopup} />
        </div>
    );
};

export default Note;
