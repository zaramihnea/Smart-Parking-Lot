import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Homepage from './Homepage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

const App: React.FC = () => {
  document.title = 'Smart Parking Lot'

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  )
}

export default App
