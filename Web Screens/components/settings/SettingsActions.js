import React, { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../../AuthContext';
import { updateUser } from '../../../APICalls';

const useSettingsActions = () => {
    const { user } = useContext(AuthContext);
  
    const editName = (newFirstName, newLastName) => {
      updateUser(user.sub, {firstName: newFirstName, lastName: newLastName});
      console.log("Edit user editName clicked", user?.sub);
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
      Alert.alert("Change Password", "This is where you'd change the password.");
    };
  
    const deleteAccount = () => {
      console.log("Delete Account button clicked", user?.sub);
      Alert.alert("Delete Account", "Account deleted.");
    };
  
    const editUserAvatar = (newImage) => {
      Alert.alert("Edit Avatar", "This is where you'd change the avatar.");
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