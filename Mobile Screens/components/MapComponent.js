import React, { useState, useEffect } from "react";
import MapView from "react-native-maps";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import * as Location from "expo-location";

const MapComponent = () => {
  const [location, setLocation] = useState({
    latitude: 40.7128, // default to NYC
    longitude: -74.006,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      console.log(
        "Current Location: Lat:" +
          currentLocation.coords.latitude +
          " Long: " +
          currentLocation.coords.longitude
      );
    };
    getPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={location} showsUserLocation={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default MapComponent;
