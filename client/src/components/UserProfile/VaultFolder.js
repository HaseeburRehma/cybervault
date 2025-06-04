"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { createVaultFolder, getVaultFolders, updateVaultFolder, deleteVaultFolder } from "../Api_integration/vaultApi"
import { HiPlus, HiPencil, HiTrash, HiDotsVertical, HiFilter, HiSortAscending, HiSortDescending } from "react-icons/hi"
import { FaFolderOpen, FaExclamationTriangle } from "react-icons/fa"
import { getUserDetails } from "../Api_integration/userApi"
import "./style.css"

interface VaultFolder {
  _id: string
  folderName: string
  vaultCount: number
  createdAt: string
  updatedAt?: string
}

interface VaultFolderProps {
  setActiveFolderId: (id: string) => void
}

const VaultFolder: React.FC<VaultFolderProps> = ({ setActiveFolderId }) => {
  const [folders, setFolders] = useState<VaultFolder[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [editFolderId, setEditFolderId] = useState<string | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter and sort state management
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [sortOption, setSortOption] = useState("A-Z Ascending")

  // Fetch folders with error handling
  const fetchFolders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getVaultFolders()
      setFolders(Array.isArray(result) ? result : [])
    } catch (err) {
      console.error("Error fetching folders:", err)
      setError("Failed to load vault folders. Please try again.")
      setFolders([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch user details
  const fetchUserDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const userDetails = await getUserDetails(token)
        if (userDetails) {
          setUsername(userDetails.username)
        }
      }
    } catch (err) {
      console.error("Error fetching user details:", err)
    }
  }, [])

  useEffect(() => {
    fetchFolders()
    fetchUserDetails()
  }, [fetchFolders, fetchUserDetails])

  // Validate folder name
  const validateFolderName = (name: string): string | null => {
    if (!name.trim()) {
      return "Folder name is required"
    }
    if (name.trim().length > 20) {
      return "Folder name must be 20 characters or less"
    }
    if (name.trim().length < 2) {
      return "Folder name must be at least 2 characters"
    }
    // Check for duplicate names (excluding current folder if editing)
    const duplicateExists = folders.some(
      (folder) => folder.folderName.toLowerCase() === name.trim().toLowerCase() && folder._id !== editFolderId,
    )
    if (duplicateExists) {
      return "A folder with this name already exists"
    }
    return null
  }

  const handleCreateOrEditFolder = async () => {
    const validationError = validateFolderName(newFolderName)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (editFolderId) {
        const updatedFolder = await updateVaultFolder(editFolderId, { folderName: newFolderName.trim() })
        setFolders(folders.map((folder) => (folder._id === editFolderId ? updatedFolder : folder)))
      } else {
        const result = await createVaultFolder({ folderName: newFolderName.trim() })
        setFolders([result, ...folders])
      }

      setNewFolderName("")
      setEditFolderId(null)
      setIsPopupOpen(false)
    } catch (err: any) {
      console.error("Error creating/updating folder:", err)
      setError(err.response?.data?.message || "Failed to save folder. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return

    try {
      setLoading(true)
      setError(null)
      await deleteVaultFolder(folderToDelete)
      setFolders(folders.filter((folder) => folder._id !== folderToDelete))
      setFolderToDelete(null)
      setIsConfirmOpen(false)
    } catch (err: any) {
      console.error("Error deleting folder:", err)
      setError(err.response?.data?.message || "Failed to delete folder. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredFolders = folders
    .filter((folder) => folder.folderName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortOption) {
        case "A-Z Ascending":
          return a.folderName.localeCompare(b.folderName)
        case "A-Z Descending":
          return b.folderName.localeCompare(a.folderName)
        case "Time Ascending":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "Time Descending":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const totalFolders = filteredFolders.length

  const openCreatePopup = () => {
    setEditFolderId(null)
    setNewFolderName("")
    setError(null)
    setIsPopupOpen(true)
  }

  const openEditPopup = (folder: VaultFolder) => {
    setEditFolderId(folder._id)
    setNewFolderName(folder.folderName)
    setError(null)
    setIsPopupOpen(true)
  }

  const handleFolderClick = (folderId: string) => {
    setActiveFolderId(folderId)
  }

  return (
    <div className="bg-gray-50 p-2 mb-4 font-tomato">
      <div className="header-row">
        <h2 className="text-3xl font-bold capitalize">{username ? `${username}'s Vault Folders` : "Vault Folders"}</h2>
        <p className="text-lg text-gray-600">
          <span className="font-bold">{totalFolders} Total</span> Folders
        </p>
      </div>
      <hr className="header-divider" />

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      <div className="filters-row">
        <input
          type="text"
          className="search-filter"
          placeholder="Search Vault Folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-options">
          <button className="filter-button" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <HiFilter size={20} />
          </button>

          <div className="relative">
            <button className="sort-button" onClick={() => setIsSortOpen(!isSortOpen)}>
              Sort by <HiSortAscending size={20} className="inline ml-1" />
            </button>

            {isSortOpen && (
              <div className="dropdown-content absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                {["A-Z Ascending", "A-Z Descending", "Time Ascending", "Time Descending"].map((option) => (
                  <div
                    key={option}
                    className="dropdown-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setSortOption(option)
                      setIsSortOpen(false)
                    }}
                  >
                    {option.includes("Ascending") ? (
                      <HiSortAscending className="mr-2" />
                    ) : (
                      <HiSortDescending className="mr-2" />
                    )}
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredFolders.length === 0 && !searchTerm && (
        <div className="flex flex-col items-center justify-center mt-10">
          <FaFolderOpen size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-600 text-xl mb-4">No vault folders yet</p>
          <p className="text-gray-500 mb-6">Create your first folder to organize your passwords</p>
          <button
            onClick={openCreatePopup}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Create First Folder
          </button>
        </div>
      )}

      {/* No Search Results */}
      {!loading && filteredFolders.length === 0 && searchTerm && (
        <div className="flex flex-col items-center justify-center mt-10">
          <FaFolderOpen size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-600 text-xl">No folders found for "{searchTerm}"</p>
          <button onClick={() => setSearchTerm("")} className="text-emerald-600 hover:text-emerald-700 mt-2">
            Clear search
          </button>
        </div>
      )}

      {/* Folders Grid */}
      {!loading && filteredFolders.length > 0 && (
        <div className="folder-grid">
          {filteredFolders.map((folder) => (
            <div key={folder._id} className="folder-item" onClick={() => handleFolderClick(folder._id)}>
              <div className="folder-actions-container">
                <HiDotsVertical className="actions-icon" onClick={(e) => e.stopPropagation()} />
                <div className="folder-actions">
                  <HiPencil
                    className="action-icon text-emerald-500 hover:text-emerald-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditPopup(folder)
                    }}
                  />
                  <HiTrash
                    className="action-icon text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFolderToDelete(folder._id)
                      setIsConfirmOpen(true)
                    }}
                  />
                </div>
              </div>
              <div className="folder-content">
                <div className="folder-icon">
                  <span className="folder-icon-counter">{folder.vaultCount || 0}</span>
                  <span className="folder-icon-label">Vaults</span>
                </div>
                <h3 className="folder-name">{folder.folderName}</h3>
                <p className="folder-date">Created: {new Date(folder.createdAt).toLocaleDateString()}</p>
                {folder.updatedAt && folder.updatedAt !== folder.createdAt && (
                  <p className="folder-date text-xs">Updated: {new Date(folder.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        className="add-folder-button fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
        onClick={openCreatePopup}
        disabled={loading}
      >
        <HiPlus size={24} />
      </button>

      {/* Create/Edit Popup */}
      {isPopupOpen && (
        <div className="popup-overlay animate__animated animate__fadeIn">
          <div className="popup-content">
            <h3 className="text-xl font-semibold mb-4">
              {editFolderId ? "Edit Vault Folder" : "Create New Vault Folder"}
            </h3>
            <input
              type="text"
              className="input-field"
              placeholder="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              maxLength={20}
              autoFocus
            />
            <p className="mb-4 -mt-2 font-medium text-sm text-gray-600">{newFolderName.length}/20 characters</p>
            <div className="flex space-x-2">
              <button
                className="popup-button bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                onClick={handleCreateOrEditFolder}
                disabled={loading}
              >
                {loading ? "Saving..." : editFolderId ? "Update" : "Create"}
              </button>
              <button
                className="popup-button bg-gray-600 text-white hover:bg-gray-700"
                onClick={() => {
                  setIsPopupOpen(false)
                  setError(null)
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Popup */}
      {isConfirmOpen && (
        <div className="popup-overlay animate__animated animate__fadeIn">
          <div className="popup-content">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this folder? This will also delete all vaults inside it. This action
              cannot be undone.
            </p>
            <div className="flex space-x-2">
              <button
                className="popup-button bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={handleDeleteFolder}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
              <button
                className="popup-button bg-gray-600 text-white hover:bg-gray-700"
                onClick={() => {
                  setIsConfirmOpen(false)
                  setFolderToDelete(null)
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VaultFolder
