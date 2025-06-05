import React, { useState, useEffect } from 'react';
import { createVault, getVaults, updateVault, deleteVault } from '../Api_integration/vaultApi';
import { HiPlus, HiPencil, HiTrash, HiShare } from 'react-icons/hi';
import { FaLock } from 'react-icons/fa';

const PasswordVault = ({ folderId }) => {
  const [newVault, setNewVault] = useState({ name: '', URL: '', username: '', password: '', notes: '' });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [vaults, setVaults] = useState([]);
  const [editVault, setEditVault] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [vaultToDelete, setVaultToDelete] = useState(null);

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const fetchedVaults = await getVaults(folderId);
        setVaults(fetchedVaults);
      } catch (error) {
        console.error('Error fetching vaults:', error);
      }
    };

    fetchVaults();
  }, [folderId]);

  const handleCreateVault = async () => {
    if (newVault.name && newVault.username && newVault.password) {
      try {
        const createdVault = await createVault({ ...newVault, vaultFolderId: folderId });
        setVaults([...vaults, createdVault]); // The createdVault is already decrypted
        setNewVault({ name: '', URL: '', username: '', password: '', notes: '' });
        setIsPopupOpen(false);
      } catch (error) {
        console.error('Error creating vault:', error);
      }
    }
  };
  
  const handleUpdateVault = async () => {
    if (editVault.name && editVault.username && editVault.password) {
      try {
        const updatedVault = await updateVault(editVault._id, editVault);
        setVaults(vaults.map(vault => vault._id === updatedVault._id ? updatedVault : vault)); // The updatedVault is already decrypted
        setEditVault(null);
        setIsPopupOpen(false);
      } catch (error) {
        console.error('Error updating vault:', error);
      }
    }
  };

  const handleDeleteVault = async () => {
    try {
      await deleteVault(vaultToDelete._id);
      setVaults(vaults.filter(vault => vault._id !== vaultToDelete._id));
      setVaultToDelete(null);
      setIsConfirmDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting vault:', error);
    }
  };

  const openEditPopup = (vault) => {
    setEditVault(vault);
    setNewVault({ ...vault });
    setIsPopupOpen(true);
  };

  const openDeleteConfirmation = (vault) => {
    setVaultToDelete(vault);
    setIsConfirmDeleteOpen(true);
  };

  return (
    <div className='bg-gray-50 min-h-screen p-4'>
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Password Vaults</h2>

      {vaults.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <FaLock size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-600 text-xl">No vaults yet. Add your first password vault!</p>
        </div>
      ) : (
        <table className="min-w-full bg-white border-collapse">
          <thead className='bg-blue-400 text-white'>
            <tr>
              <th className="py-2 px-4 border border-gray-300">Name</th>
              <th className="py-2 px-4 border border-gray-300">URL</th>
              <th className="py-2 px-4 border border-gray-300">Username</th>
              <th className="py-2 px-4 border border-gray-300">Password</th>
              <th className="py-2 px-4 border border-gray-300">Notes</th>
              <th className="py-2 px-4 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaults.map((vault) => (
              <tr key={vault._id}>
                <td className="py-2 px-4 border border-gray-300">{vault.name}</td>
                <td className="py-2 px-4 border border-gray-300">{vault.URL}</td>
                <td className="py-2 px-4 border border-gray-300">{vault.username}</td>
                <td className="py-2 px-4 border border-gray-300">{vault.password}</td>
                <td className="py-2 px-4 border border-gray-300">{vault.notes}</td>
                <td className="py-2 px-4 border border-gray-300">
                  <button onClick={() => openEditPopup(vault)} className="text-blue-600">
                    <HiPencil size={20} />
                  </button>
                  <button onClick={() => openDeleteConfirmation(vault)} className="text-red-600 ml-2">
                    <HiTrash size={20} />
                  </button>
                  <button className="text-green-600 ml-2">
                    <HiShare size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className="animate-pulse fixed bottom-6 right-6 bg-green-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsPopupOpen(true)}
      >
        <HiPlus size={24} />
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{editVault ? 'Edit Vault' : 'Create New Vault'}</h3>
            <input
              type="text"
              className="border border-gray-300 p-2 w-full mb-4"
              placeholder="Vault Name"
              value={newVault.name}
              onChange={(e) => setNewVault({ ...newVault, name: e.target.value })}
            />
            <input
              type="text"
              className="border border-gray-300 p-2 w-full mb-4"
              placeholder="URL"
              value={newVault.URL}
              onChange={(e) => setNewVault({ ...newVault, URL: e.target.value })}
            />
            <input
              type="text"
              className="border border-gray-300 p-2 w-full mb-4"
              placeholder="Username"
              value={newVault.username}
              onChange={(e) => setNewVault({ ...newVault, username: e.target.value })}
            />
            <input
              type="password"
              className="border border-gray-300 p-2 w-full mb-4"
              placeholder="Password"
              value={newVault.password}
              onChange={(e) => setNewVault({ ...newVault, password: e.target.value })}
            />
            <textarea
              className="border border-gray-300 p-2 w-full mb-4"
              placeholder="Notes"
              value={newVault.notes}
              onChange={(e) => setNewVault({ ...newVault, notes: e.target.value })}
            />
            <button className="bg-green-600 text-white py-2 px-4 rounded" onClick={editVault ? handleUpdateVault : handleCreateVault}>
              {editVault ? 'Update' : 'Create'}
            </button>
            <button className="bg-red-600 text-white py-2 px-4 rounded ml-2" onClick={() => { setIsPopupOpen(false); setEditVault(null); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this vault?</p>
            <button className="bg-red-600 text-white py-2 px-4 rounded" onClick={handleDeleteVault}>
              Delete
            </button>
            <button className="bg-gray-600 text-white py-2 px-4 rounded ml-2" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordVault;
