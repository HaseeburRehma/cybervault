// import React, { useEffect, useState } from 'react';
// import { HiOutlineMenu, HiX, HiUserCircle, HiArrowLeft } from 'react-icons/hi';
// import { getUserDetails } from '../Api_integration/userApi';
// import './style.css';
// import AddressFolder from './AddressFolder';
// import VaultFolder from './VaultFolder';
// import BankCardFolder from './BankCardFolder';
// import BankCard from './BankCard';
// import BankAccountFolder from './BankAccountFolder';
// import BankAccount from './BankAccount';
// import PasswordVault from './passwordVault';
// import Autofill from './autoFill';
// import PassGenerator from './passwordGenerator';
// import DarkWeb from './darkWeb';
// import Team from './team';
// import Address from './Address';
// import Note from './Note';
// import NoteFolder from './NoteFolder';
// import Sharing from './sharing';
// import Support from './Support';
// import Setting from './Setting';

// import { Link, useNavigate } from 'react-router-dom';

// const UserProfile = () => {
//     const [activeSection, setActiveSection] = useState('Vault Folder');
//     const [userData, setUserData] = useState({ username: '', plan: '' });
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const [activeFolderId, setActiveFolderId] = useState(null);
//     const [folderType, setFolderType] = useState(null);
//     const [history, setHistory] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     console.error('No token found. Redirect to login page or handle authentication.');
//                     return;
//                 }

//                 const user = await getUserDetails(token);
//                 if (user) {
//                     setUserData(user);
//                 } else {
//                     console.error('Failed to fetch user data.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching user data:', error.message);
//             }
//         };

//         fetchUserData();
//     }, []);

//     const sidebarLinks = [
//         { label: 'Vault Folder', section: 'Vault Folder', plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium', 'team member'] },
//         { label: 'Sharing is caring', section: 'Sharing is caring', plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium', 'team member'] },
//         { label: 'Pass Generator', section: 'Pass Generator', plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium', 'team member'] },
//         { label: 'Autofill', section: 'Autofill', plan: ['Basic', 'Silver', 'Gold', 'Platinum', 'Premium', 'team member'] },
//         { label: 'Dark Web', section: 'Dark Web', plan: ['Basic', 'Silver', 'Gold', 'Platinum', 'Premium', 'team member'] },
//         { label: 'Team', section: 'Team', plan: ['Platinum', 'Premium'] },
//         { label: 'Address', section: 'Address', plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium', 'team member'] },
//         { label: 'Notes', section: 'Notes', plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium', 'team member'] },
//         { label: 'Bank Account', section: 'Bank Account', plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium', 'team member'] },
//         { label: 'Credit Card', section: 'Credit Card', plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium', 'team member'] },
//         { label: 'Support', section: 'Support', plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium', 'team member'] },
//         { label: 'Setting', section: 'Setting', plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium', 'team member'] }

//     ];

//     const handleSidebarClick = (section) => {
//         setHistory([...history, activeSection]);
//         setActiveSection(section);
//         setActiveFolderId(null); // Ensure this is what you want
//         setFolderType(null); // Reset folder type
//         setSidebarOpen(false);
//         console.log('Sidebar clicked:', section);
//     };

//     const handleBackClick = () => {
//         const newHistory = [...history];
//         const previousSection = newHistory.pop();
//         setActiveSection(previousSection || 'Vault Folder');
//         setHistory(newHistory);
//     };

//     const renderContent = () => {
//         if (activeFolderId) {
//             if (folderType === 'Vault') {
//                 return <PasswordVault folderId={activeFolderId} />;
//             } else if (folderType === 'Address') {
//                 return <Address folderId={activeFolderId} />;
//             } else if (folderType === 'Note') {
//                 return <Note folderId={activeFolderId} />;
//             } else if (folderType === 'Card') {
//                 return <BankCard folderId={activeFolderId} />;
//             } else if (folderType === 'BankAccount') {
//                 return <BankAccount folderId={activeFolderId} />;
//             }

//         }

//         switch (activeSection) {
//             case 'Vault Folder':
//                 return <VaultFolder setActiveFolderId={(id) => {
//                     console.log('Setting active folder ID to:', id);
//                     setActiveFolderId(id);
//                     setFolderType('Vault');
//                 }} />;
//             case 'Pass Generator':
//                 return <PassGenerator />;
//             case 'Autofill':
//                 return <Autofill />;
//             case 'Dark Web':
//                 return <DarkWeb />;
//             case 'Team':
//                 return <Team />;
//             case 'Address':
//                 return <AddressFolder setActiveFolderId={(id) => {
//                     console.log('Setting active folder ID to:', id);
//                     setActiveFolderId(id);
//                     setFolderType('Address');
//                 }} />;
//             case 'Notes':
//                 return <NoteFolder onSelectFolder={(id) => {
//                     console.log('Setting active folder ID to:', id);
//                     setActiveFolderId(id);
//                     setFolderType('Note');
//                 }} />;
//             case 'Sharing':
//                 return <Sharing />;
//             case 'Setting':
//                 return <Setting />;

