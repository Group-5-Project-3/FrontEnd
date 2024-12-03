import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MobileScreen from "./Mobile";
import StartUp from "./StartUp";
import { AuthProvider } from "./AuthContext";

const Stack = createStackNavigator();

const MobileApp = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartUp">
          <Stack.Screen
            name="StartUp"
            component={StartUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MobileScreen"
            component={MobileScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default MobileApp;
