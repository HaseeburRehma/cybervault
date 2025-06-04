import React, { useEffect, useState } from 'react';
import { HiUserCircle, HiArrowLeft } from 'react-icons/hi';
import { AiOutlineFolder, AiOutlineTeam, AiOutlineCreditCard, AiOutlineSetting, AiOutlineFileText } from 'react-icons/ai';
import { MdDarkMode, MdAutorenew } from 'react-icons/md';
import { MdArrowForward, MdArrowBack } from 'react-icons/md';
import { FaAddressBook, FaKey, FaShareAlt, FaLifeRing, FaCreditCard } from 'react-icons/fa';
import { getUserDetails } from '../Api_integration/userApi';
import './style.css';
import AddressFolder from './AddressFolder';
import VaultFolder from './VaultFolder';
import BankCardFolder from './BankCardFolder';
import BankCard from './BankCard';
import BankAccountFolder from './BankAccountFolder';
import BankAccount from './BankAccount';
import PasswordVault from './passwordVault';
import Autofill from './autoFill';
import PassGenerator from './passwordGenerator';
import DarkWeb from './darkWeb';
import Team from './team';
import Address from './Address';
import Note from './Note';
import NoteFolder from './NoteFolder';
import Sharing from './sharing';
import Support from './Support';
import Setting from './Setting';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [activeSection, setActiveSection] = useState('Vault Folder');
    const [userData, setUserData] = useState({ username: '', plan: '' });
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarMinimized, setSidebarMinimized] = useState(false);
    const [activeFolderId, setActiveFolderId] = useState(null);
    const [folderType, setFolderType] = useState(null);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const user = await getUserDetails(token);
                if (user) {
                    setUserData(user);
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, []);

    const sidebarLinks = [
        { label: 'Vault', section: 'Vault Folder', icon: <AiOutlineFolder />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Sharing', section: 'Sharing is caring', icon: <FaShareAlt />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Password Generator', section: 'Pass Generator', icon: <FaKey />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Autofill', section: 'Autofill', icon: <MdAutorenew />, plan: ['Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Dark Web', section: 'Dark Web', icon: <MdDarkMode />, plan: ['Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Team', section: 'Team', icon: <AiOutlineTeam />, plan: ['Platinum', 'Premium'] },
        { label: 'Address', section: 'Address', icon: <FaAddressBook />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Notes', section: 'Notes', icon: <AiOutlineFileText />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Bank Account', section: 'Bank Account', icon: <AiOutlineCreditCard />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Credit Card', section: 'Credit Card', icon: <FaCreditCard />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Support', section: 'Support', icon: <FaLifeRing />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Settings', section: 'Setting', icon: <AiOutlineSetting />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] }
    ];

    const handleSidebarClick = (section) => {
        setHistory([...history, activeSection]);
        setActiveSection(section);
        setActiveFolderId(null);
        setFolderType(null);
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    const handleBackClick = () => {
        const newHistory = [...history];
        const previousSection = newHistory.pop();
        setActiveSection(previousSection || 'Vault Folder');
        setHistory(newHistory);
    };

    const handleSidebarMinimizeToggle = () => {
        setSidebarMinimized(!sidebarMinimized);
    };

    const renderContent = () => {
        if (activeFolderId) {
            switch (folderType) {
                case 'Vault': return <PasswordVault folderId={activeFolderId} />;
                case 'Address': return <Address folderId={activeFolderId} />;
                case 'Note': return <Note folderId={activeFolderId} />;
                case 'Card': return <BankCard folderId={activeFolderId} />;
                case 'BankAccount': return <BankAccount folderId={activeFolderId} />;
                default: return null;
            }
        }

        switch (activeSection) {
            case 'Vault Folder':
                return <VaultFolder setActiveFolderId={(id) => {
                    setActiveFolderId(id);
                    setFolderType('Vault');
                }} />;
            case 'Pass Generator': return <PassGenerator />;
            case 'Autofill': return <Autofill />;
            case 'Dark Web': return <DarkWeb />;
            case 'Team': return <Team />;
            case 'Address':
                return <AddressFolder setActiveFolderId={(id) => {
                    setActiveFolderId(id);
                    setFolderType('Address');
                }} />;
            case 'Notes':
                return <NoteFolder onSelectFolder={(id) => {
                    setActiveFolderId(id);
                    setFolderType('Note');
                }} />;
            case 'Sharing is caring': return <Sharing />;
            case 'Setting': return <Setting />;
            case 'Bank Account':
                return <BankAccountFolder onSelectFolder={(id) => {
                    setActiveFolderId(id);
                    setFolderType('BankAccount');
                }} />;
            case 'Credit Card':
                return <BankCardFolder onSelectFolder={(id) => {
                    setActiveFolderId(id);
                    setFolderType('Card');
                }} />;
            case 'Support': return <Support />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Top Bar */}
            <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {history.length > 0 && (
                        <button onClick={handleBackClick} className="text-gray-600 hover:text-gray-800">
                            <HiArrowLeft size={24} />
                        </button>
                    )}
                    <h1 className="text-2xl font-bold text-gray-800">{activeSection}</h1>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                            {userData.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-700 font-medium">{userData.username}</span>
                    </div>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/');
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarMinimized ? 'w-20' : 'w-64'}`}>
                    <div className="flex flex-col h-full">
                        {/* Logo */}
                        <div className="p-4 border-b border-gray-200">
                            <img 
                                src="/images/passlogo3.png" 
                                alt="Logo" 
                                className={`transition-all duration-300 ${sidebarMinimized ? 'w-12 h-12' : 'w-32 h-32'} mx-auto`}
                            />
                        </div>

                        {/* Toggle Button */}
                        <button 
                            onClick={handleSidebarMinimizeToggle}
                            className="p-2 hover:bg-gray-100 self-end text-gray-600"
                        >
                            {sidebarMinimized ? <MdArrowForward size={20} /> : <MdArrowBack size={20} />}
                        </button>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto py-4">
                            {sidebarLinks.map((link, index) => (
                                link.plan.includes(userData.plan) && (
                                    <button
                                        key={index}
                                        onClick={() => handleSidebarClick(link.section)}
                                        className={`w-full flex items-center px-4 py-3 transition-colors ${
                                            activeSection === link.section 
                                            ? 'bg-emerald-50 text-emerald-600' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-xl">{link.icon}</span>
                                        {!sidebarMinimized && (
                                            <span className="ml-3 font-medium">{link.label}</span>
                                        )}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;