import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Pressable,
  ImageBackground,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native";

const StartUp = () => {
  const [modalSignInVisible, setSignModalVisible] = useState(false);
  const [modalCreateAccVisible, setCreateAccModalVisible] = useState(false);

  return (
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

        <Pressable
          style={styles.bottomViewButton}
          onPress={() => setSignModalVisible(true)}
        >
          <Text style={styles.bottomViewText}>Log In</Text>
        </Pressable>

        <Pressable
          style={styles.bottomViewButton}
          onPress={() => setCreateAccModalVisible(true)}
        >
          <Text style={styles.bottomViewText}>Create Account</Text>
        </Pressable>

        <Pressable style={styles.bottomViewButton}>
          <Text style={styles.bottomViewText}>Use Google</Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSignInVisible}
        onRequestClose={() => setSignModalVisible(false)}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalTopContainer}>
            <Pressable onPress={() => setSignModalVisible(false)}>
              <Text style={styles.modalBackText}>Back</Text>
            </Pressable>
            <View style={styles.modalCenterContainer}>
              <Text style={styles.modalTitleText}>Log In</Text>
            </View>
          </View>

          <SafeAreaView style={styles.inputContainer}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              //   value={user.username}
            />

            <View style={styles.lineSeprator}></View>

            <TextInput
              placeholder="Password"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              secureTextEntry={true}

              //   value={user.password}
            />
          </SafeAreaView>
          <Pressable style={styles.modalActionButton}>
            <Text style={styles.bottomViewText}>Sign In</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCreateAccVisible}
        onRequestClose={() => setCreateAccModalVisible(false)}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalTopContainer}>
            <Pressable onPress={() => setCreateAccModalVisible(false)}>
              <Text style={styles.modalBackText}>Back</Text>
            </Pressable>
            <View style={styles.modalCenterContainer}>
              <Text style={styles.modalTitleText}>Create Account</Text>
            </View>
          </View>

          <SafeAreaView style={styles.inputContainer}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              //   value={user.username}
            />

            <View style={styles.lineSeprator}></View>

            <TextInput
              placeholder="Password"
              placeholderTextColor="#bfbfbf"
              secureTextEntry={true}
              style={styles.inputText}
              //   value={user.password}
            />

            <View style={styles.lineSeprator}></View>

            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#bfbfbf"
              secureTextEntry={true}
              style={styles.inputText}
              //   value={user.password}
            />
          </SafeAreaView>
          <Pressable style={styles.modalActionButton}>
            <Text style={styles.bottomViewText}>Create Account</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </ImageBackground>
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
    backgroundColor: "#0fa726",
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
  modalTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: width * 0.05,
    marginTop: width * 0.08,
  },
  modalCenterContainer: {
    position: "absolute",
    left: "45%",
    // transform: [{ translateX: -width * 0.25 }],
  },
  modalTitleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: scaledFontSize(24),
  },
  modalBackText: {
    color: "white",
    fontWeight: "bold",
    fontSize: scaledFontSize(15),
  },
  inputContainer: {
    marginTop: height * 0.05,
    width: 300,
    backgroundColor: "#404040",
    borderRadius: 10,
    padding: width * 0.03,
    marginVertical: 10,
    //alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  lineSeprator: {
    height: 3,
    backgroundColor: "#505050",
    marginVertical: 10,
  },
  lineSepratorWelcome: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 10, // Optional spacing above and below
  },
  inputText: {
    color: "white",
  },
  modalActionButton: {
    backgroundColor: "#0fa726",
    width: "75%",
    height: "8%",
    borderRadius: scale * 30,
    alignItems: "center",
    justifyContent: "center",
    margin: height / 100, // Vertical spacing
  },
});

export default StartUp;
