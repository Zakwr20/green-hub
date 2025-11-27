import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setInitializing(false);
      return;
    }

    getProfile()
      .then((res) => {
        setUser(res.data?.user || null);
      })
      .catch(() => {
        localStorage.removeItem('access_token');
        setUser(null);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  const login = async ({ email, password }) => {
    setError(null);
    const res = await apiLogin({ email, password });
    const { user: loggedInUser, session } = res.data || {};
    if (session?.access_token) {
      localStorage.setItem('access_token', session.access_token);
    }
    setUser(loggedInUser || null);
    return res;
  };

  const register = async ({ email, password, fullName }) => {
    setError(null);
    const res = await apiRegister({ email, password, fullName });
    return res;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // ignore errors
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
    }
  };

  const value = useMemo(() => ({
    user,
    initializing,
    error,
    setError,
    login,
    register,
    logout
  }), [user, initializing, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
