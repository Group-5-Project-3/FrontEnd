import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJWT } from "./components/utils/utils";
import { findUserByUserId, getFavoriteTrailsByUserId } from "../APICalls";
import { FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const Favorites = () => {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState(null);
  const [userID, setUserID] = useState(null);
  const [token, setToken] = useState(null);
  const [favArr, setFavArr] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
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
        console.error("Error fetching token on Favorites Page: ", error);
      }
    };

    fetchToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const getUserFavs = async () => {
        if (!userID) return; // Prevent calling API without a valid userID
        console.log("Fetching user favorites for userID:", userID);

        try {
          const userFavArr = await getFavoriteTrailsByUserId(userID);
          console.log("getFavoriteTrailsByUserId returned: ", userFavArr);
          setFavArr(userFavArr);
        } catch (error) {
          console.log("Error getting user favs: ", error);
        }
      };

      getUserFavs();
    }, [userID]) // Dependencies, runs when userID changes
  );

  const toggleFlip = (index) => {
    setFlippedCards((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const renderItem = ({ item, index }) => {
    const isFlipped = flippedCards[index];
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleFlip(index)}
        activeOpacity={0.9}
      >
        {!isFlipped ? (
          <View style={styles.cardFront}>
            <Image
              source={
                item.images && item.images[0]?.imageUrl
                  ? { uri: item.images[0].imageUrl }
                  : require("../assets/Forest.webp")
              }
              style={styles.cardImage}
              resizeMode="cover"
            />
            <Text style={styles.cardTitle}>{item.name}</Text>
          </View>
        ) : (
          <View style={styles.cardBack}>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{username}'s Favorites</Text>
      <FlatList
        data={favArr}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginTop: "10%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  listContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  card: {
    flex: 1,
    margin: 5,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardFront: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cardImage: {
    width: "100%",
    height: "70%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  cardBack: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#027bff",
    padding: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
});

export default Favorites;
