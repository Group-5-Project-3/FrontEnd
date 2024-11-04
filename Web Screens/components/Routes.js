import React, { useEffect, useState, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WebScreen from '../pages/Web';
import Trails from '../pages/Trails';
import LoginScreen from '../pages/LoginScreen';
import SignupScreen from '../pages/SignupScreen';
import Settings from '../pages/Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext'; // Ensure the path is correct
import { Spinner, Box } from 'native-base'; // Import Spinner for a loading indicator
import Test from '../pages/Test';

const Stack = createStackNavigator();

const Routes = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // Get context state and setter
  const [initialRoute, setInitialRoute] = useState(null); // Start with no initial route
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const username = await AsyncStorage.getItem('@username');
        if (username) {
          setIsLoggedIn(true); // Update context state
          setInitialRoute('WebScreen'); // Change initial route to 'WebScreen' if logged in
        } else {
          setIsLoggedIn(false);
          setInitialRoute('Login'); // Default to 'Login' if not logged in
        }
      } catch (e) {
        console.error('Error checking login status', e);
      } finally {
        setLoading(false); // Set loading to false when check is complete
      }
    };

    checkLoginStatus();
  }, [setIsLoggedIn]);

  // Show a loading indicator until the initial route is determined
  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
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
        name="Test"
        component={Test}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Routes;
