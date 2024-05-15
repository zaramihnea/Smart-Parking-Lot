import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MoonIcon from '../assets/moon.svg';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    mapType: 'roadmap',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Settings Saved:', settings);
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
    <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-zinc-800">
      <SearchBar />

      <div className="relative mt-8">
        <div className="absolute inset-0 transform translate-x-2 translate-y-2 bg-gray-300 dark:bg-zinc-700 rounded-lg shadow-lg"></div>
        <div className="relative w-80 max-w-md p-12 bg-gray-300 dark:bg-zinc-700 text-gray-900 dark:text-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-8 text-left-30px">Settings</h1>
          
          <form onSubmit={handleSubmit} className="w-full relative">
            <img src={MoonIcon} alt="moon icon" className="absolute top-2 right-5 w-6 h-6" />
            
            <select
              value="Theme"
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              className="w-full max-w-xs font-bold px-4 py-2 mt-1 bg-zinc-400 dark:bg-zinc-400 text-gray-900 dark:text-zinc-800 rounded-lg shadow-sm focus:outline-none focus:border-purple-500 pl-8 text-center"
            >
              <option disabled selected>Theme</option>
              {themeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value="Language"
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full max-w-xs font-bold px-4 py-2 mt-4 bg-zinc-400 dark:bg-zinc-400 text-gray-900 dark:text-zinc-800  rounded-lg shadow-sm focus:outline-none focus:border-purple-500 text-center"
            >
              <option disabled selected>Language</option>
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <div className="relative">
              <button
                type="button"
                onClick={handleToggleMap}
                className="w-full px-4 py-2 mt-4 bg-zinc-400  text-gray-900 dark:bg-zinc-400 dark:text-zinc-800 font-bold rounded-lg hover:bg-zinc-500 dark:hover:bg-gray-600 transition duration-300"
              >
                Toggle Map
              </button>

              <button
                type="button"
                onClick={handleToggleNotifications}
                className="w-full px-4 py-2 mt-4 bg-zinc-400 dark:bg-zinc-400 text-gray-900 dark:text-zinc-800 font-bold rounded-lg hover:bg-zinc-500 dark:hover:bg-gray-600 transition duration-300"
              >
                Toggle Notifications
              </button>

              <button
                type="submit"
                className="w-full px-4 py-2 mt-4 bg-zinc-400 dark:bg-zinc-400 text-gray-900 dark:text-zinc-800 font-bold rounded-lg hover:bg-zinc-500 dark:hover:bg-gray-600 transition duration-300"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
