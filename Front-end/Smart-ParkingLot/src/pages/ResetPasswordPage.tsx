import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();

    // determinam parola
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const baseUrl = process.env.API_BASE_URL;

    // determinam token-ul din URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const handleResetPassword = async () => {
        if(newPassword === '' && confirmPassword === ''){
            setErrorMessage('Please fill the two fields with your new password');
        } else if(newPassword === ''){
            setErrorMessage('Please fill the first field');
        } else if (confirmPassword === ''){
            setErrorMessage('Please fill the second field');
        }else {
            if(newPassword !== confirmPassword){
                setErrorMessage("Passwords do not match");
            } else if(!isValidPassword(newPassword)){
                setErrorMessage("Password is invalid! (should be 5+ characters and have at least 1 number & one special character)");
            } else {
                try {
                    const response = await fetch(`${baseUrl}/user/after-reset-password-request`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            token: token,
                            password: newPassword
                        }),
                    });
                    const result = await response.text();
                    setErrorMessage(result);

                    navigate('/');
                
                
                } catch (error) {
                    setErrorMessage('An error occurred while resetting your password');
                }
            }
        }
    };

    const isValidPassword = (password: string) => {
        // Regular expressions for password requirements
        const uppercaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
        // Test the input password against the regular expressions
        return (
            password.length >= 5 &&
            uppercaseRegex.test(password) &&
            numberRegex.test(password) &&
            specialCharacterRegex.test(password)
        );
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative">
        <div className="absolute inset-0 transform translate-x-2 translate-y-2 bg-purple-600 rounded-lg shadow-lg"></div>
        <div className="relative w-80 max-w-md p-12 bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-8 text-center">Reset Password</h1>
          <div className="relative w-full max-w-xs">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-600 dark:text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
          />
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          <button
            onClick={handleResetPassword}
            className="w-full max-w-xs px-4 py-2 mb-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
          >
            Reset Password
          </button>
          <a href="/login" className="text-sm text-purple-600 dark:text-purple-400 hover:underline block text-center">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;