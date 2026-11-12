import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import VideoRoom from './pages/VideoRoom';
import Leaderboard from './pages/Leaderboard';

const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
    <div className="w-9 h-9 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
    <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Initializing ByteMed...</span>
  </div>
);

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const DefaultRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" />;
  return user.role === 'DOCTOR' ? <Navigate to="/doctor" /> : <Navigate to="/patient" />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/patient" element={<PrivateRoute role="PATIENT"><PatientDashboard /></PrivateRoute>} />
              <Route path="/doctor" element={<PrivateRoute role="DOCTOR"><DoctorDashboard /></PrivateRoute>} />
              <Route path="/room/:id" element={<PrivateRoute><VideoRoom /></PrivateRoute>} />
              <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
              <Route path="/" element={<DefaultRoute />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
