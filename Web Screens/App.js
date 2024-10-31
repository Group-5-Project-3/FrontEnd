import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WebScreen from './pages/Web';
import NavBar from './components/NavBar'; // Import the NavBar component
import 'bootstrap/dist/css/bootstrap.min.css';

const Stack = createStackNavigator();

const WebApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WebScreen">
        <Stack.Screen name="WebScreen" component={WebScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default WebApp;
