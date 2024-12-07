import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJWT } from "./components/utils/utils";
import { findUserByUserId, getMilestonesByUserId } from "../APICalls";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

const Milestones = () => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState(null);
  const [milestones, setMilestones] = useState(null);

  useEffect(() => {
    console.log("in profile");
    console.log("fetching token...");

    // Define an async function inside the effect
    const fetchToken = async () => {
      try {
        const asyncToken = await AsyncStorage.getItem("@auth_token");
        setToken(asyncToken);
        console.log("token is: ", asyncToken);

        if (asyncToken) {
          // Decode the token directly
          const decodedToken = decodeJWT(asyncToken);
          console.log("decodedToken: ", decodedToken);

          // Fetch user info using the decoded token's subject (sub)
          const userInfo = await findUserByUserId(decodedToken.sub);
          console.log("user info: ", userInfo);
          setUserData(userInfo);
          setUsername(userInfo.username);
          setUserID(userInfo.id);
        } else {
          console.error("No token found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error fetching token on Profile Page: ", error);
      }
    };

    fetchToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const getUserMilestones = async () => {
        if (!userID) return;
        console.log("Fetching user favorites for userID:", userID);

        try {
          const userMilestoneData = await getMilestonesByUserId(userID);
          console.log("getMilestonesByUserId returned: ", userMilestoneData);
          setMilestones(userMilestoneData);
        } catch (error) {
          console.log("Error getting milestones: ", error);
        }
      };

      getUserMilestones();
    }, [userID]) // Dependencies, runs when userID changes
  );

  if (!milestones) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#027bff" />
        <Text style={styles.loadingText}>Loading milestones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Milestones</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📏</Text>
            <Text style={styles.cardText}>Total Distance</Text>
            <Text style={styles.cardValue}>
              {milestones.totalDistance} kilometers
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏞️</Text>
            <Text style={styles.cardText}>National Parks Visited</Text>
            <Text style={styles.cardValue}>
              {milestones.nationalParksVisited}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🌲</Text>
            <Text style={styles.cardText}>Unique Trails</Text>
            <Text style={styles.cardValue}>{milestones.uniqueTrails}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🥾 </Text>
            <Text style={styles.cardText}>Total Hikes</Text>
            <Text style={styles.cardValue}>{milestones.totalHikes}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⛰️</Text>
            <Text style={styles.cardText}>Total Elevation Gain</Text>
            <Text style={styles.cardValue}>
              {milestones.totalElevationGain} meters
            </Text>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: "#1c1c1e",
    paddingTop: "10%",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: scaledFontSize(24),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: "5%",
  },
  cardContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap", // Wrap cards to the next row
    justifyContent: "space-evenly", // Equal spacing between cards
    alignItems: "center",
    paddingHorizontal: 10, // Add horizontal padding
  },
  card: {
    width: "45%", // Ensure two cards fit side-by-side
    height: 150, // Fixed height for all cards
    backgroundColor: "#2c2c2e",
    padding: 15,
    marginVertical: 10, // Vertical spacing between rows
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: scaledFontSize(40),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  cardText: {
    fontSize: scaledFontSize(16), // Slightly smaller font
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center", // Center-align the text horizontally
    flexWrap: "wrap", // Allow wrapping to the next line
    maxWidth: "90%", // Ensure text does not exceed card width
    alignSelf: "center", // Center within the card
  },
  cardValue: {
    fontSize: scaledFontSize(20),
    color: "#027bff",
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: scaledFontSize(18),
    color: "#aaa",
    textAlign: "center",
    marginTop: "50%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
  },
});

export default Milestones;
