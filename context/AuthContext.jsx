'use client';
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('sabji_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('sabji_token') || null;
  });

  const saveUser = (u) => {
    setUser(u);
    localStorage.setItem('sabji_user', JSON.stringify(u));
  };

  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    // Fetch full profile with address
    const profileRes = await fetch('/api/profile', { headers: { Authorization: `Bearer ${data.token}` } });
    const profile = profileRes.ok ? await profileRes.json() : data.user;
    saveUser(profile);
    setToken(data.token);
    localStorage.setItem('sabji_token', data.token);
    return profile;
  };

  const register = async (username, password, name, phone) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name, phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    saveUser({ ...data.user, phone: phone || '' });
    setToken(data.token);
    localStorage.setItem('sabji_token', data.token);
    return data.user;
  };

  const updateProfile = async (updates) => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    saveUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sabji_user');
    localStorage.removeItem('sabji_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
