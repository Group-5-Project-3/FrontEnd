import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeJWT } from './components/utils';
import { findUserByUserId } from '../APICalls';
import { Text, Center, Spinner } from 'native-base'; // Ensure Center is imported here

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
  };

  const loginUser = async (token) => {
    await AsyncStorage.setItem('@auth_token', token);
    const decoded = decodeJWT(token);
    const profileData = await findUserByUserId(decoded.sub);
    const userData = { ...decoded, ...profileData };
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@auth_token'); // Clear token from storage
      await AsyncStorage.removeItem('@username'); // Clear token from storage
      setIsLoggedIn(false);
      setUser(null); // Reset user state
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
          const decoded = decodeJWT(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded.exp > currentTime) {
            

            const profileData = await findUserByUserId(decoded.sub);

            // console.log(profileData);
            setUser({ ...decoded, ...profileData}); // Store decoded data in state
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

  // Render a global loading indicator until user data is available
  if (loading) {
    return (
      <Center flex={1}>
        <Spinner color="primary.500" size="lg" />
        <Text>Loading...</Text>
      </Center>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, updateUser, user, loading, logout, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
};
