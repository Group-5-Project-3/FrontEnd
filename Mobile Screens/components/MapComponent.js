import React, { useState, useEffect, useContext } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../AuthContext";
import { decodeJWT } from "./utils/utils";
import {
  addFavoriteTrail,
  createReview,
  findUserByUserId,
  getTrailReviews,
} from "../../APICalls";
import { TextInput } from "react-native";
import StarRating from "react-native-star-rating-widget";
import { AirbnbRating } from "react-native-ratings";
import { ScrollView } from "react-native";

const MapComponent = () => {
  const [userName, setUserName] = useState(null);
  const [userID, setUserID] = useState(null);
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

  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  const [userReview, setUserReview] = useState("");

  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(3);

  const test_arr = [
    {
      parkName: "James Park",
      parkDiff: 3,
      user_name: "Sarah",
      comment: "Awesome!",
      id: 1,
    },
    {
      parkName: "Centrel Park",
      parkDiff: 5,
      user_name: "Joe",
      comment: "Really green.",
      id: 2,
    },
    {
      parkName: "Hills Trail",
      parkDiff: 5,
      user_name: "John",
      comment: "Tiring but worth it!",
      id: 3,
    },
    {
      parkName: "Moutain Trail",
      parkDiff: 1,
      user_name: "Tom",
      comment: "It sucks",
      id: 4,
    },
    {
      parkName: "Moutain Trail",
      parkDiff: 3,
      user_name: "Jose",
      comment: "Its ok. I liked the view at the top but it was kinda short",
      id: 5,
    },
  ];

  useEffect(() => {
    // const { user, loading, logout } = useContext(AuthContext);
    const initialize = async () => {
      try {
        // Get the token from AsyncStorage
        const token = await AsyncStorage.getItem("@auth_token");
        if (!token) {
          console.log("No token found in AsyncStorage");
          return;
        } else {
          console.log("token was found: ", token);
          const decodedToken = decodeJWT(token);
          console.log("decoded token: ", decodedToken);
          const userInfo = await findUserByUserId(decodedToken.sub);
          console.log("user info: ", userInfo);
          setUserID(userInfo.id);
          setUserName(userInfo.username);
          console.log("set user name and id to ", userName + " " + userID);
        }

        // const response = await axios.get("https://your-api.com/user", {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });

        //setUser(response.data); // Save user details in state
        //console.log("User fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

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
    initialize();
    //test
  }, []);

  const fetchNearbyPlaces = async (latitude, longitude) => {
    const apiKey = "AIzaSyBCqXWNXUbFaITYSCy48mDKn8NFwpBtB4E"; // Replace with your actual API key
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
      console.log(
        "googlePlaces iMAGE ARYRRAY at [0]:",
        googlePlaces[0].photos[0].html_attributions[0]
      );

      // Optionally set the places state
      setPlaces(googlePlaces);

      //console.log("response data: " + response.data); // Process your data here
    } catch (e) {
      console.log("There was an error using Google Places API: ", e);
    }
  };

  const parkPressed = (name, id, lat, long, image) => {
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

  const submitReview = async () => {
    console.log("in submit review");
    console.log("user entered: ", userReview);

    if (!userReview) {
      alert("Please write a Review");
      return;
    }

    if (rating === 0) {
      alert("Please leave a Rating");
      return;
    }

    const reviewInfo = {
      trailId: modalID,
      userId: userID,
      difficultyRating: difficulty,
      rating: rating,
      review: userReview,
    };

    // make 'review' object and call POST review endpoint
    console.log("calling API createReview...");
    const apiCallData = await createReview(reviewInfo);
    console.log("respone data: ", apiCallData);
  };

  const checkIn = () => {
    alert("check in still being implemented");
  };

  const favorite = async (name, id) => {
    alert("favorite in still being implemented");
    console.log("place name: ", name);
    console.log("place id: ", id);
    console.log("user id: ", userID);

    const favTrailData = await addFavoriteTrail(userID, id);
    console.log("favorited trail data: ", favTrailData);
  };

  const review = () => {
    // alert("review in still being implemented");
    setReviewModalVisible(true);
    setModalVisible(false);
  };

  const closeReview = () => {
    // alert("review in still being implemented");
    setReviewModalVisible(false);
    setModalVisible(true);
  };

  const getReviewsForPark = async () => {
    console.log("in getReviewForPark");
    console.log("park id: ", modalID);
    console.log("calling api...");
    const response = await getTrailReviews(modalID);
    console.log("response data: ", response);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={location}
        showsUserLocation={true}
        // customMapStyle={customMapStyle}
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
            // image={place.icon} // Custom icon for the marker
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
          <View style={styles.modalTopContainer}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.modalBackText}>Close</Text>
            </Pressable>
          </View>
          <Text style={styles.modalTitleText}>{modalName}</Text>
          {/* <View style={styles.lineSeprator}></View> */}
          {/* <Text style={styles.modalTitleText}>ID: {modalID}</Text> */}
          {/* <Text style={styles.modalTitleText}>Lat: {modalLat}</Text> */}
          {/* <Text style={styles.modalTitleText}>Long: {modalLong}</Text> */}
          <Pressable onPress={checkIn} style={styles.modalActionButton}>
            <Text style={styles.bottomViewText}>Check In</Text>
          </Pressable>
          <Pressable
            onPress={() => favorite(modalName, modalID)}
            style={styles.modalActionButton}
          >
            <Text style={styles.bottomViewText}>Favorite</Text>
          </Pressable>
          <Pressable onPress={review} style={styles.modalActionButton}>
            <Text style={styles.bottomViewText}>Review</Text>
          </Pressable>

          <View style={styles.lineSeprator}></View>
          <Pressable onPress={getReviewsForPark}>
            <Text style={styles.reviewsText}>Reviews</Text>
          </Pressable>

          <ScrollView>
            {test_arr.map((r) => (
              <View key={r.id} style={styles.reviewContainer}>
                <Text style={styles.reviewParkName}>{r.parkName}</Text>
                <Text style={styles.reviewDifficulty}>
                  Difficulty: {r.parkDiff}
                </Text>
                <Text style={styles.reviewUser}>User: {r.user_name}</Text>
                <Text style={styles.reviewComment}>"{r.comment}"</Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalTopContainer}>
            <Pressable onPress={() => closeReview(false)}>
              <Text style={styles.modalBackText}>Close</Text>
            </Pressable>
          </View>

          <Text style={styles.reviewsText}>Reviewing for...</Text>
          <Text style={styles.modalTitleText}>{modalName}</Text>

          <SafeAreaView style={styles.inputContainer}>
            <TextInput
              placeholder="Tell everyone what you thought!"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              multiline={true} // Enables multi-line text input
              autoFocus={true}
              // numberOfLines={4}
              value={userReview}
              onChangeText={setUserReview}
            />
          </SafeAreaView>

          <StarRating rating={rating} onChange={setRating} />

          <Text style={styles.reviewsText}>
            For test purposes the diffculty will be 3
          </Text>

          <Pressable
            style={styles.modalActionButton}
            onPress={() => submitReview()}
          >
            <Text style={styles.bottomViewText}>Submit</Text>
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
    marginTop: "15%",
  },
  modalTitleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: scaledFontSize(28),
    margin: "5%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackText: {
    color: "white",
    fontWeight: "bold",
    fontSize: scaledFontSize(15),
  },
  modalTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: width * 0.05,
    marginTop: width * 0.08,
  },
  modalActionButton: {
    backgroundColor: "#0fa726",
    width: "50%",
    height: "7%",
    borderRadius: scale * 30,
    alignItems: "center",
    justifyContent: "center",
    margin: height / 100, // Vertical spacing
  },
  bottomViewText: {
    color: "white",
    fontSize: scaledFontSize(20),
    fontWeight: "bold",
  },
  lineSeprator: {
    height: 3,
    backgroundColor: "#505050",
    marginVertical: 10,
    width: "80%",
  },
  reviewsText: {
    color: "white",
    fontSize: scaledFontSize(15),
    fontWeight: "ultralight",
  },
  inputContainer: {
    marginTop: height * 0.01,
    width: 300,
    backgroundColor: "#404040",
    borderRadius: 10,
    padding: width * 0.03,
    marginVertical: 10,
    //alignItems: "center",
    // justifyContent: "center",
    textAlign: "center",
    height: "50%",
    paddingVertical: "5%",
    paddingHorizontal: "5%",
  },
  inputText: {
    color: "white",
  },
  reviewContainer: {
    backgroundColor: "#333",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  reviewParkName: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  reviewDifficulty: {
    color: "#ddd",
    fontSize: 14,
  },
  reviewUser: {
    color: "#bbb",
    fontSize: 14,
  },
  reviewComment: {
    color: "white",
    fontStyle: "italic",
    fontSize: 14,
  },
});

export default MapComponent;
