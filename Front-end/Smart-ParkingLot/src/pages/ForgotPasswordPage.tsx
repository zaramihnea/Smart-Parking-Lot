import React from 'react';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900">
      <div className="w-80 max-w-md p-12 bg-white shadow-lg rounded-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold text-purple-600 mb-8">Forgot password</h1>
        <input
          type="text"
          placeholder="Email/Username"
          className="w-full max-w-xs px-4 py-2 mb-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-purple-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
        />
        <button className="w-full max-w-xs px-4 py-2 mb-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
          Submit
        </button>
        <a href="/" className="text-sm text-purple-600 hover:underline mb-2">
          Back to login
        </a>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
