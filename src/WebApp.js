import React, { useContext } from 'react';
import NavBar from './components/navigation/NavBar';
import AppRoutes from './components/navigation/Routes';
import { AuthContext } from './AuthContext';

const WebApp = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {isLoggedIn && <NavBar />}
      <div className="map-container">
        <AppRoutes />
      </div>
    </div>
  );
};

export default WebApp;
