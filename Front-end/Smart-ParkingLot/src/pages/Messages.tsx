import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import NavBar from '../components/Navbar';

const Messages: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleNewMessage = () => {
        setShowForm(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, newMessage.trim()]);
            setNewMessage('');
            setShowForm(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 pb-16">
            <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
                <SearchBar />
            </div>
            <div className="flex flex-col items-center flex-grow p-4 mb-16">
                <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <button
                        className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg mb-4"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    <div className="flex flex-col gap-4 mt-4 justify-center rounded-lg">
                        {messages.length === 0 ? (
                            <p className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-4 px-12 rounded-lg shadow-lg text-center">
                                No messages yet...
                            </p>
                        ) : (
                            messages.map((message, index) => (
                                <p key={index} className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-4 px-12 rounded-lg shadow-lg text-center">
                                    {message}
                                </p>
                            ))
                        )}
                        {showForm ? (
                            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 mt-4">
                                <textarea
                                    className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg"
                                    placeholder="Type your message here..."
                                    rows={4}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-purple-600 text-white font-bold py-2 px-12 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
                                >
                                    Send Message
                                </button>
                            </form>
                        ) : (
                            <button
                                className="bg-purple-600 text-white font-bold py-2 px-12 rounded-lg mt-8 shadow-lg hover:bg-purple-700 transition duration-300"
                                onClick={handleNewMessage}
                            >
                                New Message
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <NavBar />
        </div>
    );
};

export default Messages;