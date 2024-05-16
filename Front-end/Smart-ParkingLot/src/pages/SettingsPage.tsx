import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import MoonIcon from '../assets/moon.svg';
import { SettingsContext } from '../contexts/settingsContext';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(SettingsContext);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_THEME', payload: e.target.value as 'light' | 'dark' });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_LANGUAGE', payload: e.target.value as 'en' | 'fr' | 'es' });
  };

  const handleToggleNotifications = () => {
    console.log('Toggle notifications');
  };

  const handleToggleMap = () => {
    console.log('Toggle map');
  };

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${state.theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} p-4 pb-16`}>
      <div className="sticky top-0 z-50">
        <SearchBar />
      </div>
      <div className="flex flex-col items-center flex-grow p-4 mb-16">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md relative">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-8 text-left">Settings</h1>
          <form className="w-full">
            <img src={MoonIcon} alt="moon icon" className="absolute top-2 right-5 w-6 h-6" />
            
            <select
              value={state.theme}
              onChange={handleThemeChange}
              className="w-full font-bold px-4 py-2 mt-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:border-purple-500 pl-8"
            >
              {themeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={state.language}
              onChange={handleLanguageChange}
              className="w-full font-bold px-4 py-2 mt-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:border-purple-500 pl-8"
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleToggleMap}
              className="w-full px-4 py-2 mt-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Toggle Map
            </button>

            <button
              type="button"
              onClick={handleToggleNotifications}
              className="w-full px-4 py-2 mt-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Toggle Notifications
            </button>
          </form>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default SettingsPage;