//             // New sections
//             case 'Sharing is caring':
//                 return <div>Sharing is caring content goes here</div>;
//             case 'Bank Account':
//                 return <BankAccountFolder onSelectFolder={(id) => {
//                     console.log('Setting active folder ID to:', id);
//                     setActiveFolderId(id);
//                     setFolderType('BankAccount');
//                 }} />;           
//             case 'Credit Card':
//                 return <BankCardFolder onSelectFolder={(id) => {
//                     console.log('Setting active folder ID to:', id);
//                     setActiveFolderId(id);
//                     setFolderType('Card');
//                 }} />;
//             case 'Support':
//                 return <Support/>;
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="flex">
//             <button
//                 className="fixed lg:hidden top-15 right-0 m-6 p-2 rounded-full bg-gray-900 text-white"
//                 onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//                 {sidebarOpen ? <HiX size={30} /> : <HiOutlineMenu size={30} />}
//             </button>

//             {/* sidebar */}
//             <div className={`sidebar z-100 w-64 bg-gray-800 text-white p-6 fixed inset-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
//                 <div className="sidebar-header pb-6 -p-6">
//                     <div className="logo mb-4">
//                         <img src="/images/passlogo3.png" alt="Logo" />
//                     </div>
//                 </div>
//                 <div className="py-6">
//                     <div className="flex items-center mb-6">
//                         <div className="rounded-full bg-gray-300 text-gray-800 font-semibold text-xl w-10 h-10 flex items-center justify-center mr-3">
//                             {userData.username.substring(0, 2).toUpperCase()}
//                         </div>
//                         <h2 className="text-lg font-semibold">
//                             {userData.username} Dashboard
//                         </h2>
//                     </div>
//                     <ul>
//                         {sidebarLinks.map((link, index) => (
//                             link.plan.includes(userData.plan) && (
//                                 <li key={index} className="mb-6">
//                                     <Link
//                                         to="#"
//                                         onClick={() => handleSidebarClick(link.section)}
//                                         className={`flex items-center hover:text-cyan-300 transition duration-300 ${activeSection === link.section ? 'text-cyan-200' : ''}`}
//                                     >
//                                         <span className="text-lg font-semibold">{link.label}</span>
//                                     </Link>
//                                 </li>
//                             )
//                         ))}
//                     </ul>
//                 </div>
//             </div>

//             {/* Dashboard nav & component render */}
//             <div className="content-wrapper flex-1 flex flex-col">
//                 <div className="navbar bg-gray-800 text-white p-4 flex justify-between">
//                     <button
//                         onClick={handleBackClick}
//                         className="flex items-center text-white mr-4"
//                     >
//                         <HiArrowLeft size={24} className="mr-2" />
//                         Back
//                     </button>
//                     <div className="flex items-center">
//                         <HiUserCircle size={24} className="mr-2" />
//                         <span>{userData.username}</span>
//                         <button className="ml-4 bg-red-500 px-3 py-1 rounded" onClick={() => {
//                             localStorage.removeItem('token');
//                             navigate('/');
//                         }}>
//                             Logout
//                         </button>
//                     </div>
//                 </div>

