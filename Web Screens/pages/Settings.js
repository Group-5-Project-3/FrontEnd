import React, { useContext } from 'react';
import { Box, Button, Text } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext'; // Ensure the path is correct

const Settings = ({ navigation }) => {
  const { setIsLoggedIn } = useContext(AuthContext); // Get the context function

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@username');
      await AsyncStorage.removeItem('@auth_token');
      setIsLoggedIn(false); // Update the context state to false
      navigation.navigate('Login'); // Navigate to the Login screen after logging out
    } catch (e) {
      console.error('Failed to remove the data from storage');
    }
  };

  return (
    <Box p={4} flex={1} justifyContent="center">
      <Text fontSize="xl" mb={4}>Settings</Text>
      <Button onPress={handleLogout}>Logout</Button>
    </Box>
  );
};

export default Settings;
