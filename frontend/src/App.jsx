import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import Payments from './pages/Payments';
import Evidence from './pages/Evidence';
import CaseSummary from './pages/CaseSummary';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {user && <Sidebar />}
      <main className={`flex-1 p-8 transition-all duration-300 ${user ? 'ml-64' : ''}`}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cases" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/evidence" element={<ProtectedRoute><Evidence /></ProtectedRoute>} />
          <Route path="/summary" element={<ProtectedRoute><CaseSummary /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
