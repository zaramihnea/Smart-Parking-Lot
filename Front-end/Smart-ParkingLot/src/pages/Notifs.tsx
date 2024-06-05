import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import NavBar from '../components/Navbar';
import Cookies from 'js-cookie';
import { Notification } from '../types/Notification';

const SeeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const token = Cookies.get('authToken');
  const baseUrl = process.env.API_BASE_URL;

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${baseUrl}/admin/see-notifs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const notificationsData = await response.json();
      notificationsData.sort((a: Notification, b: Notification) => b.messageId - a.messageId);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [baseUrl, token]);

  const markAsSeen = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/admin/mark-as-seen/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as seen');
      }

      const updatedNotifications = notifications.map(notification => {
        if (notification.messageId === id) {
          return { ...notification, seen: true };
        }
        return notification;
      });
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/admin/delete-notification/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      const updatedNotifications = notifications.filter(notification => notification.messageId !== id);
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.messageContent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 pb-16">
      <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
        <SearchBar placeholder="Search for parking spot" />
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
            {filteredNotifications.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-300">No new notifications</div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <div key={index} className={`relative flex items-center ${notification.seen ? '' : 'border border-red-500 dark:border-red-500'} bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-4 px-8 rounded-lg shadow-lg mb-4`}>
                  {notification.messageContent}
                  {!notification.seen && (
                    <button
                      className="absolute top-0 right-8 mt-1 mr-1 text-sm text-gray-500 cursor-pointer bg-transparent border-none"
                      onClick={() => markAsSeen(notification.messageId)}
                    >
                      Mark as Seen
                    </button>
                  )}
                  <button
                    className="absolute top-0 right-0 mt-1 mr-1 text-sm text-red-500 cursor-pointer bg-transparent border-none"
                    onClick={() => deleteNotification(notification.messageId)}
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  );
};

export default SeeNotifications;
