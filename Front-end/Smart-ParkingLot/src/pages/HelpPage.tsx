import React from 'react';
import { FaQuestionCircle, FaFileAlt, FaBell } from 'react-icons/fa';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';

const HelpPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-16">
            <div className="sticky top-0 z-50 w-full flex justify-center bg-gray-100 dark:bg-gray-900">
                <div className="w-full max-w-4xl px-4">
                    <SearchBar placeholder={''} />
                </div>
            </div>
            <div className="flex justify-center items-center flex-grow mt-4 mb-4 px-4">
                <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-4">
                    <h2 className="text-xl font-bold text-purple-600 mb-4">Get help</h2>
                    <div className="space-y-4">
                        <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
                            <FaQuestionCircle className="text-purple-600 mr-4" size={24} />
                            <span className="text-lg">FAQ</span>
                        </div>
                        <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
                            <FaFileAlt className="text-purple-600 mr-4" size={24} />
                            <span className="text-lg">Terms and conditions</span>
                        </div>
                        <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
                            <FaBell className="text-purple-600 mr-4" size={24} />
                            <span className="text-lg">Emergency</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <input 
                            type="text" 
                            placeholder="send a message" 
                            className="w-full p-2 bg-gray-200 dark:bg-gray-600 rounded-lg shadow-inner"
                        />
                        <button className="mt-2 w-full flex justify-center items-center bg-purple-600 text-white p-2 rounded-lg shadow-md">
                            <span className="material-icons">send</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="sticky bottom-0 z-50 w-full">
                <Navbar />
            </div>
        </div>
    );
}

export default HelpPage;