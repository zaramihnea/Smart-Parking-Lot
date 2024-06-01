import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import Reserve1 from './pages/reserve1';
import MapPage from './pages/reserve2';
import HelpPage from './pages/HelpPage';
import LoadingPage from './pages/LoadingPage';
import ResultsPage from './pages/ResultsPage';
import SeeAllParkingSpots from './pages/SeeAllParkingSpots';
import './App.css';

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
  const [userType, setUserType] = useState<number | null>(null);

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

    const fetchUserType = async () => {
      const fetchedUserType = 3; // 1: normal user, 2: parking manager, 3: app admin
      setUserType(fetchedUserType);
    };

    fetchUserType();
  }, []);

  return (
    <div>
      {/* {isInstalled ? ( */}
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/profile" element={
              userType === 1 ? <Profiles /> :
              userType === 2 ? <ProfileParkingLotManager /> :
              userType === 3 ? <ProfileAdmin /> :
              <Navigate to="/" />
            } />
            <Route path="/profile/messages" element={<Messages />} />
            <Route path="/profile/cars" element={<Cars />} />
            <Route path="/profile/details" element={<Details />} />
            <Route path="/profile/admin-parking-panel" element={<ParkingLotManagerPanel />} />
            <Route path="/profile/admin-parking-panel/add-parking-lot" element={<AddParkingLotPage />} />
            <Route path="/profile/admin-parking-panel/edit-parking-lot/:id" element={<EditParkingLotPage />} />
            <Route path="/profile/admin" element={<AdminPanel />} />
            <Route path="/profile/admin/see-all-users" element={<SeeAllUsersAdmin />} />
            <Route path="/profile/admin/questions" element={<AdminQuestions />} />
            <Route path="/balance" element={<AccountBalance />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/see-all-parking-spots" element={<SeeAllParkingSpots />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      {/* ) : ( */}
       {/* <InstallPrompt device={device} /> */}
       {/* )} */}
    </div>
  );
};

export default App;
