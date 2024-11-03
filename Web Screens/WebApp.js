import React, { useContext } from 'react';
import { Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import NavBar from './components/NavBar';
import Routes from './components/Routes';
import { AuthContext } from './AuthContext'; // Ensure the path is correct

const WebApp = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Box flex={1}>
        {isLoggedIn && <NavBar />}
        <Routes />
      </Box>
    </NavigationContainer>
  );
};

export default WebApp;
