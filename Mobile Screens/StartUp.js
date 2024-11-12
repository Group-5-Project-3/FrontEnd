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
import React, { useState, createContext, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, register } from "../APICalls";
import { AuthContext } from "./AuthContext";
import { useNavigation } from "@react-navigation/native";

const StartUp = () => {
  const [modalSignInVisible, setSignModalVisible] = useState(false);
  const [modalCreateAccVisible, setCreateAccModalVisible] = useState(false);
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
    //alert("sign in pressed. Username: " + username + " Password: " + password);

    try {
      const token = await login(username, password);
      if (token) {
        //alert("putting async...");
        await AsyncStorage.setItem("@auth_token", token);
        await AsyncStorage.setItem("@username", username);
        setIsLoggedIn(true); // Update context state
        //navigation.navigate("WebScreen");
        setSignModalVisible(false);
        navigation.navigate("MobileScreen");
        //alert("success");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid username or password");
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Call the register function with user data
      const userData = { username, email, password };
      const response = await register(userData);

      if (response) {
        setCreateAccModalVisible(false);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        alert("Sign up successful");
        // Optionally store the username in AsyncStorage or navigate directly
        //navigation.navigate('Login');
      } else {
        alert("Sign up failed");
      }
    } catch (e) {
      console.error("Failed to save user data", e);
      alert("An error occurred during sign up");
    }
  };

  const loginToSignUp = () => {
    setSignModalVisible(false);
    setCreateAccModalVisible(true);
  };

  const signUpToLogin = () => {
    setCreateAccModalVisible(false);
    setSignModalVisible(true);
  };

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
          <Text style={styles.bottomViewText}>Login</Text>
        </Pressable>

        <Pressable
          style={styles.bottomViewButton}
          onPress={() => setCreateAccModalVisible(true)}
        >
          <Text style={styles.bottomViewText}>Sign Up</Text>
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
              <Text style={styles.modalBackText}>Cancel</Text>
            </Pressable>
          </View>

          <Text style={styles.modalTitleText}>Login</Text>

          <SafeAreaView style={styles.inputContainer}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={username}
              onChangeText={setUsername}
            />

            <View style={styles.lineSeprator}></View>

            <TextInput
              placeholder="Password"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}

              //   value={user.password}
            />
          </SafeAreaView>
          <Pressable style={styles.modalActionButton} onPress={handleLogin}>
            <Text style={styles.bottomViewText}>Login</Text>
          </Pressable>

          <Pressable onPress={loginToSignUp}>
            <Text style={styles.modalBackText}>
              Don't have an account? Sign up
            </Text>
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
              <Text style={styles.modalBackText}>Cancel</Text>
            </Pressable>
          </View>
          <Text style={styles.modalTitleText}>Sign Up</Text>

          <SafeAreaView style={styles.inputContainer}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={username}
              onChangeText={setUsername}
            />

            <View style={styles.lineSeprator}></View>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#bfbfbf"
              secureTextEntry={true}
              style={styles.inputText}
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.lineSeprator}></View>

            <TextInput
              placeholder="Password"
              placeholderTextColor="#bfbfbf"
              secureTextEntry={true}
              style={styles.inputText}
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.lineSeprator}></View>

            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#bfbfbf"
              secureTextEntry={true}
              style={styles.inputText}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </SafeAreaView>
          <Pressable style={styles.modalActionButton} onPress={handleSignup}>
            <Text style={styles.bottomViewText}>Sign Up</Text>
          </Pressable>

          <Pressable onPress={signUpToLogin}>
            <Text style={styles.modalBackText}>
              Already have an account? Login
            </Text>
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
