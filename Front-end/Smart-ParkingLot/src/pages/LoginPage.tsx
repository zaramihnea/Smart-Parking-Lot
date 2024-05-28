import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// some user
// baciu_elena@gmail.com 84732saf

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Stare pentru a afișa parola

  const [loginErrorPopup, setloginErrorPopup] = useState(false);
  const [emailErrorPopup, setemailErrorPopup] = useState(false);
  const [errorMessage, setUIErrorMessage] = useState('');
  const baseUrl = process.env.API_BASE_URL;

  // useEffect(() => {
  //   const cookies = document.cookie.split(';').map(cookie => cookie.split('='));
  //   for (const cookie of cookies) {
  //     if (cookie[0] && cookie[0].includes('authToken')) {
  //       console.log("User is already logged in");
  //       navigate('/home');
  //       break;
  //     }
  //   }
  // }, [navigate]); // Add 'navigate' as a dependency

  const handleLogin = async () => {
    if (isValidEmail(email)) {
      if (password) {
          console.log("Sending data to backend for login:", email, password);
          try {
              const response = await fetch(`${baseUrl}/user/login`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      email: email,
                      password: password
                  }),
              });

              console.log(JSON.stringify({
                  email: email,
                  password: password
              }));

              if (response.ok) {
                  const data = await response.json(); // Assuming the response contains JSON data
                  console.log("Login successful:", data);

                  // Assuming the response contains a token
                  const { token } = data;
                  
                  // Set the cookie using document.cookie
                  document.cookie = `authToken=${token}; path=/; max-age=3600;`;

                  // Or set the cookie using js-cookie
                  // Cookies.set('authToken', token, { expires: 1, path: '/', sameSite: 'Strict', secure: true }); // Expires in 1 day

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
          <div className="relative w-full max-w-xs">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {loginErrorPopup && <p className="text-red-500 text-sm mb-4">Please fill in all fields</p>}
          {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>} {/* Display the error message */}
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
