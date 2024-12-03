import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./Profile";
import MapComponent from "./components/MapComponent";
import Favorites from "./Favorites";

const Tab = createBottomTabNavigator();

export default function MobileScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#1c1c1e" },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#8e8e93",
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapComponent}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Account"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
