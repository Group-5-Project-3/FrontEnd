import React, { useContext, useState } from 'react';
import { Alert } from 'react-native';


// Function to handle profile editing
export const editName = () => {
    // Your logic here
    console.log("Edit user editName clicked");
};

// Function to handle profile editing
export const editUsername = () => {
    // Your logic here
    console.log("Edit user profile clicked");
};

// Function to handle profile editing
export const editEmail = () => {
    // Your logic here
    console.log("Edit user editEmail clicked");
};


// Function to handle password change
export const changePassword = () => {
    // Your logic here
    Alert.alert("Change Password", "This is where you'd change the password.");
};

// Function to handle account deletion
export const deleteAccount = () => {
    // Your logic here
    console.log("Delete Account button clicked");
    Alert.alert("Delete Account", "Account deleted.");
};

// Function to handle account deletion
export const editUserAvatar = () => {
    // Your logic here
    Alert.alert("Delete Account", "Account deleted.");
};