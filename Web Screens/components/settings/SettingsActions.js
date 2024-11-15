import React, { useContext, useState } from 'react';
import { AuthContext } from '../../AuthContext';
import { updateUser as updatedUserAPI } from '../../../APICalls';

const useSettingsActions = () => {
    const { user } = useContext(AuthContext);
  
    const editName = async (newFirstName, newLastName) => {
      // updatedUserAPI(user.sub, {firstName: newFirstName, lastName: newLastName});
      try {
        const response = await updateUserAPI(user.sub, { firstName: newFirstName, lastName: newLastName });
        updateUser({ firstName: newFirstName, lastName: newLastName }); // Update context if successful
        console.log("User name updated:", user?.sub);
      } catch (error) {
        alert("Update Failed", error.message);
      }

    };
  
    const editUsername = (newUsername) => {
      updateUser(user.sub, { username: newUsername });
      console.log("Edit user profile clicked", user?.sub);
    };
  
    const editEmail = (newEmail) => {
      updateUser(user.sub, { email: newEmail });
      console.log("Edit user editEmail clicked", user?.sub);
    };
  
    const changePassword = (newPassword) => {
      alert("Change Password", "This is where you'd change the password.");
    };
  
    const deleteAccount = () => {
      console.log("Delete Account button clicked", user?.sub);
      alert("Delete Account", "Account deleted.");
    };
  
    const editUserAvatar = (newImage) => {
      alert("Edit Avatar", "This is where you'd change the avatar.");
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