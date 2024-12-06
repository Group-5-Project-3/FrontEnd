import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import WebApp from './WebApp';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



const App = () => (
  <AuthProvider>
    <Router>
        <WebApp />
    </Router>
  </AuthProvider>
);

export default App;
