import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import WebApp from './WebApp';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoadScript } from '@react-google-maps/api';
import './App.css';



const App = () => (
  <AuthProvider>
    <Router>
      {/* <LoadScript googleMapsApiKey="AIzaSyDqZs2GcqLEwKD1rganE4GHJ5HHY85hRd0"> */}
        <WebApp />
      {/* </LoadScript> */}
    </Router>
  </AuthProvider>
);

export default App;
