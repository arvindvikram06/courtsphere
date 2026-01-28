import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import MainLayout from './layout/MainLayout';
import { useAuth } from './context/AuthContext';

import Case from './pages/Case';
import Payment from './pages/Payment';
import Evidence from './pages/Evidence';
import CaseSummary from './pages/CaseSummary';
import Profile from './pages/Profile';


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="cases" element={<Case />} />
        <Route path="payments" element={<Payment />} />
        <Route path="evidence" element={<Evidence />} />
        <Route path="summary" element={<CaseSummary />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
