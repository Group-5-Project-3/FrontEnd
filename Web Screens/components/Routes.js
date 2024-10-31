// src/components/Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MapComponent from '../pages/MapComponent';
import Trails from '../pages/Trails';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MapComponent />} />
      <Route path="/trails" element={<Trails />} />
    </Routes>
  );
}

export default AppRoutes;
