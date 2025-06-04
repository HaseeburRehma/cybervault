import React, { useState, useEffect } from 'react';
import { createAddress, getAddresses, updateAddress, deleteAddress } from '../Api_integration/addressApi';
import { HiPlus, HiPencil, HiTrash, HiChevronDown, HiChevronUp, HiShare } from 'react-icons/hi';
import { toast } from 'react-toastify';

const Address = ({ folderId }) => {
    // State variables
    const [addresses, setAddresses] = useState([]); // To store the list of addresses
    const [newAddress, setNewAddress] = useState({
        title: '',
        personName: '',
        username: '',
        gender: '',
        birthday: '',
        company: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        timezone: '',
        emailAddress: '',
        phone: '',
        notes: ''
    }); // To store the details of the address being created or edited
    const [editAddressId, setEditAddressId] = useState(null); // ID of the address being edited
    const [isPopupOpen, setIsPopupOpen] = useState(false); // To control the visibility of the popup form
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // To control the visibility of the confirmation dialog
    const [addressToDelete, setAddressToDelete] = useState(null); // ID of the address to be deleted
    const [expandedAddressId, setExpandedAddressId] = useState(null);

    const handleToggleExpand = (addressId) => {
        setExpandedAddressId(expandedAddressId === addressId ? null : addressId);
    };

    // Fetch addresses on component mount or when folderId changes
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const result = await getAddresses(folderId);
                setAddresses(result);
            } catch (error) {
                toast.error('Failed to fetch addresses.');
                console.error('Failed to fetch addresses:', error);
            }
        };
        fetchAddresses();
    }, [folderId]);

    // Handle creating or editing an address
    const handleCreateOrEditAddress = async () => {
        if (newAddress.title && newAddress.address) {
            try {
                if (editAddressId) {
                    // Update existing address
                    const updatedAddress = await updateAddress(editAddressId, newAddress);
                    setAddresses(addresses.map(addr => (addr._id === editAddressId ? updatedAddress : addr)));
                } else {
                    // Create new address
                    const result = await createAddress(folderId, newAddress);
                    setAddresses([...addresses, result]);
                }
                toast.success(editAddressId ? 'Address updated successfully!' : 'Address created successfully!');
                setNewAddress({
                    title: '',
                    personName: '',
                    username: '',
                    gender: '',
                    birthday: '',
                    company: '',
                    address: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: '',
                    timezone: '',
                    emailAddress: '',
                    phone: '',
                    notes: ''
                });
                setEditAddressId(null);
                setIsPopupOpen(false);
            } catch (error) {
                toast.error('Failed to create or update address.');
                console.error('Failed to create or update address:', error);
            }
        } else {
            toast.warn('Please fill in required fields.');
        }
    };

    // Handle deleting an address
    const handleDeleteAddress = async () => {
        if (addressToDelete) {
            try {
                await deleteAddress(addressToDelete);
                setAddresses(addresses.filter(addr => addr._id !== addressToDelete));
                toast.success('Address deleted successfully!');
                setAddressToDelete(null);
                setIsConfirmOpen(false);
            } catch (error) {
                toast.error('Failed to delete address.');
                console.error('Failed to delete address:', error);
            }
        }
    };

    return (
        <div className="relative p-6 bg-gray-100 h-96">
            {/* Title */}
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Addresses</h2>


            {/* address list display */}
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                {addresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-10">
                        <p className="text-gray-600 text-lg font-semibold">No addresses yet. Add your first address!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div
                                key={address._id}
                                className="bg-white p-4 rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                            >
                                <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900">{address.title}</h3>
                                    <div className="flex space-x-2 items-center">
                                        <span
                                            className="cursor-pointer text-gray-600 hover:text-gray-800 transition duration-300"
                                            onClick={() => handleToggleExpand(address._id)}
                                        >
                                            {expandedAddressId === address._id ? <HiChevronUp /> : <HiChevronDown />}
                                        </span>
                                        <HiPencil
                                            className="text-blue-600 cursor-pointer hover:text-blue-700 transition duration-300"
                                            onClick={() => {
                                                setNewAddress(address);
                                                setEditAddressId(address._id);
                                                setIsPopupOpen(true);
                                            }}
                                        />
                                        <HiTrash
                                            className="text-red-600 cursor-pointer hover:text-red-700 transition duration-300"
                                            onClick={() => {
                                                setAddressToDelete(address._id);
                                                setIsConfirmOpen(true);
                                            }}
                                        />
                                        <HiShare className="text-green-600 cursor-pointer" />
                                    </div>
                                </div>

                                {expandedAddressId === address._id && (
                                    <div className="space-y-1 px-32">
                                        {address.personName && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">Person Name:</p>
                                                <p className="text-base text-gray-900">{address.personName}</p>
                                            </div>
                                        )}
                                        {address.username && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">Username:</p>
                                                <p className="text-base text-gray-900">{address.username}</p>
                                            </div>
                                        )}
                                        {address.gender && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">Gender:</p>
                                                <p className="text-base text-gray-900">{address.gender}</p>
                                            </div>
                                        )}
                                        {address.birthday && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">Birthday:</p>
                                                <p className="text-base text-gray-900">{new Date(address.birthday).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                        {address.company && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">Company:</p>
                                                <p className="text-base text-gray-900">{address.company}</p>
                                            </div>
                                        )}
                                        {address.address && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">Address:</p>
                                                <p className="text-base text-gray-900">{address.address}</p>
                                            </div>
                                        )}
                                        {address.city && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">City:</p>
                                                <p className="text-base text-gray-900">{address.city}</p>
                                            </div>
                                        )}
                                        {address.state && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">State:</p>
                                                <p className="text-base text-gray-900">{address.state}</p>
                                            </div>
                                        )}
                                        {address.postalCode && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">Postal Code:</p>
                                                <p className="text-base text-gray-900">{address.postalCode}</p>
                                            </div>
                                        )}
                                        {address.country && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">Country:</p>
                                                <p className="text-base text-gray-900">{address.country}</p>
                                            </div>
                                        )}
                                        {address.timezone && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">Timezone:</p>
                                                <p className="text-base text-gray-900">{address.timezone}</p>
                                            </div>
                                        )}
                                        {address.emailAddress && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">Email Address:</p>
                                                <p className="text-base text-gray-900">{address.emailAddress}</p>
                                            </div>
                                        )}
                                        {address.phone && (
                                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                                <p className="text-base font-semibold text-gray-700">Phone:</p>
                                                <p className="text-base text-gray-900">{address.phone}</p>
                                            </div>
                                        )}
                                        {address.notes && (
                                            <div className="flex justify-between items-center py-1">
                                                <p className="text-base font-semibold text-gray-700">Notes:</p>
                                                <p className="text-base text-gray-900">{address.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Floating button to add a new address */}
            <button
                className="fixed bottom-4 right-4 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition duration-300"
                onClick={() => {
                    setNewAddress({
                        title: '',
                        personName: '',
                        username: '',
                        gender: '',
                        birthday: '',
                        company: '',
                        address: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        country: '',
                        timezone: '',
                        emailAddress: '',
                        phone: '',
                        notes: ''
                    });
                    setEditAddressId(null);
                    setIsPopupOpen(true);
                }}
            >
                <HiPlus size={24} />
            </button>

            {/* Popup form for creating or editing an address */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8 overflow-auto max-h-[90vh]">
                        <h3 className="text-xl font-semibold mb-6">{editAddressId ? 'Edit Address' : 'Create Address'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Form Fields */}
                            {Object.keys(newAddress).map((key) => (
                                <div key={key} className="mb-4">
                                    {key === 'gender' ? (
                                        <div className="flex items-center space-x-4">
                                            <label className="mr-2">Gender:</label>
                                            {['Male', 'Female', 'Other'].map(g => (
                                                <label key={g} className="inline-flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value={g}
                                                        checked={newAddress.gender === g}
                                                        onChange={(e) => setNewAddress({ ...newAddress, gender: e.target.value })}
                                                    />
                                                    <span>{g}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : key === 'birthday' ? (
                                        <input
                                            type="date"
                                            value={newAddress[key]}
                                            onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                            className="border border-gray-300 p-2 w-full rounded-lg"
                                        />
                                    ) : (
                                        <input
                                            type={key === 'emailAddress' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                                            value={newAddress[key]}
                                            onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                            className="border border-gray-300 p-2 w-full rounded-lg"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                onClick={handleCreateOrEditAddress}
                            >
                                {editAddressId ? 'Update Address' : 'Create Address'}
                            </button>
                            <button
                                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                                onClick={() => setIsPopupOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation dialog for deleting an address */}
            {isConfirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h4 className="text-lg font-semibold mb-4">Confirm Deletion</h4>
                        <p className="text-gray-700 mb-6">Are you sure you want to delete this address?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                                onClick={handleDeleteAddress}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Address;
