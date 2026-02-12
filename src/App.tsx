import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import Deposit from './pages/dashboard/Deposit';
import Withdraw from './pages/dashboard/Withdraw';
import DepositHistory from './pages/dashboard/DepositHistory';
import Referral from './pages/dashboard/Referral';
import Settings from './pages/dashboard/Settings';
import AdminPanel from './pages/dashboard/admin/AdminPanel';
import AdminChat from './pages/dashboard/admin/AdminChat';
import Market from './pages/dashboard/Market';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard Routes (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="history" element={<DepositHistory />} />
            <Route path="referrals" element={<Referral />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="admin/chat" element={<AdminChat />} />
            <Route path="market" element={<Market />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatWidget />
    </Router>
  );
}

export default App;
