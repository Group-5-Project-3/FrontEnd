import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJWT } from "./components/utils/utils";
import {
  findUserByUserId,
  getAllBadges,
  getBadgesByUserId,
  getMilestonesByUserId,
} from "../APICalls";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

const Milestones = () => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState(null);
  const [milestones, setMilestones] = useState(null);
  const [allBadges, setAllBadges] = useState(null);
  const [userBadges, setUserBadges] = useState(null);

  const isBadgeAwarded = (badgeId) => {
    return userBadges?.some((userBadge) => userBadge.badgeId === badgeId);
  };

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
          const userBadgesInfo = await getBadgesByUserId(userInfo.id);
          setUserBadges(userBadgesInfo);
          console.log("UserBadges: ", userBadgesInfo);
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

          const allBadgesData = await getAllBadges();
          console.log("allBadgesData: ", allBadgesData);
          setAllBadges(allBadgesData);
        } catch (error) {
          console.log("Error getting milestones or badges: ", error);
        }
      };

      getUserMilestones();
    }, [userID]) // Dependencies, runs when userID changes
  );

  if (!milestones || !allBadges) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#027bff" />
        <Text style={styles.loadingText}>Loading Milestones & Badges...</Text>
      </View>
    );
  }

  // Group badges by type
  const badgeGroups = allBadges.reduce((groups, badge) => {
    if (!groups[badge.type]) {
      groups[badge.type] = [];
    }
    groups[badge.type].push(badge);
    return groups;
  }, {});

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Milestones</Text>
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
          <Text style={styles.cardTitle}>🥾</Text>
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✔️</Text>
          <Text style={styles.cardText}>Total Check-ins</Text>
          <Text style={styles.cardValue}>{milestones.totalCheckIn}</Text>
        </View>
      </View>

      <Text style={styles.title}>Badges</Text>
      {Object.entries(badgeGroups).map(([type, badges]) => (
        <View key={type} style={styles.badgeSection}>
          <Text style={styles.sectionTitle}>
            {type.replace("_", " ").toUpperCase()}
          </Text>
          <View style={styles.badgeContainer}>
            {badges.map((badge) => (
              <View
                key={badge.badgeId}
                style={[
                  styles.badgeCard,
                  { opacity: isBadgeAwarded(badge.badgeId) ? 1 : 0.3 }, // Adjust opacity
                ]}
              >
                <Image
                  source={{ uri: badge.badgeUrl }}
                  style={styles.badgeImage}
                />
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeCriteria}>{badge.criteria}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
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
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
    marginTop: "20%",
  },
  milestonesContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  milestoneText: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 5,
  },
  badgeSection: {
    marginBottom: 20,
    alignItems: "center", // Centers the entire badge section
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#027bff",
    marginBottom: 10,
    textAlign: "center", // Ensures the title is centered
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // Centers badges in the row
    gap: 8, // Adds spacing between badges
  },
  badgeCard: {
    width: "42%", // Slightly narrower to fit better
    backgroundColor: "#2c2c2e",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5, // Horizontal spacing between cards
    marginBottom: 10, // Vertical spacing between rows
    alignItems: "center",
  },
  badgeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  badgeCriteria: {
    fontSize: 12,
    color: "#aaa",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
  },
  loadingText: {
    fontSize: 18,
    color: "#aaa",
    marginTop: 10,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow cards to wrap to the next row
    justifyContent: "space-evenly", // Ensure even spacing between cards
    marginVertical: 20,
  },
  card: {
    width: "45%", // Two cards per row
    backgroundColor: "#2c2c2e",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10, // Add space between rows
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Add shadow for Android
  },
  cardTitle: {
    fontSize: 40,
    color: "#fff",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  cardValue: {
    fontSize: 18,
    color: "#027bff",
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default Milestones;
