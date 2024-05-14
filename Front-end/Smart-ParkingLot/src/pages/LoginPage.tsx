import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';



const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginErrorPopup, setloginErrorPopup] = useState(false);

  const handleLogin = () => {
    if(email && password){
      console.log("Sending data to backend for login:", email, password);
      setloginErrorPopup(false);
      navigate('/home');
    } else {
      setloginErrorPopup(true);
    }
    
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900">
      <div className="w-80 max-w-md p-12 bg-white shadow-lg rounded-lg flex flex-col items-center">
        <h1 
          className="text-2xl font-bold text-purple-600 mb-8"
        > Login </h1>
        <input 
          type="text" 
          placeholder="email/username" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full max-w-xs px-4 py-2 mb-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-purple-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
        />
        <input 
          type="password" 
          placeholder="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full max-w-xs px-4 py-2 mb-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-purple-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
        />
        {loginErrorPopup && <p className="text-red-500 text-sm mb-4">Please fill in all fields</p>}
        <button 
          onClick={handleLogin} 
          className="w-full max-w-xs px-4 py-2 mb-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
          > Login </button>
        <a 
          href="/forgot-password" 
          className="text-sm text-purple-600 hover:underline mb-2"
        > Forgot password? </a>
        <a 
          href="/signup" 
          className="text-sm text-purple-600 hover:underline"
        > Don't have an account? Sign up </a>
      </div>
    </div>
  );
};

export default LoginPage;
