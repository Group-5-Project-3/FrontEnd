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
import { calculateDistance, checkIfTrailExist, decodeJWT } from "./utils/utils";
import {
  addFavoriteTrail,
  createCheckIn,
  createReview,
  createTrail,
  deleteFavoriteTrail,
  findUserByUserId,
  getCheckInsByUserId,
  getFavoriteTrailsByUserId,
  getTrailByPlacesId,
  getTrailReviews,
} from "../../APICalls";
import { TextInput } from "react-native";
import StarRating from "react-native-star-rating-widget";
import { AirbnbRating } from "react-native-ratings";
import { ScrollView } from "react-native";
import { err } from "react-native-svg";

const MapComponent = () => {
  const [userName, setUserName] = useState(null);
  const [userID, setUserID] = useState(null);
  const [location, setLocation] = useState({
    latitude: 40.7128, // default to NYC
    longitude: -74.006,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLat, setUserLat] = useState(null);
  const [userLong, setUserLong] = useState(null);

  const [places, setPlaces] = useState([]);
  const resolvedIcon = Asset.fromModule(TreeLogo).uri;

  const [modalID, setModalID] = useState("");
  const [modalName, setModalName] = useState("");
  const [modalLong, setModalLong] = useState(0);
  const [modalLat, setModalLat] = useState(0);
  const [modalRating, setModalRating] = useState(0);
  const [modalPhoto, setModalPhoto] = useState(null);
  const [modalAddress, setModalAddress] = useState(null);
  const [modalDesc, setModalDesc] = useState(null);

  const [favArr, setFavArr] = useState(null);
  const [checkInsArr, setCheckInsArr] = useState(null);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const [trailId, setTrailId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  const [userReview, setUserReview] = useState("");
  const [parkReviews, setParkReviews] = useState(null);

  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(0);

  const [descModalVisible, setDescModalVisible] = useState(false);
  const [sentModal, setSentModal] = useState(false);
  const [reviewsModal, setReviewsModal] = useState(false);

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
          getUserFavs();
          getCheckIns();
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

      setUserLat(latitude);
      setUserLong(longitude);

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

  // useEffect(() => {
  //   // console.log("selectedPlace changed:", selectedPlace);

  //   const fetchTrailId = async () => {
  //     console.log("In fetchTrailId");
  //     console.log("SelectedPlace:", selectedPlace);
  //     console.log("palce id:", selectedPlace.place_id);

  //     if (selectedPlace) {
  //       console.log("Fetching trail ID:");
  //       try {
  //         const trailInfo = await checkIfThisTrailExist(
  //           selectedPlace.place_id,
  //           selectedPlace
  //         );
  //         console.log("Trail ID retrieved:", trailInfo.trailId);
  //         setTrailId(trailInfo.trailId);
  //       } catch (error) {
  //         console.error("Error fetching trail info:", error);
  //       }
  //     }
  //   };

  //   fetchTrailId();
  // }, [selectedPlace]);

  const isFavorite = () => {
    if (!favArr || favArr.length === 0) return false;
    return favArr.some((fav) => fav.trailId === trailId);
  };

  const isCheckedIn = () => {
    if (!checkInsArr || checkInsArr.length === 0) return false;
    return checkInsArr.some((checkIn) => checkIn.trailId === trailId);
  };

  const fetchTrailId = async (id, place) => {
    console.log("In fetchTrailId");
    console.log("palce:", id);
    console.log("palce id:", place);

    if (place) {
      try {
        console.log("going to checkIfThisTrailExist...");
        const trailInfo = await checkIfThisTrailExist(id, place);
        console.log("Trail ID retrieved:", trailInfo.trailId);
        setTrailId(trailInfo.trailId);
        console.log("trailInfo address: ", trailInfo.location);
        setModalAddress(trailInfo.location);
        console.log("trailInfo rating: ", trailInfo.avgRating);
        setModalRating(trailInfo.avgRating);
        console.log("trailInfo description: ", trailInfo.description);
        setModalDesc(trailInfo.description);
        console.log(
          "trailInfo.images[0].imageUrl: ",
          trailInfo.images[0].imageUrl
        );
        if (trailInfo.images[0].imageUrl) {
          setModalPhoto(trailInfo.images[0].imageUrl);
        }
      } catch (error) {
        console.error("Error fetching trail info:", error);
      }
    }
  };

  const checkIfThisTrailExist = async (place_id, place) => {
    console.log("in checkIfThisTrailExist");
    console.log("place_id passed in: ", place_id);
    console.log("palce passed in: ", place);
    const token = await AsyncStorage.getItem("@auth_token");
    console.log("token: ", token);
    try {
      // Await the result of getTrailByPlacesId
      console.log("going to getTrailByPlacesId...");
      const trail = await getTrailByPlacesId(place_id);
      console.log("trail variable: ", trail);
      if (trail != null) {
        return trail;
      } else {
        console.log(
          `Trail with place_id ${place_id} not found. Creating a new trail.`
        );
        const newTrail = {
          placesId: place_id,
          name: place.name,
          location: place.vicinity,
          description: "New review",
        };
        // MIGHT CAUSE ERROR IF NEW TRAIL IS CREATE AND DOES NOT HAVE IMAGE FIELD
        return await createTrail(newTrail); // Call the createTrail function to add it to the database
      }
    } catch (error) {
      console.log("back in checkIfThisTrailExist, was null");
      // For any other errors, log and re-throw
      console.error("An unexpected error occurred:", error.message);
      throw error;
    }
  };

  const fetchNearbyPlaces = async (latitude, longitude) => {
    const apiKey = "AIzaSyBnst1HITYqMUngjdlU5bqarqkHvFG2Emc"; // Replace with your actual API key
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

  const parkPressed = async (name, id, lat, long, place) => {
    // alert(
    //   "park pressed, id: " + id,
    //   +" name: " + name + " lat & long: " + lat,
    //   +long
    // );
    console.log("park pressed");
    setModalID(id);
    setModalName(name);
    setModalLat(lat);
    setModalLong(long);
    setModalVisible(true);
    setSelectedPlace(place);
    await fetchTrailId(id, place);
    console.log("done with press");
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

    if (difficulty === 0) {
      alert("Please put a Difficulty level");
      return;
    }

    const reviewInfo = {
      trailId: trailId,
      userId: userID,
      difficultyRating: difficulty,
      rating: rating,
      comment: userReview,
    };

    // make 'review' object and call POST review endpoint
    console.log("calling API createReview...");

    try {
      const apiCallData = await createReview(reviewInfo);
      console.log("respone data: ", apiCallData);
      setReviewModalVisible(false);
      setModalVisible(true);
      setUserReview("");
      setRating(0);
      setDifficulty(0);
      alert("Review Submitted!");
    } catch (e) {
      console.log("Error calling createReview: ", e);
    }
  };

  const checkIn = async () => {
    //alert("check in still being implemented");
    console.log("in checkIn");

    const distance = calculateDistance(userLat, userLong, modalLat, modalLong);
    const threshold = 5000;

    if (distance <= threshold) {
      console.log("calling checkIn...");
      const checkInData = {
        trailId,
        name: modalName,
        userId: userID,
      };

      try {
        const res = await createCheckIn(checkInData);
        getCheckIns();
        alert("Check-in successful!");
      } catch {
        console.alert("You already checked into this trail");
      }
    } else {
      alert(`You are too far from ${modalName}. Move closer to check in!`);
    }
  };

  const getCheckIns = async () => {
    try {
      const res = await getCheckInsByUserId(userID);
      setCheckInsArr(res);
      console.log(
        "sucessess getting user check in arr for user: ",
        checkInsArr
      );
    } catch (e) {
      console.error("Error calling getCheckInsByUserId: ", e);
    }
  };

  const favorite = async (name, id) => {
    // alert("favorite in still being implemented");
    console.log("place name: ", name);
    console.log("trail id: ", id);
    console.log("user id: ", userID);

    try {
      const favTrailData = await addFavoriteTrail(userID, id);
      console.log("favorited trail data: ", favTrailData);
      console.log("resessting the fav arr...");
      getUserFavs();
    } catch {
      alert("You Already Favorited This Trail");
    }
  };

  const unfavorite = async (name, id) => {
    // alert("favorite in still being implemented");
    console.log("place name: ", name);
    console.log("trail id: ", id);
    console.log("user id: ", userID);

    try {
      const favTrailData = await deleteFavoriteTrail(userID, id);
      console.log("unfavorited trail data: ", favTrailData);
      console.log("resessting the fav arr...");
      getUserFavs();
    } catch {
      alert("You Already Unfavorited This Trail");
    }
  };

  const getUserFavs = async () => {
    console.log("in getUserFavs...");
    try {
      const userFavArr = await getFavoriteTrailsByUserId(userID);
      console.log("getFavoriteTrailsByUserId returned: ", userFavArr);
      setFavArr(userFavArr);
    } catch (error) {
      console.log("error getting user favs: ", error);
    }
  };

  const review = () => {
    // alert("review in still being implemented");
    setReviewModalVisible(true);
    setModalVisible(false);
  };

  const closeReviewsModal = () => {
    // alert("review in still being implemented");
    setReviewsModal(false);
    setModalVisible(true);
  };

  const getReviewsForPark = async () => {
    console.log("in getReviewForPark");
    console.log("trail id: ", trailId);
    console.log("calling api...");
    const response = await getTrailReviews(trailId);
    setParkReviews(response);
    console.log("response data: ", response);
    setModalVisible(false);
    setReviewsModal(true);
  };

  const openDesc = async () => {
    console.log("opening desc modal");
    setModalVisible(false);
    setDescModalVisible(true);
  };

  const openSent = async () => {
    console.log("opening sent modal");
  };

  const openReviews = async () => {
    console.log("opening reviews modal");
  };

  const handleCloseMdoal = async () => {
    setModalID("");
    setModalName("");
    setModalLong(0);
    setModalLat(0);
    setModalRating(0);
    setModalPhoto(null);
    setModalAddress(null);
    setModalDesc(null);
    setSelectedPlace(null);
    setTrailId(null);
    setModalVisible(false);
  };

  const closeDescModal = () => {
    setDescModalVisible(false);
    setModalVisible(true);
  };

  const handleCloseReviewModal = () => {
    setUserReview("");
    setRating(0);
    setDifficulty(0);
    setReviewModalVisible(false);
    setModalVisible(true);
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
                place.geometry.location.lng,
                place
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
            <Pressable onPress={handleCloseMdoal}>
              <Text style={styles.modalBackText}>Close</Text>
            </Pressable>
          </View>
          <Text style={styles.modalTitleText}>{modalName}</Text>

          <View style={styles.flexContainer}>
            <Pressable onPress={openDesc}>
              <Text style={styles.modalText}>Descripton</Text>
            </Pressable>
            <Pressable onPress={openSent}>
              <Text style={styles.modalText}>Sentiments</Text>
            </Pressable>
            <Pressable onPress={getReviewsForPark}>
              <Text style={styles.modalText}>Reviews</Text>
            </Pressable>
          </View>

          <View style={styles.lineSeprator}></View>

          <Text style={styles.locationText}>📍 {modalAddress}</Text>

          {modalPhoto ? (
            <Image
              source={{ uri: modalPhoto }}
              style={styles.modalImage} // Define styles for your image
            />
          ) : (
            <Text style={styles.modalText}>Image does NOT exist</Text>
          )}

          {/* <View style={styles.lineSeprator} width="100%"></View> */}

          {/* <Pressable onPress={checkIn} style={styles.modalActionButton}>
            <Text style={styles.bottomViewText}>Check In</Text>
          </Pressable> */}

          {isCheckedIn() ? (
            <Pressable
              onPress={() => alert("You Already Checked Into This Trail!")}
              style={styles.modalActionButton}
            >
              <Text style={styles.bottomViewText}>Checked In</Text>
            </Pressable>
          ) : (
            <Pressable onPress={checkIn} style={styles.modalActionButton}>
              <Text style={styles.bottomViewText}>Check In</Text>
            </Pressable>
          )}

          {isFavorite() ? (
            <Pressable
              onPress={() => unfavorite(modalName, trailId)}
              style={styles.modalActionButton}
            >
              <Text style={styles.bottomViewText}>Unfavorite</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => favorite(modalName, trailId)}
              style={styles.modalActionButton}
            >
              <Text style={styles.bottomViewText}>Favorite</Text>
            </Pressable>
          )}

          <Pressable onPress={review} style={styles.modalActionButton}>
            <Text style={styles.bottomViewText}>Review</Text>
          </Pressable>

          {/* <Pressable onPress={getReviewsForPark}>
            <Text style={styles.reviewsText}>Reviews</Text>
          </Pressable> */}

          {/* <ScrollView>
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
          </ScrollView> */}
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
            <Pressable onPress={handleCloseReviewModal}>
              <Text style={styles.modalBackText}>Back</Text>
            </Pressable>
          </View>

          <Text style={styles.modalTitleText}> Review for {modalName}</Text>

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

          <View style={styles.flexContainer}>
            <Text style={styles.modalText}>Rate: </Text>
            <StarRating rating={rating} onChange={setRating} />
          </View>

          <View style={styles.flexContainer}>
            <Text style={styles.modalText}>Difficulty: </Text>
            <StarRating rating={difficulty} onChange={setDifficulty} />
          </View>

          <Pressable
            style={styles.modalActionButton}
            onPress={() => submitReview()}
          >
            <Text style={styles.bottomViewText}>Submit</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={descModalVisible}
        onRequestClose={() => setDescModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.centerModalContainer}>
            <Text style={styles.modalTitleText}>Description</Text>
            <Text style={styles.modalTextCentered}>
              {modalDesc || "No description available."}
            </Text>
            <Pressable
              onPress={closeDescModal}
              style={styles.modalActionButton}
            >
              <Text style={styles.bottomViewText}>Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewsModal}
        onRequestClose={() => setReviewsModal(false)}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalTopContainer}>
            <Pressable onPress={closeReviewsModal}>
              <Text style={styles.modalBackText}>Back</Text>
            </Pressable>
          </View>

          <Text style={styles.modalTitleText}> Reviews for {modalName}</Text>

          <ScrollView style={styles.reviewsContainer}>
            {parkReviews && parkReviews.length > 0 ? (
              parkReviews.map((review, index) => (
                <View key={index} style={styles.reviewContainer}>
                  <Text style={styles.reviewUser}>
                    {review.user_name || "Anonymous"}:
                  </Text>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewDifficulty}>
                    Difficulty: {review.difficultyRating}/5
                  </Text>
                  <Text style={styles.reviewRating}>
                    Rating: {review.rating}/5
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewsText}>No reviews available.</Text>
            )}
          </ScrollView>
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
    // backgroundColor: "brown",
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
    marginTop: "5%",
    marginBottom: "2%",
    textAlign: "center",
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
  flexContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  modalActionButton: {
    backgroundColor: "#027bff",
    width: "50%",
    height: "7%",
    borderRadius: scale * 10,
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
  modalText: {
    color: "white",
    fontSize: scaledFontSize(18),
    fontWeight: "bold",
    color: "#027bff",
    margin: "2%",
  },
  modalTextCentered: {
    color: "white",
    fontSize: scaledFontSize(14),
    fontWeight: "bold",
    color: "white",
    margin: "2%",
    textAlign: "center",
  },
  modalImage: {
    width: 200, // Adjust size
    height: 200, // Adjust size
    resizeMode: "cover", // Maintain aspect ratio
    borderRadius: 10, // Optional rounded corners
    marginVertical: 10, // Add spacing
  },
  locationText: {
    color: "white",
    fontSize: scaledFontSize(12),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //alignContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centerModalContainer: {
    width: "80%",
    padding: "5%",
    backgroundColor: "black",
    borderRadius: "10%",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  reviewsContainer: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 10,
  },

  reviewContainer: {
    backgroundColor: "#404040",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },

  reviewUser: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: scaledFontSize(16),
  },

  reviewComment: {
    color: "#ddd",
    fontSize: scaledFontSize(14),
    marginTop: 5,
  },

  reviewDifficulty: {
    color: "#bbb",
    fontSize: scaledFontSize(14),
    marginTop: 5,
  },

  reviewRating: {
    color: "#fff",
    fontSize: scaledFontSize(14),
    marginTop: 5,
  },

  noReviewsText: {
    color: "#ccc",
    fontSize: scaledFontSize(16),
    textAlign: "center",
    marginTop: 10,
  },
});

export default MapComponent;
