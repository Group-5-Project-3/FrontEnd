import React, { useContext, useState } from 'react';
import { Box, VStack, HStack, Text, Switch, Button, Divider, AlertDialog, Input, Modal } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext'; // Ensure the path is correct

const Settings = ({ navigation }) => {
  const { setIsLoggedIn } = useContext(AuthContext); // Get the context function

  // State to handle switches and modals
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const cancelRef = React.useRef(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@username');
      await AsyncStorage.removeItem('@auth_token');
      setIsLoggedIn(false); // Update the context state to false
      navigation.navigate('Home'); // Navigate to the Login screen after logging out
    } catch (e) {
      console.error('Failed to remove the data from storage');
    }
  };

  const handleDeleteAccount = () => {
    setIsAlertOpen(false);
    // Add logic to delete the account
    alert('Account deleted');
  };

  const handleChangeUsername = async () => {
    try {
      if (newUsername) {
        await AsyncStorage.setItem('@username', newUsername);
        alert(`Username changed to ${newUsername}`);
        setIsUsernameModalOpen(false);
      } else {
        alert('Please enter a new username');
      }
    } catch (e) {
      console.error('Failed to change the username');
    }
  };

  return (
    <Box safeArea p="4" flex={1} bg={isDarkMode ? 'gray.800' : 'white'}>
      <VStack space={4}>
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Settings
        </Text>

        {/* Notifications Toggle */}
        <HStack alignItems="center" justifyContent="space-between">
          <Text fontSize="lg">Enable Notifications</Text>
          <Switch
            isChecked={isNotificationsEnabled}
            onToggle={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
          />
        </HStack>
        <Divider />

        {/* Dark Mode Toggle */}
        <HStack alignItems="center" justifyContent="space-between">
          <Text fontSize="lg">Dark Mode</Text>
          <Switch
            isChecked={isDarkMode}
            onToggle={() => setIsDarkMode(!isDarkMode)}
          />
        </HStack>
        <Divider />

        {/* Account Section */}
        <VStack space={3} mt="4">
          <Text fontSize="lg" fontWeight="bold">Account</Text>

          <Button colorScheme="blue" onPress={() => alert('Change Password')}>
            Change Password
          </Button>

          <Button colorScheme="teal" onPress={() => setIsUsernameModalOpen(true)}>
            Change Username
          </Button>

          {/* Delete Account Button */}
          <Button colorScheme="red" onPress={() => setIsAlertOpen(true)}>
            Delete Account
          </Button>

          {/* Logout Button */}
          <Button colorScheme="orange" onPress={handleLogout}>
            Logout
          </Button>
        </VStack>
      </VStack>

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.Header>Delete Account</AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure you want to delete your account? This action cannot be undone.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button ref={cancelRef} onPress={() => setIsAlertOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onPress={handleDeleteAccount} ml={3}>
              Delete
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>


      {/* Modal for Changing Username */}
      <Modal isOpen={isUsernameModalOpen} onClose={() => setIsUsernameModalOpen(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Change Username</Modal.Header>
          <Modal.Body>
            <Input
              placeholder="Enter new username"
              value={newUsername}
              onChangeText={(text) => setNewUsername(text)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => setIsUsernameModalOpen(false)}>
                Cancel
              </Button>
              <Button onPress={handleChangeUsername}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default Settings;
