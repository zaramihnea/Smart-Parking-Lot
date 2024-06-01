import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import User from '../types/User';
import Cookies from 'js-cookie';

const SeeAllUsersAdmin: React.FC = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToBan, setUserToBan] = useState<User | null>(null);
  const token = Cookies.get('authToken');
  const baseUrl = process.env.API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/all-users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [baseUrl, token]);

  const handleAddUser = () => {
    if (newUserEmail.trim() === '') return;

    const newUser: User = {
      id: users.length + 1,
      email: newUserEmail
    };

    setUsers([...users, newUser]);
    setNewUserEmail('');
  };

  const handleBanUser = async () => {
    if (!userToBan) return;

    try {
      const response = await fetch(`${baseUrl}/admin/ban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userToBan)
      });

      if (response.ok) {
        setUsers(users.filter(user => user.email !== userToBan.email));
      } else {
        console.error('Failed to ban user');
      }
    } catch (error) {
      console.error('Error at banning user:', error);
    } finally {
      setShowBanModal(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <div className="flex-grow p-4">
        {/* Search bar for parking spots */}
        <SearchBar placeholder="Search for parking spot" />

        <div className="mt-6 max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">

          <button
            onClick={() => navigate('/profile/admin')}
            className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 mb-6"
          >
            Back
          </button>

          <div className="mt-4 flex justify-between items-center">
            {/* Search bar for users */}
            <input
              type="text"
              placeholder="Search for users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:bg-gray-600"
            />
          </div>

          {filteredUsers.map(user => (
            <div key={user.email} className="mb-4 flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow-md">
              <span className="text-white">{user.email}</span>
              <button
                onClick={() => {
                  setUserToBan(user);
                  setShowBanModal(true);
                }}
                className="ml-2 px-2 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              >
                Ban
              </button>
            </div>
          ))}
        </div>
      </div>
      <Navbar />
      {showBanModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-black">
            <h2 className="text-xl font-bold mb-4">Delete User</h2>
            <p>Are you sure you want to ban {userToBan.email}?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg"
                onClick={() => setShowBanModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
                onClick={handleBanUser}
              >
                Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeeAllUsersAdmin;
