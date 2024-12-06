import React, { useContext } from "react";
import { AuthContext } from "../../AuthContext";
// import { updateUser as updatedUserAPI } from '../'
import {
  updateUser as updatedUserAPI,
  uploadProfilePicture,
} from "../APICalls/UserController";
import { verifyPassword } from '../APICalls/UserController';
import { getProfilePicture } from "../APICalls/UserController";

const useSettingsActions = () => {
  const { user, updateUser, logout } = useContext(AuthContext);

  const editName = async (newFirstName, newLastName) => {
    try {
      await updatedUserAPI(user.sub, {
        firstName: newFirstName,
        lastName: newLastName,
      });

      // Update the user state in the context
      updateUser({ firstName: newFirstName, lastName: newLastName });
      console.log("User name updated:", user.sub);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const editUsername = async (newUsername) => {
    try {
      await updatedUserAPI(user.sub, { username: newUsername });

      // Update the user state in the context
      updateUser({ username: newUsername });
      console.log("Username updated:", user.sub);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const editEmail = async (newEmail) => {
    try {
      await updatedUserAPI(user.sub, { email: newEmail });

      // Update the user state in the context
      updateUser({ email: newEmail });
      console.log("Email updated:", user.sub);
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const changePassword = async (newPassword) => {
    console.log(newPassword)
    alert("Change Password functionality goes here.");
  };

  const deleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      try {
        // await deleteAccountAPI(user.id); // Create this API function
        alert("Account deleted successfully!");
        logout(); // Log the user out after deletion
      } catch (err) {
        alert("Error deleting account: " + err.message);
      }
    }
  };

  const editUserAvatar = async (userId, file) => {
    await uploadProfilePicture(userId, file);
    const url = await getProfilePicture(userId);
    updateUser({ profilePictureUrl: url });
    alert("Edit Avatar functionality goes here.");
  };

  return {
    editName,
    editUsername,
    editEmail,
    changePassword,
    deleteAccount,
    editUserAvatar,
  };
};

export default useSettingsActions;
