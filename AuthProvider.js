// AuthProvider.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    AsyncStorage.getItem('user').then(storedUser => {
      if (storedUser) setUser(JSON.parse(storedUser));
      setAuthLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    // For demo: just check if user exists in AsyncStorage
    const stored = await AsyncStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u.email === email && u.password === password) {
        setUser(u);
        return true;
      }
    }
    return false;
  };

  const register = async (email, password) => {
    const newUser = { email, password };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
