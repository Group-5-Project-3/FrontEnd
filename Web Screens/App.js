import React from 'react';
import { AuthProvider } from './AuthContext';
import WebApp from './WebApp'; // Ensure the path is correct
import { NativeBaseProvider } from 'native-base';

const App = () => (
  
    <NativeBaseProvider>
      <AuthProvider>
        <WebApp />
      </AuthProvider>
    </NativeBaseProvider>
  
);

export default App;
