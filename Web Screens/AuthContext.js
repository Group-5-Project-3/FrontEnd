import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeJWT } from './components/utils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
          const decoded = decodeJWT(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded.exp > currentTime) {
            setUser(decoded); // Store decoded data in state
            setIsLoggedIn(true);
          } else {
            await AsyncStorage.removeItem('@auth_token'); // Remove expired token
            setIsLoggedIn(false);
          }
        }
      } catch (e) {
        console.error('Error initializing auth:', e);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
