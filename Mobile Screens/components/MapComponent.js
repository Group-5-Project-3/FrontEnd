import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Pressable,
  Modal,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { Asset } from "expo-asset";
import TreeLogo from "../../assets/TreeLogo.png";
import { TouchableOpacity } from "react-native";

const MapComponent = () => {
  const [location, setLocation] = useState({
    latitude: 40.7128, // default to NYC
    longitude: -74.006,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [places, setPlaces] = useState([]);
  const resolvedIcon = Asset.fromModule(TreeLogo).uri;

  const [modalID, setModalID] = useState("");
  const [modalName, setModalName] = useState("");
  const [modalLong, setModalLong] = useState(0);
  const [modalLat, setModalLat] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      fetchNearbyPlaces(latitude, longitude);

      console.log(
        "Current Location: Lat:" +
          currentLocation.coords.latitude +
          " Long: " +
          currentLocation.coords.longitude
      );
    };
    getPermissions();
  }, []);

  const fetchNearbyPlaces = async (latitude, longitude) => {
    const apiKey = "AIzaSyBEtitoZ3QZzqzQF-YkbSXYxgzcoKEkFI4"; // Replace with your actual API key
    const radius = 5000;

    console.log("in fetchNearbyPlaces");

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${latitude},${longitude}`,
            radius,
            type: "park", // Type can be "park" or other categories like "trail"
            key: apiKey,
          },
        }
      );

      // Log the entire response
      //console.log("Full Response:", response);

      // Log only the `data` part of the response
      //console.log("Response Data:", response.data);

      // Log the places (results array)
      const googlePlaces = response.data.results;
      //console.log("googlePlaces :", googlePlaces);

      console.log("googlePlaces at [0]:", googlePlaces[0]);

      // Optionally set the places state
      setPlaces(googlePlaces);

      //console.log("response data: " + response.data); // Process your data here
    } catch (e) {
      console.log("There was an error using Google Places API: ", e);
    }
  };

  const customMapStyle = [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [
        {
          saturation: 36,
        },
        {
          color: "#000000",
        },
        {
          lightness: 40,
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#000000",
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 17,
        },
        {
          weight: 1.2,
        },
      ],
    },
    {
      featureType: "administrative.neighborhood",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 20,
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 21,
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#1a732c",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#b2b2b2",
        },
        {
          lightness: 17,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 29,
        },
        {
          weight: 0.2,
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          color: "#8e8e8e",
        },
        {
          lightness: 18,
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [
        {
          color: "#808080",
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 19,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#0f252e",
        },
        {
          lightness: 17,
        },
      ],
    },
  ];

  const parkPressed = (name, id, lat, long) => {
    // alert(
    //   "park pressed, id: " + id,
    //   +" name: " + name + " lat & long: " + lat,
    //   +long
    // );
    setModalID(id);
    setModalName(name);
    setModalLat(lat);
    setModalLong(long);
    setModalVisible(true);
  };

  const checkIn = () => {
    alert("check in still being implemented");
  };

  const favorite = () => {
    alert("favorite in still being implemented");
  };

  const review = () => {
    alert("review in still being implemented");
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={location}
        showsUserLocation={true}
        customMapStyle={customMapStyle}
        tracksViewChanges={false}
      >
        {places.map((place) => (
          <Marker
            key={place.place_id} // Unique identifier for each marker
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            // title={place.name} // Display name of the place
            // description={`Location: (${place.latitude}, ${place.longitude})`}
            // image={TreeLogo} // Custom icon for the marker
            onPress={() =>
              parkPressed(
                place.name,
                place.place_id,
                place.geometry.location.lat,
                place.geometry.location.lng
              )
            }
          >
            <View style={styles.markerContainer}>
              <Image source={TreeLogo} style={styles.markerImage} />
              <Text style={styles.markerLabel}>{place.name}</Text>
            </View>

            {/* <View style={styles.customMarker}>
              <Text style={styles.markerText}>{place.name}</Text>
            </View> */}
          </Marker>
        ))}
      </MapView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalBackground}>
          <Text style={styles.modalTitleText}>Name: {modalName}</Text>
          <Text style={styles.modalTitleText}>ID: {modalID}</Text>
          <Text style={styles.modalTitleText}>Lat: {modalLat}</Text>
          <Text style={styles.modalTitleText}>Long: {modalLong}</Text>
          <Pressable onPress={checkIn}>
            <Text style={styles.modalBackText}>Check In</Text>
          </Pressable>
          <Pressable onPress={favorite}>
            <Text style={styles.modalBackText}>Favorite</Text>
          </Pressable>
          <Pressable onPress={review}>
            <Text style={styles.modalBackText}>Review</Text>
          </Pressable>
          <Pressable onPress={() => setModalVisible(false)}>
            <Text style={styles.modalBackText}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const scale = width / 375;
const scaledFontSize = (size) => size * scale;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "brown",
    margin: 0,
  },
  markerImage: {
    width: width / 5, // Adjust width of the image
    height: height / 5, // Adjust height of the image
    resizeMode: "contain", // Ensures the image maintains its aspect ratio
    margin: 0,
    padding: 0,
  },
  markerLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    margin: 0, // Adds some space between the image and label
    padding: 0,
  },
  modalBackground: {
    alignItems: "center",
    alignContent: "center",
    padding: width * 0.05,
    flex: 1,
    backgroundColor: "black",
    borderTopStartRadius: scale * 20,
    borderTopEndRadius: scale * 20,
    // marginTop: width * 0.5,
  },
  modalTitleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: scaledFontSize(20),
  },
  modalBackText: {
    color: "white",
    fontWeight: "bold",
    fontSize: scaledFontSize(15),
  },
});

export default MapComponent;