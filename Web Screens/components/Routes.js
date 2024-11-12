import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WebScreen from '../pages/Web';
import Trails from '../pages/Trails';
import HomeScreen from '../pages/HomeScreen';
import Settings from '../pages/Settings';
import { AuthContext } from '../AuthContext';
import { Spinner, Box } from 'native-base';
import Test from '../pages/Test';

const Stack = createStackNavigator();

const Routes = () => {
  const { isLoggedIn, user, loading } = useContext(AuthContext); // Get login status and loading state

  // Show a loading indicator until AuthContext has determined login status
  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? "WebScreen" : "Home"}>
      {isLoggedIn ? (
        <>
          {/* Protected routes */}
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
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          {/* Public routes */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
      {/* Route accessible in both states */}
      <Stack.Screen
        name="Test"
        component={Test}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Routes;
