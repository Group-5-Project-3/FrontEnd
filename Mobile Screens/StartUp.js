import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import React from "react";

const StartUp = () => {
  return (
    //<View style={styles.container}>
    <ImageBackground
      source={require("../assets/green-white-background.png")}
      style={styles.imageBckground}
    >
      <Image
        source={require("../assets/TrailBlazerTransparent.png")}
        style={styles.imageActual}
      />

      <View style={styles.bottomViewContainer}>
        <Text style={styles.bottomViewTitle}>Welcome</Text>

        <Pressable style={styles.bottomViewButton}>
          <Text style={styles.bottomViewText}>Log In</Text>
        </Pressable>

        <Pressable style={styles.bottomViewButton}>
          <Text style={styles.bottomViewText}>Create Account</Text>
        </Pressable>

        <Pressable style={styles.bottomViewButton}>
          <Text style={styles.bottomViewText}>Use Google</Text>
        </Pressable>
      </View>
    </ImageBackground>
    //</View>
  );
};

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const scale = width / 375;
const scaledFontSize = (size) => size * scale;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  imageBckground: {
    flex: 1,
    resizeMode: "cover", // or 'contain'
    justifyContent: "center", // Adjust as needed
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imageActual: {
    width: width,
    height: height * 0.5,
    // backgroundColor: "gray",
    marginBottom: width * 0.5,
  },
  bottomViewContainer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    width: width,
    height: height * 0.3,
    backgroundColor: "black",
    borderTopLeftRadius: width * 0.1,
    borderTopRightRadius: width * 0.1,
    padding: "5%",
  },
  bottomViewButton: {
    backgroundColor: "##004602",
    width: "80%",
    height: "20%",
    borderRadius: scale * 20,
    alignItems: "center",
    justifyContent: "center",
    margin: height / 100, // Vertical spacing
  },
  bottomViewTitle: {
    fontWeight: "bold",
    color: "white",
    fontSize: scaledFontSize(24),
    marginBottom: width * 0.02,
  },
  bottomViewText: {
    color: "white",
    fontSize: scaledFontSize(20),
    fontWeight: "bold",
  },
});

export default StartUp;
