import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider, useUserContext } from './UserContext';
import Homepage from './Homepage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPanel from './pages/AdminPanel';
import ParkingLotManagerPanel from './pages/ParkingLotManagerPanel';
import SeeAllUsersAdmin from './pages/SeeAllUsersAdmin';
import AdminQuestions from './pages/AdminQuestions';
import AddParkingLotPage from './pages/AddParkingLotPage';
import EditParkingLotPage from './pages/EditParkingLotPage';
import AccountBalance from './pages/AccountBalance';
import Profiles from './pages/Profiles';
import ProfileAdmin from './pages/AdminProfile';
import ProfileParkingLotManager from './pages/ProfileParkingLotManager';
import Details from './pages/Details';
import Cars from './pages/Cars';
import Messages from './pages/Messages';
import HelpPage from './pages/HelpPage';
import LoadingPage from './pages/LoadingPage';
import ResultsPage from './pages/ResultsPage';
import SeeAllParkingSpots from './pages/SeeAllParkingSpots';
import Notifs from './pages/Notifs';
import './App.css';
import SeeNotifications from './pages/Notifs';

const InstallPrompt: React.FC<{ device: string }> = ({ device }) => {
  const installInstructions =
    device === 'iOS'
      ? 'To install, press share then "add to home screen".'
      : 'To install, press more then "add to home screen".';

  return (
    <div className="install-prompt fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-white">SmartParkingLot</h2>
        <p className="mb-4 text-gray-900 dark:text-gray-100">Please install our web app to access the content.</p>
        <p className="mb-4 text-gray-900 dark:text-gray-100">{installInstructions}</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [device, setDevice] = useState<string>('other');

  const addChatWidget = () => {
    const script = document.createElement('script');
    script.innerHTML = `
      window.__ow = window.__ow || {};
      window.__ow.organizationId = "f7271913-d65f-40e0-8be4-39f48f274dd3";
      window.__ow.integration_name = "manual_settings";
      window.__ow.product_name = "openwidget";
      ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[OpenWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.openwidget.com/openwidget.js",t.head.appendChild(n)}};!n.__ow.asyncInit&&e.init(),n.OpenWidget=n.OpenWidget||e}(window,document,[].slice));
    `;
    document.body.appendChild(script);
  };

  const removeChatWidget = () => {
    const script = document.querySelector('script[src="https://cdn.openwidget.com/openwidget.js"]');
    if (script) {
      script.remove();
    }
  };

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      addChatWidget();
    } else {
      setIsInstalled(false);
      removeChatWidget();
    }

    const userAgent = window.navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setDevice('iOS');
    } else if (/android/i.test(userAgent)) {
      setDevice('Android');
    }
  }, []);

  return (
    <UserProvider>

      
      <div>
      {isInstalled ? (
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/profile/*" element={<PrivateRoute />} />
            <Route path="/balance" element={<AccountBalance />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/see-all-parking-spots" element={<SeeAllParkingSpots />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
     ) : (
        <div>
          <Router>
            <Routes>
              <Route path="*" element={<InstallPrompt device={device} />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
          </Router>
        </div>
       )}
       </div>
    </UserProvider>

  );
};

const PrivateRoute = () => {
  const { userType } = useUserContext();

  if (userType === null) {
    return <Navigate to="/" />;
  }

  return (
    <Routes>
      <Route path="/" element={
        userType === 1 ? <Profiles /> :
          userType === 2 ? <ProfileParkingLotManager /> :
            userType === 3 ? <ProfileAdmin /> :
              <Navigate to="/" />
      } />
      <Route path="/messages" element={<Messages />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/details" element={<Details />} />
      <Route path="/admin-parking-panel" element={<ParkingLotManagerPanel />} />
      <Route path="/admin-parking-panel/add-parking-lot" element={<AddParkingLotPage />} />
      <Route path="/admin-parking-panel/edit-parking-lot/:id" element={<EditParkingLotPage />} />
      <Route path="/admin-parking-panel/see-lot-notifs" element={<SeeNotifications />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/see-all-users" element={<SeeAllUsersAdmin />} />
      <Route path="/admin/questions" element={<AdminQuestions />} />
    </Routes>
  );
};

export default App;