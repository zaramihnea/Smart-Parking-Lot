import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';

interface User {
  id: number;
  email: string;
}

const SeeAllUsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, email: 'user1@example.com' },
    { id: 2, email: 'user2@example.com' },
    { id: 3, email: 'user3@example.com' }
  ]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const navigate = useNavigate();

  const handleAddUser = () => {
    if (newUserEmail.trim() === '') return;

    const newUser: User = {
      id: users.length + 1,
      email: newUserEmail
    };

    setUsers([...users, newUser]);
    setNewUserEmail('');
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <div className="flex-grow p-4">
        <SearchBar placeholder="Search for user" />
        <div className="mt-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-500">All Users</h1>
          <button
            onClick={() => navigate(-1)} // Navigate back one step in the history
            className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
          >
            Back
          </button>
        </div>
        <div className="mt-6 max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          {users.map(user => (
            <div key={user.id} className="mb-4 flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow-md">
              <span className="text-white">{user.email}</span>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="ml-2 px-2 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-1 14H6L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
          ))}
          <div className="mt-4">
            <input
              type="text"
              placeholder="email/username"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:bg-gray-600"
            />
            <button
              onClick={handleAddUser}
              className="w-full mt-4 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
            >
              Add user
            </button>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default SeeAllUsersAdmin;
