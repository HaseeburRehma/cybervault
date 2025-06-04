import React, { useState, useEffect } from 'react';
import {
  createAddressFolder,
  getAddressFolders,
  updateAddressFolder,
  deleteAddressFolder,
  getAddresses
} from '../Api_integration/addressApi';
import { getUserDetails } from '../Api_integration/userApi';
import { HiPlus, HiPencil, HiTrash, HiDotsVertical, HiFilter, HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { FaFolderOpen } from 'react-icons/fa';

import './style.css';

const AddressFolder = ({ setActiveFolderId }) => {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [editFolderId, setEditFolderId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [username, setUsername] = useState('');

  // Filter and sort state management
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState('A-Z Ascending');

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const result = await getAddressFolders();
        const foldersWithCounts = await Promise.all(result.map(async (folder) => {
          const addresses = await getAddresses(folder._id);
          return { ...folder, count: addresses.length };
        }));
        setFolders(foldersWithCounts);
      } catch (error) {
        console.error('Failed to fetch address folders:', error);
      }
    };
    fetchFolders();
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

  const handleCreateOrEditFolder = async () => {
    if (newFolderName.trim()) {
      try {
        if (editFolderId) {
          const updatedFolder = await updateAddressFolder(editFolderId, { name: newFolderName });
          const updatedFolderWithCount = {
            ...updatedFolder,
            count: folders.find(folder => folder._id === editFolderId).count
          };
          setFolders(folders.map(folder => (folder._id === editFolderId ? updatedFolderWithCount : folder)));
        } else {
          const result = await createAddressFolder({ name: newFolderName });
          const addresses = await getAddresses(result._id);
          setFolders([...folders, { ...result, count: addresses.length }]);
        }
        setNewFolderName('');
        setEditFolderId(null);
        setIsPopupOpen(false);
      } catch (error) {
        console.error('Failed to create or update address folder:', error);
      }
    }
  };

  const handleDeleteFolder = async () => {
    if (folderToDelete) {
      try {
        await deleteAddressFolder(folderToDelete);
        setFolders(folders.filter(folder => folder._id !== folderToDelete));
        setFolderToDelete(null);
        setIsConfirmOpen(false);
      } catch (error) {
        console.error('Failed to delete address folder:', error);
      }
    }
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
    <div className="bg-gray-50 h-96 p-4">
      <div className="header-row">
        <h2 className="text-3xl font-bold capitalize">{username ? `${username}'s Address Folders` : 'Address Folders'}</h2>
        <p className="text-lg text-gray-600"><span className='font-bold'>{filteredFolders.length} Total</span> Folders</p>
      </div>
      <hr className="header-divider" />

      <div className="filters-row">
        <input
          type="text"
          className="search-filter"
          placeholder="Search Folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-options">
          <button
            className="filter-button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <HiFilter size={20} />
          </button>

          <button
            className="sort-button"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            Sort by <HiSortAscending size={20} className="inline" />
          </button>

          {isSortOpen && (
            <div className="dropdown-content">
              <div className="dropdown-item" onClick={() => { setSortOption('A-Z Ascending'); setIsSortOpen(false); }}>
                <HiSortAscending /> A-Z Ascending
              </div>
              <div className="dropdown-item" onClick={() => { setSortOption('A-Z Descending'); setIsSortOpen(false); }}>
                <HiSortDescending /> A-Z Descending
              </div>
              <div className="dropdown-item" onClick={() => { setSortOption('Time Ascending'); setIsSortOpen(false); }}>
                <HiSortAscending /> Time Ascending
              </div>
              <div className="dropdown-item" onClick={() => { setSortOption('Time Descending'); setIsSortOpen(false); }}>
                <HiSortDescending /> Time Descending
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredFolders.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <FaFolderOpen size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-600 text-xl">No folders yet. Create your first folder!</p>
        </div>
      ) : (
        <div className="folder-grid">
          {filteredFolders.map((folder) => (
            <div
              key={folder._id}
              className="folder-item"
              onClick={() => setActiveFolderId(folder._id)}
            >
              <div className="folder-actions-container">
                <HiDotsVertical
                  className="actions-icon"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="folder-actions">
                  <HiPencil
                    className="action-icon text-green-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewFolderName(folder.name);
                      setEditFolderId(folder._id);
                      setIsPopupOpen(true);
                    }}
                  />
                  <HiTrash
                    className="action-icon text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFolderToDelete(folder._id);
                      setIsConfirmOpen(true);
                    }}
                  />
                </div>
              </div>
              <div className="folder-content">
                <div className="folder-icon">
                  <span className="folder-icon-counter">{folder.count || 0}</span>
                  <span className="folder-icon-label">Address</span>
                </div>
                <h3 className="folder-name">{folder.name}</h3>
                <p className="folder-date">Dated: {new Date(folder.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="add-folder-button fixed bottom-6 right-6 bg-gradient-to-r from-purple-400 to-blue-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
        onClick={() => {
          setIsPopupOpen(true);
          setEditFolderId(null); // Reset the editFolderId when opening the popup for creating a new folder
          setNewFolderName(''); // Clear the input field for new folder name
        }}
      >
        <HiPlus size={24} />
      </button>

      {isPopupOpen && (
        <div className="popup-overlay animate__animated animate__fadeIn">
          <div className="popup-content">
            <h3 className="text-xl font-semibold mb-4">{editFolderId ? 'Edit Folder' : 'Create New Folder'}</h3>
            <input
              type="text"
              className="input-field"
              placeholder="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <button className="popup-button bg-blue-600 text-white" onClick={handleCreateOrEditFolder}>
              {editFolderId ? 'Update' : 'Create'}
            </button>
            <button className="popup-button bg-red-600 text-white ml-2" onClick={() => setIsPopupOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this folder?</p>
            <div className="flex space-x-4 mt-4">
              <button className="bg-red-600 text-white py-2 px-4 rounded" onClick={handleDeleteFolder}>Delete</button>
              <button className="bg-gray-300 text-black py-2 px-4 rounded" onClick={() => setIsConfirmOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressFolder;
