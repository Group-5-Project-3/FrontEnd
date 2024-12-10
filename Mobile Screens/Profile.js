import { View, Text, Image, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJWT } from "./components/utils/utils";
import {
  findUserByUserId,
  updateUser,
  uploadProfilePicture,
} from "../APICalls";
import { Dimensions } from "react-native";
import { Modal } from "react-native";
import { SafeAreaView } from "react-native";
import { TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "./AuthContext";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userID, setUserID] = useState(null);
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [userFirst, setUserFirst] = useState("");
  const [userLast, setUserLast] = useState("");
  const [editFirst, setEditFirst] = useState("");
  const [editLast, setEditLast] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [email, setEmail] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [editUserName, setEditUsername] = useState("");

  const [passwordModal, setPasswordModal] = useState(false);

  const [nameModal, setNameModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [usernameModal, setUsernameModal] = useState(false);

  //   const [selectedImage, setSelectedImage] = useState(null);

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
          setUserFirst(userInfo.firstName);
          setUserLast(userInfo.lastName);
          setEditFirst(userInfo.firstName);
          setEditLast(userInfo.lastName);
          setEmail(userInfo.email);
          setNewEmail(userInfo.email);

          //   setProfilePic("../assets/blank_pfp.png");

          if (userInfo.profilePictureUrl) {
            setProfilePic(userInfo.profilePictureUrl);
          } else {
            setProfilePic(require("../assets/blank_pfp.png"));
          }
        } else {
          console.error("No token found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error fetching token on Profile Page: ", error);
      }
    };

    fetchToken();
  }, []);

  const editName = () => {
    console.log("in edit name");
    const user = {
      username: null,
      email: null,
      firstName: editFirst,
      lastName: editLast,
      password: null,
    };

    try {
      const res = updateUser(userID, user);
      console.log("updateUser response: ", res);
      setUserFirst(editFirst);
      setUserLast(editLast);
      setNameModal(false);
      alert("Name was Updated");
    } catch (error) {
      setEditFirst(userFirst);
      setEditLast(userLast);
      console.error(
        "Error when trying to update first and last names: ",
        error
      );
    }
  };

  const closeEditName = () => {
    setEditFirst(userFirst);
    setEditLast(userLast);
    setNameModal(false);
  };

  const editEmail = () => {
    console.log("in edit email");
    console.log("new email entered: ", newEmail);
    const user = {
      username: null,
      email: newEmail,
      firstName: null,
      lastName: null,
      password: null,
    };

    try {
      const res = updateUser(userID, user);
      console.log("updateUser response: ", res);
      setEmail(newEmail);
      setEmailModal(false);
      alert("Email Was Updated");
    } catch (error) {
      setEditFirst(userFirst);
      setEditLast(userLast);
      console.error("Error when trying to update email: ", error);
    }
  };

  //test;
  const closeEmailModal = () => {
    setNewEmail(email);
    setEmailModal(false);
  };

  const closePasswordModal = () => {
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordModal(false);
  };

  const closeEditUsername = () => {
    setEditUsername(username);
    setUsernameModal(false);
  };

  const handleEditUsername = () => {
    console.log("in handleEditUsername");
    console.log("new username: ", editUserName);
    const user = {
      username: editUserName,
      email: null,
      firstName: null,
      lastName: null,
      password: null,
    };

    try {
      const res = updateUser(userID, user);
      console.log("updateUser response: ", res);
      setUsername(editUserName);
      setUsernameModal(false);
      alert("Username Was Updated");
    } catch (error) {
      setEditUsername("");
      console.error("Error when trying to update username: ", error);
    }
  };

  const handleNewPassword = () => {
    console.log("in handleNewPassword");
    console.log("new pass: ", newPassword);
    console.log("confirm new pass:", confirmNewPassword);
    console.log(newPassword === confirmNewPassword);

    if (newPassword === confirmNewPassword) {
      const user = {
        username: null,
        email: null,
        firstName: null,
        lastName: null,
        password: newPassword,
      };

      try {
        const res = updateUser(userID, user);
        console.log("updateUser response: ", res);
        setNewPassword("");
        setConfirmNewPassword("");
        setPasswordModal(false);
        alert("Password Was Updated");
      } catch (error) {
        setNewPassword("");
        setConfirmNewPassword("");
        console.error("Error when trying to update password: ", error);
      }
    } else {
      alert("Passwords Do Not Match");
    }
  };

  const openEditUsername = () => {
    setEditUsername(username);
    setUsernameModal(true);
  };

  const pickImage = async () => {
    console.log("in pickImage");
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("after image picker...");
      console.log("picked image info: ", result);

      if (!result.canceled) {
        const selectedImage = result.assets[0]; // Get the selected image details
        console.log("Selected Image: ", selectedImage);

        // Call the upload function
        await uploadProfilePicture(
          {
            uri: selectedImage.uri,
            name: selectedImage.fileName || "uploaded_image.jpg",
            type: selectedImage.type || "image/jpeg",
          },
          userID // Pass the user ID
        );
      } else {
        console.log("Image picker canceled.");
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      alert("Failed to upload the image. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      // Remove the stored token and any other related data
      await AsyncStorage.removeItem("@auth_token");
      await AsyncStorage.removeItem("@username");

      setIsLoggedIn(false); // Update auth context
      navigation.navigate("StartUp"); // Navigate to Home screen
      alert("You have been logged out.");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomContainer}>
        <View style={styles.flexContainer}>
          <View style={styles.flexContainer}>
            <Text style={styles.fullNameText}>
              {userFirst} {userLast}
            </Text>
            <Text style={styles.usernameText}>@{username}</Text>
          </View>
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require("../assets/blank_pfp.png")
            }
            style={styles.imageStyle}
          />

          <Pressable style={styles.editAviButton} onPress={pickImage}>
            <Text style={styles.editButtonText}>Edit Avatar</Text>
          </Pressable>
        </View>

        <View style={styles.line}></View>
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionLabel}>Full Name</Text>
            <Text style={styles.sectionValue}>
              {userFirst} {userLast}
            </Text>
          </View>
          <Pressable
            style={styles.editButton}
            onPress={() => setNameModal(true)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionLabel}>Username</Text>
            <Text style={styles.sectionValue}>@{username}</Text>
          </View>
          <Pressable style={styles.editButton} onPress={openEditUsername}>
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionLabel}>Email</Text>
            <Text style={styles.sectionValue}>
              {email || "example@email.com"}
            </Text>
          </View>
          <Pressable
            style={styles.editButton}
            onPress={() => setEmailModal(true)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionLabel}>Password</Text>
            <Text style={styles.sectionValue}>●●●●●●●●</Text>
          </View>
          <Pressable
            style={styles.editButton}
            onPress={() => setPasswordModal(true)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.sectionButton} marginTop={"2%"}>
          <Pressable
            style={[styles.fullButton, styles.deleteButton]}
            onPress={handleLogout}
          >
            <Text style={styles.fullButtonText}>Log Out</Text>
          </Pressable>

          <View style={styles.sectionButton}>
            <Pressable style={[styles.fullButton, styles.deleteButton]}>
              <Text style={styles.fullButtonText}>Delete Account</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={nameModal}
        onRequestClose={() => setNameModal(false)}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalTopContainer}>
            <Pressable onPress={closeEditName}>
              <Text style={styles.modalBackText}>Cancel</Text>
            </Pressable>
          </View>
          <Text style={styles.modalTitleText}>Edit Name</Text>

          <SafeAreaView style={styles.inputContainer}>
            <Text style={styles.placeholderText}>First Name</Text>
            <TextInput
              //   placeholder="First Name"
              //   placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={editFirst}
              onChangeText={setEditFirst}
              autoCapitalize="none"
            />

            <View style={styles.lineSeprator}></View>

            <Text style={styles.placeholderText}>Last Name</Text>
            <TextInput
              //   placeholder="Last Name"
              //   placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={editLast}
              onChangeText={setEditLast}
              autoCapitalize="none"
            />
          </SafeAreaView>
          <Pressable style={styles.modalActionButton} onPress={editName}>
            <Text style={styles.bottomViewText}>Change</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={emailModal}
        onRequestClose={() => setEmailModal(false)}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalTopContainer}>
            <Pressable onPress={closeEmailModal}>
              <Text style={styles.modalBackText}>Cancel</Text>
            </Pressable>
          </View>
          <Text style={styles.modalTitleText}>Edit Email</Text>

          <SafeAreaView style={styles.inputContainer} height={"8%"}>
            <Text style={styles.placeholderText}>Email</Text>
            <TextInput
              //   placeholder="First Name"
              //   placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={newEmail}
              onChangeText={setNewEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </SafeAreaView>
          <Pressable style={styles.modalActionButton} onPress={editEmail}>
            <Text style={styles.bottomViewText}>Change</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModal}
        onRequestClose={() => setPasswordModal(false)}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalTopContainer}>
            <Pressable onPress={closePasswordModal}>
              <Text style={styles.modalBackText}>Cancel</Text>
            </Pressable>
          </View>
          <Text style={styles.modalTitleText}>Change Password</Text>

          <SafeAreaView style={styles.inputContainer}>
            <Text style={styles.placeholderText}>New Password</Text>
            <TextInput
              //   placeholder="First Name"
              //   placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
            />

            <View style={styles.lineSeprator}></View>

            <Text style={styles.placeholderText}>Confirm Password</Text>
            <TextInput
              //   placeholder="First Name"
              //   placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              autoCapitalize="none"
            />
          </SafeAreaView>

          <Pressable
            style={styles.modalActionButton}
            onPress={handleNewPassword}
          >
            <Text style={styles.bottomViewText}>Change</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={usernameModal}
        onRequestClose={() => setUsernameModal(false)}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalTopContainer}>
            <Pressable onPress={closeEditUsername}>
              <Text style={styles.modalBackText}>Cancel</Text>
            </Pressable>
          </View>
          <Text style={styles.modalTitleText}>Edit Username</Text>

          <SafeAreaView style={styles.inputContainer} height={"8%"}>
            <Text style={styles.placeholderText}>Username</Text>
            <TextInput
              //   placeholder="First Name"
              //   placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={editUserName}
              onChangeText={setEditUsername}
              autoCapitalize="none"
            />
          </SafeAreaView>
          <Pressable
            style={styles.modalActionButton}
            onPress={handleEditUsername}
          >
            <Text style={styles.bottomViewText}>Change</Text>
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
    alignItems: "center",
    backgroundColor: "#1c4332",
    // paddingTop: "20%",

    width: "100%",
    height: "100%",
  },
  topContainer: {
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#2c6a4f",
    marginTop: "20%",
    width: "70%",
    height: "30%",
    borderRadius: "15%",
    // flexDirection: "row",
  },
  bottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#2c6a4f",
    marginTop: "15%",
    paddingBottom: "10%",
    width: "90%",
    height: "90%",
    borderRadius: "15%",
  },
  fullNameText: {
    color: "white",
    fontWeight: "bold",
    fontSize: scaledFontSize(20),
    marginTop: "5%",
  },
  usernameText: {
    color: "white",
    // fontWeight: "bold",
    fontSize: scaledFontSize(14),
  },
  imageStyle: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.5,
    // borderWidth: 3,
    // borderColor: "white",
    marginTop: 10,
  },
  flexContainer: {
    flexDirection: "column",
    margin: "20",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#a8dadc",
    paddingVertical: "5%",
    paddingHorizontal: "12%", // Horizontal padding
    borderRadius: 10, // Rounded corners
    marginTop: "3%", // Space above the button
    marginBottom: "5%",
    alignItems: "center", // Center text
  },
  editAviButton: {
    backgroundColor: "#a8dadc",
    paddingVertical: "4%",
    paddingHorizontal: "4%", // Horizontal padding
    borderRadius: 10, // Rounded corners
    marginTop: "3%", // Space above the button
    marginBottom: "5%",
    alignItems: "center", // Center text
  },
  editButtonText: {
    color: "black",
    fontSize: "15%", // White text color
    // fontSize: scaledFontSize(16), // Scaled font size
  },
  section: {
    flexDirection: "row", // Row layout for label and button
    justifyContent: "space-between", // Space between text and button
    alignItems: "center", // Align items vertically
    paddingVertical: 10, // Vertical padding for section
    paddingHorizontal: 15, // Horizontal padding
    borderBottomWidth: 1, // Divider between sections
    borderBottomColor: "#ccc", // Light gray divider
  },
  sectionContent: {
    flexDirection: "column", // Stack label and value
    flex: 1, // Take up remaining space
  },
  sectionLabel: {
    color: "#a8dadc",
    fontSize: scaledFontSize(20),
    fontWeight: "bold",
  },
  sectionValue: {
    color: "white",
    fontSize: scaledFontSize(16),
  },
  sectionButton: {
    paddingVertical: "10", // Vertical padding for button sections
    alignItems: "center", // Center the buttons
  },
  fullButton: {
    backgroundColor: "#4CAF50", // Green button
    paddingVertical: "5%",
    paddingHorizontal: "10%",
    borderRadius: "10%",
  },
  fullButtonText: {
    color: "white",
    fontSize: scaledFontSize(16),
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#e63946", // Red button for delete
    marginTop: "5%",
  },
  line: {
    height: 1, // Thin line
    width: "100%", // Span most of the container's width
    backgroundColor: "#ccc", // Set the line color
    marginVertical: 10, // Add spacing above and below the line
    alignSelf: "center", // Center the line horizontally
  },
  modalBackground: {
    alignItems: "center",
    alignContent: "center",
    padding: width * 0.05,
    flex: 1,
    backgroundColor: "black",
    borderTopStartRadius: scale * 20,
    borderTopEndRadius: scale * 20,
    marginTop: width * 0.2,
  },
  modalTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: width * 0.05,
    marginTop: width * 0.08,
  },
  modalBackText: {
    color: "white",
    fontWeight: "bold",
    fontSize: scaledFontSize(15),
  },
  inputContainer: {
    marginTop: height * 0.01,
    width: "65%",
    height: "15%",
    backgroundColor: "#404040",
    borderRadius: 10,
    padding: width * 0.5,
    marginVertical: 10,
    //alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingHorizontal: 15, // Add padding inside container
    paddingVertical: 10, // Optional vertical padding
  },
  inputText: {
    color: "white",
    // paddingHorizontal: 15, // Add horizontal padding
    // paddingVertical: 5, // Add vertical padding
    marginTop: "2%",
  },
  lineSeprator: {
    height: 3,
    backgroundColor: "#505050",
    marginVertical: 10,
  },
  modalActionButton: {
    backgroundColor: "#0fa726",
    width: "60%",
    height: "8%",
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
  modalTitleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: scaledFontSize(24),
  },
  placeholderText: {
    color: "gray",
    fontStyle: "italic",
  },
});

export default Profile;
