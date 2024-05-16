import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
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
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 pb-16">
      <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
        <SearchBar />
      </div>
      <div className="flex flex-col items-center flex-grow p-4 mb-16">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md relative">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-8 text-left">Settings</h1>
          <form onSubmit={handleSubmit} className="w-full">
            
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              className="w-full font-bold px-4 py-2 mt-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:border-purple-500 pl-8"
            >
              <option disabled>Theme</option>
              {themeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full font-bold px-4 py-2 mt-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:border-purple-500 pl-8"
            >
              <option disabled>Language</option>
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleToggleMap}
              className="w-full px-4 py-2 mt-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Change default map provider
            </button>

            <button
              type="button"
              onClick={handleToggleNotifications}
              className="w-full px-4 py-2 mt-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Toggle Notifications
            </button>

            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Save Settings
            </button>
          </form>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default SettingsPage;