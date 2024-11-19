import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WebScreen from '../../pages/Web';
import Trails from '../../pages/Trails';
import HomeScreen from '../../pages/HomeScreen';
import Settings from '../../pages/Settings';
import Favorite from '../../pages/Favorite';
import Milestone from '../../pages/Milestone';
import Test from '../../pages/Test';
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
            <Route path="/Trails" element={<Trails />} />
            <Route path="/Favorite" element={<Favorite />} />
            <Route path="/Milestone" element={<Milestone />} />
            <Route path="/Settings" element={<Settings />} />
          </>
        ) : (
          <Route path="/" element={<HomeScreen />} />
        )}
        <Route path="/Test" element={<Test />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/WebScreen" : "/"} />} />
      </Routes>
  );
};

export default AppRoutes;