//                 <div className="flex-1 h-96 overflow-y-auto">
//                     {renderContent()}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserProfile;


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
    const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar is open by default on larger screens
    const [sidebarMinimized, setSidebarMinimized] = useState(false); // Controls sidebar minimization on larger screens
    const [activeFolderId, setActiveFolderId] = useState(null);
    const [folderType, setFolderType] = useState(null);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found. Redirect to login page or handle authentication.');
                    return;
                }

                const user = await getUserDetails(token);
                if (user) {
                    setUserData(user);
                } else {
                    console.error('Failed to fetch user data.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, []);

    const sidebarLinks = [
        { label: 'Vault', section: 'Vault Folder', icon: <AiOutlineFolder />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Sharing is caring', section: 'Sharing is caring', icon: <FaShareAlt />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Pass Generator', section: 'Pass Generator', icon: <FaKey />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Autofill', section: 'Autofill', icon: <MdAutorenew />, plan: ['Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Dark Web', section: 'Dark Web', icon: <MdDarkMode />, plan: ['Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Team', section: 'Team', icon: <AiOutlineTeam />, plan: ['Platinum', 'Premium'] },
        { label: 'Address', section: 'Address', icon: <FaAddressBook />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Notes', section: 'Notes', icon: <AiOutlineFileText />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Bank Account', section: 'Bank Account', icon: <AiOutlineCreditCard />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Credit Card', section: 'Credit Card', icon: <FaCreditCard />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Support', section: 'Support', icon: <FaLifeRing />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] },
        { label: 'Setting', section: 'Setting', icon: <AiOutlineSetting />, plan: ['Free', 'Basic', 'Silver', 'Gold', 'Platinum', 'Premium'] }
    ];

    const handleSidebarClick = (section) => {
        setHistory([...history, activeSection]);
        setActiveSection(section);
        setActiveFolderId(null); // Ensure this is what you want
        setFolderType(null); // Reset folder type
        if (window.innerWidth < 1024) setSidebarOpen(false); // Close sidebar on small screens
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
            if (folderType === 'Vault') {
                return <PasswordVault folderId={activeFolderId} />;
            } else if (folderType === 'Address') {
                return <Address folderId={activeFolderId} />;
            } else if (folderType === 'Note') {
                return <Note folderId={activeFolderId} />;
            } else if (folderType === 'Card') {
                return <BankCard folderId={activeFolderId} />;
            } else if (folderType === 'BankAccount') {
                return <BankAccount folderId={activeFolderId} />;
            }

        }

        switch (activeSection) {
            case 'Vault Folder':
                return <VaultFolder setActiveFolderId={(id) => {
                    console.log('Setting active folder ID to:', id);
                    setActiveFolderId(id);
                    setFolderType('Vault');
                }} />;
            case 'Pass Generator':
                return <PassGenerator />;
            case 'Autofill':
                return <Autofill />;
            case 'Dark Web':
                return <DarkWeb />;
            case 'Team':
                return <Team />;
            case 'Address':
                return <AddressFolder setActiveFolderId={(id) => {
                    console.log('Setting active folder ID to:', id);
                    setActiveFolderId(id);
                    setFolderType('Address');
                }} />;
            case 'Notes':
                return <NoteFolder onSelectFolder={(id) => {
                    console.log('Setting active folder ID to:', id);
                    setActiveFolderId(id);
                    setFolderType('Note');
                }} />;
            case 'Sharing':
                return <Sharing />;
            case 'Setting':
                return <Setting />;

            // New sections
            case 'Sharing is caring':
                return <div>Sharing is caring content goes here</div>;
            case 'Bank Account':
                return <BankAccountFolder onSelectFolder={(id) => {
                    console.log('Setting active folder ID to:', id);
                    setActiveFolderId(id);
                    setFolderType('BankAccount');
                }} />;
            case 'Credit Card':
                return <BankCardFolder onSelectFolder={(id) => {
                    console.log('Setting active folder ID to:', id);
                    setActiveFolderId(id);
                    setFolderType('Card');
                }} />;
            case 'Support':
                return <Support />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Top Bar */}
            <div className="flex items-center px-4 py-2 bg-gray-200 shadow-md w-full relative">
                {/* Back Button */}
                {history.length > 0 && (
                    <button onClick={handleBackClick} className="absolute left-4 text-lg text-gray-800 hover:text-gray-600 transition-colors">
                        <HiArrowLeft size={30} />
                    </button>
                )}
                {/* Current Component Name */}
                <div className="flex-1 flex justify-center text-2xl font-bold text-gray-700">
                    {activeSection}
                </div>
                {/* User Profile and Logout */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <HiUserCircle size={40} className="text-gray-700" />
                        <span className="text-lg font-semibold text-gray-700">{userData.username}</span>
                    </div>
                    <button onClick={() => navigate('/')} className="text-red-500 hover:text-red-700">
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className={` bg-gray-800 text-white transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarMinimized ? 'w-20' : 'w-64'}`}>
                    <div className="flex flex-col h-full">
                        {/* Sidebar Image */}
                        <div className="flex items-center justify-center py-2 bg-gray-900">
                            <img src="/images/passlogo3.png" alt="Sidebar Logo" className={` transition-opacity ${sidebarMinimized ? 'opacity-80 mt-2' : 'opacity-100 -mt-8'}`} />
                        </div>
                        {/* Sidebar Toggle Button */}
                        <button onClick={handleSidebarMinimizeToggle} className="text-white ml-auto mt-2 p-1">
                            {sidebarMinimized ? <MdArrowForward className="text-2xl font-extrabold	" /> : <MdArrowBack className="text-2xl font-bold" />}
                        </button>
                        {/* Sidebar Links */}
                        <div className="flex-1 flex flex-col px-2">
                            {sidebarLinks.map(({ label, section, icon, plan }, index) =>
                            (plan.includes(userData.plan) ? (
                                <button
                                    key={index}
                                    onClick={() => handleSidebarClick(section)}
                                    className={`flex items-center px-4 py-2 mt-2 rounded-md text-white hover:bg-gray-700 ${activeSection === section ? 'bg-gray-700' : 'bg-gray-800'}`}
                                >
                                    <span className="text-xl">{icon}</span>
                                    <span className={`ml-3 ${sidebarMinimized ? 'hidden' : ''}`}>{label}</span>
                                </button>
                            ) : null)
                            )}
                        </div>
                    </div>
                </div>
                {/* Content */}
                <div className="flex-1 p-4 bg-gray-50 h-[150vh] overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;


