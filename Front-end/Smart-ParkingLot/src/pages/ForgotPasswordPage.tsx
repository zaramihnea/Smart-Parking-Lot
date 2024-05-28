import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailErrorPopup, setemailErrorPopup] = useState(false);
  const [errorMessage, setUIErrorMessage] = useState('');

  const [emailSentBool, setemailSentBool] = useState(false);
  const [emailSentMessage, setemailSentMessage] = useState('An email has been successfully sent');
  const baseUrl = process.env.API_BASE_URL;

  const handleFP = async () => {
    if (isValidEmail(email)) {
      console.log("Sending data to backend for forgot password:", email);
      try {
        const response = await fetch(`${baseUrl}/user/reset-password-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            }),
        });

        if (response.ok) {
          const textResponse = await response.text();
          if(textResponse === 'Email found'){
            setemailSentBool(true);
            setemailErrorPopup(false);
            
            navigate('/');
            
          }

        }
        else {
          const textResponse = await response.text();
          setemailSentBool(false);
          setUIErrorMessage('Email not found');
          setemailErrorPopup(true);
        }
      } catch (error) {
        setemailSentBool(false);
        console.error("Error during password reset:", error);
        setUIErrorMessage('An unexpected error occurred. Please try again.');
        setemailErrorPopup(true);
      }
    } else {
      setemailSentBool(false);
      setUIErrorMessage('Email is invalid');
      setemailErrorPopup(true);
    }

  };

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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
          />
          {emailErrorPopup && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
          {emailSentBool && <p className="text-green-500 text-center mb-4">{emailSentMessage}</p>}
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
