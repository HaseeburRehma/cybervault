import React, { useEffect, useState } from 'react';
import { getUserDetails } from '../Api_integration/userApi';
import {changePassword} from '../Api_integration/authApi';
import { FaUser, FaEnvelope, FaCalendar, FaStar } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'tailwindcss/tailwind.css';

const Setting = () => {
  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = await getUserDetails(token);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
    AOS.init({ duration: 1000 });
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await changePassword(token, { userId: user._id, oldPassword, newPassword });
      setMessage(response.msg);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Error changing password');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* <h1 className="text-3xl font-bold mb-4 text-center" data-aos="fade-down">Settings</h1> */}
      <div className="bg-white shadow-md rounded-lg p-6" data-aos="fade-up">
        <h2 className="text-2xl font-semibold mb-4">User Details</h2>
        <table className="min-w-full bg-white font-semibold text-xl ">
          <tbody>
            <tr className="w-full bg-gray-100 ">
              <td className="py-2 px-4 border-b border-gray-200 text-gray-800">
                <FaUser className="inline-block mr-2" /> Username
              </td>
              <td className="py-2 px-4 border-b border-gray-200 capitalize">{user.username}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200 text-gray-800">
                <FaEnvelope className="inline-block mr-2" /> Email
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
            </tr>
            <tr className="w-full bg-gray-100">
              <td className="py-2 px-4 border-b border-gray-200 text-gray-800">
                <FaCalendar className="inline-block mr-2" />Joined at
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200 text-gray-800">
                <FaStar className="inline-block mr-2" /> Plan
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{user.plan}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mt-6" data-aos="fade-up">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Change Password
          </button>
        </form>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Setting;
