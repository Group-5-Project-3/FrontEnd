import React from 'react';
import { NativeBaseProvider, Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WebScreen from './pages/Web';
import NavBar from './components/NavBar';
import Trails from './pages/Trails';

const Stack = createStackNavigator();

const WebApp = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Box flex={1}>
          {/* Place NavBar inside the NavigationContainer to have access to the navigation context */}
          <NavBar />
          <Stack.Navigator initialRouteName="WebScreen">
            <Stack.Screen
              name="WebScreen"
              component={WebScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Trails"
              component={Trails}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </Box>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default WebApp;
