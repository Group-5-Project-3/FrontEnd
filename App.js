import React from 'react';
import { Platform } from 'react-native';

// Conditionally import the correct App component
const App = Platform.OS === 'web'
  ? require('./Web Screens/App').default
  : require('./Mobile Screens/App').default;

export default App;
