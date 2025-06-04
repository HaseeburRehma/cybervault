import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { createAccount, getAccounts, updateAccount, deleteAccount } from '../Api_integration/bankaccountApi';

const BankAccount = ({ folderId }) => {
    const [accounts, setAccounts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentAccount, setCurrentAccount] = useState({
        bankName: '',
        accountType: '',
        routingNumber: '',
        accountNumber: '',
        swiftCode: '',
        ibanNumber: '',
        pin: '',
        branchAddress: '',
        branchPhone: '',
        notes: '',
        id: null
    });
    const [errors, setErrors] = useState({});
    const [expandedAccount, setExpandedAccount] = useState(null);

    useEffect(() => {
        if (folderId) {
            loadAccounts();
        }
    }, [folderId]);

    const loadAccounts = async () => {
        try {
            const data = await getAccounts(folderId);
            setAccounts(data);
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!currentAccount.bankName) newErrors.bankName = 'Bank Name is required';
        if (!currentAccount.accountType) newErrors.accountType = 'Account Type is required';
        if (!currentAccount.routingNumber) newErrors.routingNumber = 'Routing Number is required';
        if (!currentAccount.accountNumber) newErrors.accountNumber = 'Account Number is required';
        if (!currentAccount.swiftCode) newErrors.swiftCode = 'SWIFT Code is required';
        if (!currentAccount.ibanNumber) newErrors.ibanNumber = 'IBAN Number is required';
        if (!currentAccount.pin) newErrors.pin = 'PIN is required';
        if (!currentAccount.branchAddress) newErrors.branchAddress = 'Branch Address is required';
        if (!currentAccount.branchPhone) newErrors.branchPhone = 'Branch Phone is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateOrUpdateAccount = async () => {
        if (!validateForm()) return;

        try {
            if (currentAccount.id) {
                await updateAccount(currentAccount.id, currentAccount);
            } else {
                await createAccount({ ...currentAccount, folderId });
            }
            loadAccounts();
            setShowPopup(false);
        } catch (error) {
            console.error('Error creating/updating account:', error);
        }
    };

    const handleEdit = (account) => {
        setCurrentAccount({
            bankName: account.bankName,
            accountType: account.accountType,
            routingNumber: account.routingNumber,
            accountNumber: account.accountNumber,
            swiftCode: account.swiftCode,
            ibanNumber: account.ibanNumber,
            pin: account.pin,
            branchAddress: account.branchAddress,
            branchPhone: account.branchPhone,
            notes: account.notes,
            id: account._id
        });
        setShowPopup(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteAccount(id);
            loadAccounts();
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const handleOpenCreatePopup = () => {
        setCurrentAccount({
            bankName: '',
            accountType: '',
            routingNumber: '',
            accountNumber: '',
            swiftCode: '',
            ibanNumber: '',
            pin: '',
            branchAddress: '',
            branchPhone: '',
            notes: '',
            id: null
        });
        setShowPopup(true);
    };

    const toggleDetails = (accountId) => {
        setExpandedAccount(expandedAccount === accountId ? null : accountId);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-6">
                <h2 className="text-3xl font-bold capitalize">Bank Accounts</h2>
                <p className="text-lg text-gray-600"><span className='font-bold'>{accounts.length} Total</span> Account{accounts.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.length > 0 ? (
                    accounts.map((account) => (
                        <div key={account._id} className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-4">
                                <p className="text-lg font-semibold text-xl text-gray-700">{account.bankName}</p>
                                <button
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={() => toggleDetails(account._id)}
                                >
                                    {expandedAccount === account._id ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                                {expandedAccount === account._id && (
                                    <div className="mt-4 text-gray-700">
                                        <p><strong>Account Type:</strong> {account.accountType}</p>
                                        <p><strong>Account Number:</strong> {account.accountNumber}</p>
                                        <p><strong>Routing Number:</strong> {account.routingNumber}</p>
                                        <p><strong>SWIFT Code:</strong> {account.swiftCode}</p>
                                        <p><strong>IBAN Number:</strong> {account.ibanNumber}</p>
                                        <p><strong>PIN:</strong> {account.pin}</p>
                                        <p><strong>Branch Address:</strong> {account.branchAddress}</p>
                                        <p><strong>Branch Phone:</strong> {account.branchPhone}</p>
                                        <p><strong>Notes:</strong> {account.notes}</p>
                                    </div>
                                )}
                            </div>
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <FaEdit className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-200" onClick={() => handleEdit(account)} />
                                <FaTrash className="text-red-600 cursor-pointer hover:text-red-800 transition-colors duration-200" onClick={() => handleDelete(account._id)} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No bank accounts found.</p>
                )}
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-2">{currentAccount.id ? 'Edit Account' : 'Create Account'}</h3>
                        <div className="space-y-0">
                            <input
                                type="text"
                                className={`border ${errors.bankName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                placeholder="Bank Name"
                                value={currentAccount.bankName}
                                onChange={(e) => setCurrentAccount({ ...currentAccount, bankName: e.target.value })}
                            />
                            {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}

                            <input
                                type="text"
                                className={`border ${errors.accountType ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                placeholder="Account Type"
                                value={currentAccount.accountType}
                                onChange={(e) => setCurrentAccount({ ...currentAccount, accountType: e.target.value })}
                            />
                            {errors.accountType && <p className="text-red-500 text-sm">{errors.accountType}</p>}

                            <input
                                type="text"
                                className={`border ${errors.routingNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                placeholder="Routing Number"
                                value={currentAccount.routingNumber}
                                onChange={(e) => setCurrentAccount({ ...currentAccount, routingNumber: e.target.value })}
                            />
                            {errors.routingNumber && <p className="text-red-500 text-sm">{errors.routingNumber}</p>}

                            <input
                                type="text"
                                className={`border ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                placeholder="Account Number"
                                value={currentAccount.accountNumber}
                                onChange={(e) => setCurrentAccount({ ...currentAccount, accountNumber: e.target.value })}
                            />
                            {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}

                            <input
                                type="text"
                                className={`border ${errors.swiftCode ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                placeholder="SWIFT Code"
                                value={currentAccount.swiftCode}
                                onChange={(e) => setCurrentAccount({ ...currentAccount, swiftCode: e.target.value })}
                            />
                            {errors.swiftCode && <p className="text-red-500 text-sm">{errors.swiftCode}</p>}

                            <input
                                type="text"
                                className={`border ${errors.ibanNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                placeholder="IBAN Number"
                                value={currentAccount.ibanNumber}
                                onChange={(e) => setCurrentAccount({ ...currentAccount, ibanNumber: e.target.value })}
                            />
                            {errors.ibanNumber && <p className="text-red-500 text-sm">{errors.ibanNumber}</p>}

                            <input
                                type="password"
                                className={`border ${errors.pin ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                placeholder="PIN"
                                value={currentAccount.pin}
                                onChange={(e) => setCurrentAccount({ ...currentAccount, pin: e.target.value })}
                            />
                            {errors.pin && <p className="text-red-500 text-sm">{errors.pin}</p>}

                            <input
                                type="text"
                                className={`border ${errors.branchAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                placeholder="Branch Address"
                                value={currentAccount.branchAddress}
                                onChange={(e) => setCurrentAccount({ ...currentAccount, branchAddress: e.target.value })}
                            />
                            {errors.branchAddress && <p className="text-red-500 text-sm">{errors.branchAddress}</p>}

                            <input
                                type="text"
                                className={`border ${errors.branchPhone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                placeholder="Branch Phone"
                                value={currentAccount.branchPhone}
                                onChange={(e) => setCurrentAccount({ ...currentAccount, branchPhone: e.target.value })}
                            />
                            {errors.branchPhone && <p className="text-red-500 text-sm">{errors.branchPhone}</p>}

                            <textarea
                                className="border border-gray-300 rounded-lg p-3 w-full"
                                placeholder="Notes"
                                value={currentAccount.notes}
                                onChange={(e) => setCurrentAccount({ ...currentAccount, notes: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                className="bg-gray-300 text-gray-700 rounded-lg px-6 py-2 hover:bg-gray-400 transition-colors duration-200"
                                onClick={() => setShowPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition-colors duration-200"
                                onClick={handleCreateOrUpdateAccount}
                            >
                                {currentAccount.id ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                onClick={handleOpenCreatePopup}
            >
                <FaPlus className="mr-2" /> Add Account
            </button>
        </div>
    );
};

export default BankAccount;
