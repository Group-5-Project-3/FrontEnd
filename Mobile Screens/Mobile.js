import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./Profile";
import MapComponent from "./components/MapComponent";
import Favorites from "./Favorites";
import Milestones from "./Milestones";
import FontAwesome from "react-native-vector-icons/FontAwesome";

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
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map" color={color} size={size * 0.8} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="heart" color={color} size={size * 0.8} />
          ),
        }}
      />
      <Tab.Screen
        name="Milestones"
        component={Milestones}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="flag" color={color} size={size * 0.8} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size * 0.8} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
