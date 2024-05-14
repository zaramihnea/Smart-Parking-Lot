import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailErrorPopup, setemailErrorPopup] = useState(false);

  const handleFP = () => {
    if (isValidEmail(email)) {
      console.log("Sending data to backend for forgot password:", email);
      setemailErrorPopup(false);
      navigate('/');
    } else {
      setemailErrorPopup(true);
    }

  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative">
        <div className="absolute inset-0 transform translate-x-2 translate-y-2 bg-purple-600 rounded-lg shadow-lg"></div>
        <div className="relative w-80 max-w-md p-12 bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-8 text-center">Forgot password</h1>
          <input
            type="text"
            placeholder="Email/Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
          />
          {emailErrorPopup && <p className="text-red-500 text-sm mb-4">Email is invalid!</p>}
          <button
            onClick={handleFP}
            className="w-full max-w-xs px-4 py-2 mb-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
          > Submit </button>
          <a href="/" className="text-sm text-purple-600 dark:text-purple-400 hover:underline mb-2 block text-center">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
