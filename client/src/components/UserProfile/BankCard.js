import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getCards, createCard, updateCard, deleteCard } from '../Api_integration/cardApi';

const BankCard = ({ folderId }) => {
    const [cards, setCards] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [cardData, setCardData] = useState({ nameOnCard: '', type: '', number: '', securityCode: '', startDate: '', expirationDate: '', notes: '' });
    const [editingCardId, setEditingCardId] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);

    useEffect(() => {
        if (folderId) {
            fetchCards();
        }
    }, [folderId]);

    const fetchCards = async () => {
        try {
            const fetchedCards = await getCards(folderId);
            setCards(fetchedCards);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };

    const handleCreateCard = async () => {
        try {
            if (editingCardId) {
                await updateCard(editingCardId, cardData);
            } else {
                await createCard({ ...cardData, folder: folderId });
            }
            setCardData({ nameOnCard: '', type: '', number: '', securityCode: '', startDate: '', expirationDate: '', notes: '' });
            setEditingCardId(null);
            setShowPopup(false);
            fetchCards();
        } catch (error) {
            console.error('Error creating/updating card:', error);
        }
    };

    const handleEditCard = (card) => {
        setCardData({
            nameOnCard: card.nameOnCard,
            type: card.type,
            number: card.number,
            securityCode: card.securityCode,
            startDate: card.startDate,
            expirationDate: card.expirationDate,
            notes: card.notes
        });
        setEditingCardId(card._id);
        setShowPopup(true);
    };

    const handleDeleteCard = async (id) => {
        try {
            await deleteCard(id);
            fetchCards();
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    const handleOpenCreatePopup = () => {
        setCardData({ nameOnCard: '', type: '', number: '', securityCode: '', startDate: '', expirationDate: '', notes: '' });
        setEditingCardId(null);
        setShowPopup(true);
    };

    const handleToggleCard = (id) => {
        setExpandedCardId(expandedCardId === id ? null : id);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Bank Cards</h2>
                <p className="text-lg text-gray-600"><span className='font-bold'>{cards.length} Total</span> Card{cards.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.length > 0 ? (
                    cards.map((card) => (
                        <div key={card._id} className="relative bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                            <div className="p-4 cursor-pointer" onClick={() => handleToggleCard(card._id)}>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800">{card.nameOnCard}</h3>
                                    {expandedCardId === card._id ? (
                                        <FaChevronUp className="text-gray-600" />
                                    ) : (
                                        <FaChevronDown className="text-gray-600" />
                                    )}
                                </div>
                                {expandedCardId === card._id && (
                                    <div className="mt-4 rounded-lg bg-gray-100 p-4 shadow-md border border-gray-300">
                                        <p className="text-sm text-gray-700 mb-2"><strong>Type:</strong> {card.type}</p>
                                        <p className="text-sm text-gray-700 mb-2"><strong>Number:</strong> {card.number}</p>
                                        <p className="text-sm text-gray-700 mb-2"><strong>Expiry Date:</strong> {new Date(card.expirationDate).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-700"><strong>Notes:</strong> {card.notes}</p>
                                    </div>
                                )}
                            </div>
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <FaEdit className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-200" onClick={() => handleEditCard(card)} />
                                <FaTrash className="text-red-600 cursor-pointer hover:text-red-800 transition-colors duration-200" onClick={() => handleDeleteCard(card._id)} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 col-span-full">No cards available</div>
                )}
            </div>

            {/* Create/Edit Card Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">{editingCardId ? 'Edit Card' : 'Create Card'}</h3>
                        <input
                            type="text"
                            value={cardData.nameOnCard}
                            onChange={(e) => setCardData({ ...cardData, nameOnCard: e.target.value })}
                            placeholder="Name on Card"
                            className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={cardData.type}
                            onChange={(e) => setCardData({ ...cardData, type: e.target.value })}
                            placeholder="Type"
                            className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            placeholder="Number"
                            className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={cardData.securityCode}
                            onChange={(e) => setCardData({ ...cardData, securityCode: e.target.value })}
                            placeholder="Security Code"
                            className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="date"
                            value={cardData.startDate}
                            onChange={(e) => setCardData({ ...cardData, startDate: e.target.value })}
                            placeholder="Start Date"
                            className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="date"
                            value={cardData.expirationDate}
                            onChange={(e) => setCardData({ ...cardData, expirationDate: e.target.value })}
                            placeholder="Expiration Date"
                            className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            value={cardData.notes}
                            onChange={(e) => setCardData({ ...cardData, notes: e.target.value })}
                            placeholder="Notes"
                            className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end space-x-4">
                            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200" onClick={() => setShowPopup(false)}>Cancel</button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200" onClick={handleCreateCard}>
                                {editingCardId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <FaPlus className="fixed bottom-6 right-6 text-5xl text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-200" onClick={handleOpenCreatePopup} />
        </div>
    );
};

export default BankCard;
