import React, { createContext, useState, useEffect } from 'react';
import { decodeJWT } from './components/utils';
import { findUserByUserId } from './components/APICalls/UserController';
import { Spinner } from 'react-bootstrap';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
  };

  const loginUser = async (token) => {
    try {
      localStorage.setItem('auth_token', token);
      const decoded = decodeJWT(token);
      const profileData = await findUserByUserId(decoded.sub);
      const userData = { ...decoded, ...profileData };
      setUser(userData);
      setIsLoggedIn(true);
    } catch (e) {
      console.error('Error during login:', e);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const decoded = decodeJWT(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded.exp > currentTime) {
            const profileData = await findUserByUserId(decoded.sub);
            setUser({ ...decoded, ...profileData });
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('auth_token');
            setIsLoggedIn(false);
          }
        }
      } catch (e) {
        console.error('Error initializing auth:', e);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, updateUser, user, loading, logout, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
};
