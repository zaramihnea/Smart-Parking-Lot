import { NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <div className="m-1 h-16 bg-gray-300 dark:bg-gray-700 rounded-2xl shadow-md dark:shadow-none fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)]">
      <nav className="w-full h-full flex justify-around items-center">
        <NavLink 
          to="/home" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center ${isActive || location.pathname === '/' ? 'text-[#7167EE]' : 'text-gray-900 dark:text-gray-100'}`
          }
        >
          {({ isActive }) => (
            <>
              <img src={isActive || location.pathname === '/' ? "/navbar/HomeIconActive.svg" : "/navbar/HomeIcon.svg"} alt="home" className="h-6 w-6 mb-1" />
              <span className="text-sm">Home</span>
            </>
          )}
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center ${isActive || location.pathname === '/profile' ? 'text-[#7167EE]' : 'text-gray-900 dark:text-gray-100'}`
          }
        >
          {({ isActive }) => (
            <>
              <img src={isActive || location.pathname === '/profile' ? "/navbar/ProfileIconActive.svg" : "/navbar/ProfileIcon.svg"} alt="profile" className="h-6 w-6 mb-1" />
              <span className="text-sm">Profile</span>
            </>
          )}
        </NavLink>
        <NavLink 
          to="/balance" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center ${isActive || location.pathname === '/wallet' ? 'text-[#7167EE]' : 'text-gray-900 dark:text-gray-100'}`
          }
        >
          {({ isActive }) => (
            <>
              <img src={isActive || location.pathname === '/wallet' ? "/navbar/WalletIconActive.svg" : "/navbar/WalletIcon.svg"} alt="wallet" className="h-6 w-6 mb-1" />
              <span className="text-sm">Wallet</span>
            </>
          )}
        </NavLink>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center ${isActive || location.pathname === '/settings' ? 'text-[#7167EE]' : 'text-gray-900 dark:text-gray-100'}`
          }
        >
          {({ isActive }) => (
            <>
              <img src={isActive || location.pathname === '/settings' ? "/navbar/SettingIconActive.svg" : "/navbar/SettingIcon.svg"} alt="settings" className="h-6 w-6 mb-1" />
              <span className="text-sm">Settings</span>
            </>
          )}
        </NavLink>
        <NavLink 
          to="/help" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center ${isActive || location.pathname === '/help' ? 'text-[#7167EE]' : 'text-gray-900 dark:text-gray-100'}`
          }
        >
          {({ isActive }) => (
            <>
              <img src={isActive || location.pathname === '/help' ? "/navbar/HeartIconActive.svg" : "/navbar/HeartIcon.svg"} alt="help" className="h-6 w-6 mb-1" />
              <span className="text-sm">Help</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}