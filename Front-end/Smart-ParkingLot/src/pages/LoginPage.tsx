import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginErrorPopup, setloginErrorPopup] = useState(false);
  const [emailErrorPopup, setemailErrorPopup] = useState(false);
  const [UIErrorMessage, setUIErrorMessage] = useState('');

  // login (backend documentation item nr.4)
  const handleLogin = async () => {
    if (isValidEmail(email)) {
      if (password) {
        console.log("Sending data to backend for login:", email, password);
        try {
          const response = await fetch('http://localhost:8081/user/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email: email,
                  password: password
              }),
          });

          if (response.ok) {
              const data = await response.json();
              console.log("Login successful:", data);

              // Set the cookie using document.cookie
              document.cookie = `authToken=${data.token}; path=/; max-age=3600 * 10;`; // Expires in 10 hours

              navigate('/home');
          } else {
              const errorData = await response.text();
              console.error("Login failed:", errorData);
              setUIErrorMessage(errorData);
          }
      } catch (error) {
          console.error("Error during Login:", error);
          setUIErrorMessage('An unexpected error occurred. Please try again.');
      }
      } else {
        setloginErrorPopup(true);
      }
    } else {
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
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-8 text-center">Login</h1>
          <input
            type="text"
            placeholder="email/username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
          />
          {emailErrorPopup && <p className="text-red-500 text-sm mb-4">Email is invalid!</p>}
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
          />
          {loginErrorPopup && <p className="text-red-500 text-sm mb-4">Please fill in all fields</p>}
          {UIErrorMessage && <div className="text-red-500 mt-4">{UIErrorMessage}</div>} {}
          <button
            onClick={handleLogin}
            className="w-full max-w-xs px-4 py-2 mb-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
          >
            Login
          </button>
          <a href="/forgot-password" className="text-sm text-purple-600 dark:text-purple-400 hover:underline mb-2 block text-center">
            Forgot password?
          </a>
          <a href="/signup" className="text-sm text-purple-600 dark:text-purple-400 hover:underline block text-center">
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
