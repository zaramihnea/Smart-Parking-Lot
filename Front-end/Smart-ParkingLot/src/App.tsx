import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfileAdminPage from './pages/ProfileAdminPage';
import AdminParkingPage from './pages/AdminParkingPage';
import AdminPanelPage from './pages/AdminPanelPage';
import AddParkingLotPage from './pages/AddParkingLotPage';
import EditParkingLotPage from './pages/EditParkingLotPage';
import AccountBalance from './pages/AccountBalance';
import Profiles from './pages/Profiles';
import Details from './pages/Details';
import Cars from './pages/Cars';
import Messages from './pages/Messages';
import SettingsPage from './pages/SettingsPage';
import Reserve1 from './pages/reserve1';
import MapPage from './pages/reserve2';
import HelpPage from './pages/HelpPage';
import DetailsAdminPage from './pages/DetailsAdminPage';
import UnseenWarningAdmin from './pages/UnseenWarningAdmin';
import SeeAllParkingSpots from './pages/SeeAllParkingSpots';
import './App.css';
import LoadingPage from './pages/LoadingPage';
import ResultsPage from './pages/ResultsPage';

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

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const userAgent = window.navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setDevice('iOS');
    } else if (/android/i.test(userAgent)) {
      setDevice('Android');
    }

  }, []);

  return (
    <div>
      {isInstalled ? (
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/admin" element={<ProfileAdminPage />} />
            <Route path="/admin-parking" element={<AdminParkingPage />} />
            <Route path="/admin-panel" element={<AdminPanelPage />} />
            <Route path="/admin-panel/add-parking-lot" element={<AddParkingLotPage />} />
            <Route path="/admin-panel/edit-parking-lot/:id" element={<EditParkingLotPage />} />
            <Route path="/balance" element={<AccountBalance />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/profiles/messages" element={<Messages />} />
            <Route path="/profiles/cars" element={<Cars />} />
            <Route path="/profiles/details" element={<Details />} />
            <Route path="/profiles/reserve" element={<Reserve1 />} />
            <Route path="/profile/reserve" element={<Reserve1 />} />
            <Route path="/home/reserve1" element={<Reserve1 />} />
            <Route path="/home/reserve1/reserve2" element={<MapPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/details-admin" element={<DetailsAdminPage />} />
            <Route path="/unseen-warning-admin" element={<UnseenWarningAdmin />} />
            <Route path="/see-all-parking-spots" element={<SeeAllParkingSpots />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </Router>
      ) : (
        <InstallPrompt device={device} />
      )}
    </div>
  );
};

export default App;
