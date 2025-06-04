import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { createCardFolder, getCardFolders, updateCardFolder, deleteCardFolder } from '../Api_integration/cardApi';
import { getUserDetails } from '../Api_integration/userApi';

const BankCardFolder = ({ onSelectFolder }) => {
    const [folders, setFolders] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentFolder, setCurrentFolder] = useState({ name: '', id: null });
    const [username, setUsername] = useState('');

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
        try {
            const data = await getCardFolders();
            setFolders(data);
        } catch (error) {
            console.error('Error loading folders:', error);
        }
    };

    const handleCreateOrUpdateFolder = async () => {
        try {
            const folderData = { name: currentFolder.name };
            if (currentFolder.id) {
                await updateCardFolder(currentFolder.id, folderData);
            } else {
                await createCardFolder(folderData);
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
        try {
            await deleteCardFolder(id);
            loadFolders();
        } catch (error) {
            console.error('Error deleting folder:', error);
        }
    };

    const handleOpenCreatePopup = () => {
        setCurrentFolder({ name: '', id: null });
        setShowPopup(true);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-6">
                <h2 className="text-3xl font-bold capitalize">{username ? `${username}'s Bank Card Folders` : 'Bank Card Folders'}</h2>
                <p className="text-lg text-gray-600"><span className='font-bold'>{folders.length} Total</span> Folder{folders.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {folders.length > 0 ? (
                    folders.map((folder) => (
                        <div key={folder._id} className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-4">
                                <span onClick={() => onSelectFolder(folder._id)} className="block text-lg font-semibold text-xl text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200">
                                    {folder.name}
                                </span>
                                <p className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200">Dated: {new Date(folder.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <FaEdit className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-200" onClick={() => handleEdit(folder)} />
                                <FaTrash className="text-red-600 cursor-pointer hover:text-red-800 transition-colors duration-200" onClick={() => handleDelete(folder._id)} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 col-span-full">No folders available</div>
                )}
            </div>

            {/* Create/Edit Folder Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">{currentFolder.id ? 'Edit Folder' : 'Create Folder'}</h3>
                        <input
                            type="text"
                            value={currentFolder.name}
                            onChange={(e) => setCurrentFolder({ ...currentFolder, name: e.target.value })}
                            placeholder="Folder Name"
                            className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end space-x-4">
                            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200" onClick={() => setShowPopup(false)}>Cancel</button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200" onClick={handleCreateOrUpdateFolder}>
                                {currentFolder.id ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <FaPlus className="fixed bottom-6 right-6 text-5xl text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-200 z-50" onClick={handleOpenCreatePopup} />
        </div>
    );
};

export default BankCardFolder;
