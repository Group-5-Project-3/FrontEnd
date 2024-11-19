import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
// import { updateUser as updatedUserAPI } from '../'
import { updateUser as updatedUserAPI } from '../APICalls/UserController';

const useSettingsActions = () => {
  const { user } = useContext(AuthContext);

  const editName = async (newFirstName, newLastName) => {
    try {
      await updatedUserAPI(user.sub, { firstName: newFirstName, lastName: newLastName });
      console.log('User name updated:', user.sub);
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  const editUsername = async (newUsername) => {
    try {
      await updatedUserAPI(user.sub, { username: newUsername });
      console.log('Username updated:', user.sub);
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  const editEmail = async (newEmail) => {
    try {
      await updatedUserAPI(user.sub, { email: newEmail });
      console.log('Email updated:', user.sub);
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  const changePassword = () => {
    alert('Change Password functionality goes here.');
  };

  const deleteAccount = () => {
    alert('Delete Account functionality goes here.');
  };

  const editUserAvatar = () => {
    alert('Edit Avatar functionality goes here.');
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
