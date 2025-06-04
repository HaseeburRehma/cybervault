import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { createNoteFolder, getNoteFolders, updateNoteFolder, deleteNoteFolder, getNotesInFolder, setAuthToken } from '../Api_integration/noteApi';
import { getUserDetails } from '../Api_integration/userApi';

const NoteFolder = ({ onSelectFolder }) => {
    const [folders, setFolders] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentFolder, setCurrentFolder] = useState({ name: '', id: null });
    const [username, setUsername] = useState('');
    const [notesCount, setNotesCount] = useState({});

    // Filter and sort state management
    const [searchTerm, setSearchTerm] = useState('');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortOption, setSortOption] = useState('A-Z Ascending');

    useEffect(() => {
        loadFolders();
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const userDetails = await getUserDetails(token);
                if (userDetails) {
                    setUsername(userDetails.username);
                }
            }
        };
        fetchUserDetails();
    }, []);

    const loadFolders = async () => {
        setAuthToken(); // Ensure token is set
        try {
            const foldersData = await getNoteFolders();
            setFolders(foldersData);

            // Fetch note counts for each folder
            const counts = {};
            await Promise.all(foldersData.map(async (folder) => {
                const notes = await getNotesInFolder(folder._id);
                counts[folder._id] = notes.length;
            }));
            setNotesCount(counts);
        } catch (error) {
            console.error('Error loading folders:', error);
        }
    };

    const handleCreateOrUpdateFolder = async () => {
        setAuthToken(); // Ensure token is set
        try {
            if (currentFolder.id) {
                await updateNoteFolder(currentFolder.id, currentFolder.name);
            } else {
                await createNoteFolder(currentFolder.name);
            }
            loadFolders();
            setShowPopup(false);
        } catch (error) {
            console.error('Error creating/updating folder:', error);
        }
    };

    const handleEdit = (folder) => {
        setCurrentFolder({ name: folder.name, id: folder._id });
        setShowPopup(true);
    };

    const handleDelete = async (id) => {
        setAuthToken(); // Ensure token is set
        try {
            await deleteNoteFolder(id);
            loadFolders();
        } catch (error) {
            console.error('Error deleting folder:', error);
        }
    };

    const handleOpenCreatePopup = () => {
        setCurrentFolder({ name: '', id: null });
        setShowPopup(true);
    };

    const filteredFolders = folders
        .filter(folder => (folder.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortOption === 'A-Z Ascending') {
                return (a.name || '').localeCompare(b.name || '');
            }
            if (sortOption === 'A-Z Descending') {
                return (b.name || '').localeCompare(a.name || '');
            }
            if (sortOption === 'Time Ascending') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
            if (sortOption === 'Time Descending') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        });

    return (
        <div className="bg-gray-50 h-96 p-4 mb-4">
            <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-6">
                <h2 className="text-3xl font-bold capitalize">{username ? `${username}'s Note Folders` : 'Note Folders'}</h2>
                <p className="text-lg text-gray-600"><span className='font-bold'>{filteredFolders.length} Total</span> Folder{filteredFolders.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Filter and Sort Row */}
            <div className="flex items-center justify-between space-x-4 mb-6 bg-gray-200 p-2 rounded">
                <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-2 w-full md:w-1/3"
                    placeholder="Search Folder..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="relative">
                    <button
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-black hover:text-gray-800"
                        onClick={() => setIsSortOpen(!isSortOpen)}
                    >
                        Sort by <HiSortAscending size={20} className="ml-2" />
                    </button>
                    {isSortOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                            <div className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => { setSortOption('A-Z Ascending'); setIsSortOpen(false); }}>
                                <HiSortAscending /> A-Z Ascending
                            </div>
                            <div className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => { setSortOption('A-Z Descending'); setIsSortOpen(false); }}>
                                <HiSortDescending /> A-Z Descending
                            </div>
                            <div className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => { setSortOption('Time Ascending'); setIsSortOpen(false); }}>
                                <HiSortAscending /> Time Ascending
                            </div>
                            <div className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => { setSortOption('Time Descending'); setIsSortOpen(false); }}>
                                <HiSortDescending /> Time Descending
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFolders.length > 0 ? (
                    filteredFolders.map((folder) => (
                        <div key={folder._id} className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-4">
                                <span onClick={() => onSelectFolder && onSelectFolder(folder._id)} className="block text-lg font-semibold text-xl text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200">
                                    {folder.name}
                                </span>
                                <p className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200">Dated: {new Date(folder.createdAt).toLocaleString()}</p>
                                {/* Display note count */}
                                <p className="text-sm text-gray-500">Notes: {notesCount[folder._id] || 0}</p>
                            </div>
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <FaEdit className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-200" onClick={() => handleEdit(folder)} />
                                <FaTrash className="text-red-600 cursor-pointer hover:text-red-800 transition-colors duration-200" onClick={() => handleDelete(folder._id)} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No folders found.</p>
                )}
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">{currentFolder.id ? 'Edit Folder' : 'Create Folder'}</h3>
                        <input
                            type="text"
                            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                            placeholder="Folder Name"
                            value={currentFolder.name}
                            onChange={(e) => setCurrentFolder({ ...currentFolder, name: e.target.value })}
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                                onClick={() => setShowPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                onClick={handleCreateOrUpdateFolder}
                            >
                                {currentFolder.id ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    onClick={handleOpenCreatePopup}
                >
                    <FaPlus className="inline mr-2" /> Add New Folder
                </button>
            </div>
        </div>
    );
};

export default NoteFolder;
