import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MobileScreen from './Mobile';

const Stack = createStackNavigator();

const MobileApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MobileScreen">
        <Stack.Screen name="MobileScreen" component={MobileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MobileApp;
