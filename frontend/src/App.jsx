import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ToolPage from './pages/ToolPage';
import Settings from './pages/Settings';
import About from './pages/About';
import { useAuth } from './context/AuthContext';
import { RecentActivityProvider } from './context/RecentActivityContext';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();
  if (authLoading) return <div style={{ padding: '200px 0', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;
  return user ? children : <Navigate to="/login" />;
}

function AuthRoute({ children }) {
  const { user, authLoading } = useAuth();
  if (authLoading) return <div style={{ padding: '200px 0', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;
  return user ? <Navigate to="/" /> : children;
}

export default function App() {
  const { authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <RecentActivityProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/:toolId" element={<ToolPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
            <Route path="/reset-password/:token" element={<AuthRoute><ResetPassword /></AuthRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </div>
        <Toaster position="bottom-right" />
      </RecentActivityProvider>
    </BrowserRouter>
  );
}


