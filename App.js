import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import WebScreen from './Web Screens/Web';
import MobileScreen from './Mobile Screens/Mobile';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Platform.OS === 'web' ? 'WebScreen' : 'MobileScreen'}>
        <Stack.Screen name="WebScreen" component={WebScreen} />
        <Stack.Screen name="MobileScreen" component={MobileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
