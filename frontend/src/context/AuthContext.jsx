import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const API = axios.create({ baseURL: '/api' });

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('pdfcraft_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pdfcraft_token');
      localStorage.removeItem('pdfcraft_user');
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pdfcraft_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('pdfcraft_token');
    if (token) {
      API.get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem('pdfcraft_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          localStorage.removeItem('pdfcraft_token');
          localStorage.removeItem('pdfcraft_user');
          setUser(null);
        })
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('pdfcraft_token', token);
      localStorage.setItem('pdfcraft_user', JSON.stringify(userData));
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('pdfcraft_token', token);
      localStorage.setItem('pdfcraft_user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pdfcraft_token');
    localStorage.removeItem('pdfcraft_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await API.get('/auth/me');
      setUser(res.data.user);
      localStorage.setItem('pdfcraft_user', JSON.stringify(res.data.user));
    } catch (error) {
      console.error('Failed to refresh user');
    }
  }, []);

  const isPro = user?.plan === 'pro' || user?.plan === 'enterprise';

  return (
    <AuthContext.Provider value={{
      user, loading, authLoading, isPro,
      login, register, logout, refreshUser, API,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export { API };
