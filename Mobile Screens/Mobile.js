import React from "react";
import { View, Text } from "react-native";
import MapComponent from "./components/MapComponent";
import Profile from "./Profile";

export default function MobileScreen() {
  return (
    <View>
      {/* <Text>testing...</Text> */}
      <Profile></Profile>
      {/* <MapComponent></MapComponent> */}
    </View>
  );
}
