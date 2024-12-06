import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WebScreen from '../../pages/Web';
import HomeScreen from '../../pages/HomeScreen';
import Settings from '../../pages/Settings';
import Favorite from '../../pages/Favorite';
import Milestone from '../../pages/Milestone';
import { AuthContext } from '../../AuthContext';
import { Spinner } from 'react-bootstrap';

const AppRoutes = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/WebScreen" element={<WebScreen />} />
            <Route path="/Favorite" element={<Favorite />} />
            <Route path="/Milestone" element={<Milestone />} />
            <Route path="/Settings" element={<Settings />} />
          </>
        ) : (
          <Route path="/" element={<HomeScreen />} />
        )}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/WebScreen" : "/"} />} />
      </Routes>
  );
};

export default AppRoutes;
