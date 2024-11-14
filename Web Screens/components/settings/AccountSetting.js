import React, { useState } from 'react';
import { Box, HStack, VStack, Text, Button, Avatar, Input } from 'native-base';
import useSettingsActions from './SettingsActions';

const AccountSettings = ({ user }) => {
  const { editName, editUsername, editEmail, editUserAvatar, changePassword, deleteAccount } = useSettingsActions();

  const [isEditingName, setIsEditingName] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState(user.firstName);
  const [lastNameInput, setLastNameInput] = useState(user.lastName);

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user.username);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(user.email);

  const handleSaveName = () => {
    editName(firstNameInput, lastNameInput);
    setIsEditingName(false);
  };

  const handleCancelEditName = () => {
    setFirstNameInput(user.firstName);
    setLastNameInput(user.lastName);
    setIsEditingName(false);
  };

  const handleSaveUsername = () => {
    editUsername(usernameInput);
    setIsEditingUsername(false);
  };

  const handleCancelEditUsername = () => {
    setUsernameInput(user.username);
    setIsEditingUsername(false);
  };

  const handleSaveEmail = () => {
    editEmail(emailInput);
    setIsEditingEmail(false);
  };

  const handleCancelEditEmail = () => {
    setEmailInput(user.email);
    setIsEditingEmail(false);
  };

  return (
    <VStack space={3}>
      <Box flex={1} bg="gray.800" p={4}>
        {/* Header with Avatar and Profile Info */}
        <Box bg="green.700" borderRadius="lg" p={4} mb={4}>
          <HStack alignItems="center" space={4}>
            <Avatar
              size="xl"
              source={{
                uri: 'https://example.com/avatar.jpg', // Replace with user's avatar URL
              }}
            />
            <VStack>
              <Text fontSize="xl" fontWeight="bold" color="white">
                {user.firstName} {user.lastName}
              </Text>
              <HStack alignItems="center" space={2}>
                <Text color="gray.400">@{user.username}</Text>
              </HStack>
            </VStack>
            <Button colorScheme="blue" size="sm" ml="auto" onPress={editUserAvatar}>Edit User Image</Button>
          </HStack>
        </Box>

        {/* User Info Section */}
        <Box bg="gray.700" borderRadius="lg" p={4}>
          <VStack space={4}>
            {/* Full Name Section */}
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <Text color="gray.400" fontSize="xs">FULL NAME</Text>
                {isEditingName ? (
                  <VStack space={2}>
                    <Input
                      color="white"
                      fontSize="md"
                      placeholder="First Name"
                      value={firstNameInput}
                      onChangeText={setFirstNameInput}
                      autoFocus
                    />
                    <Input
                      color="white"
                      fontSize="md"
                      placeholder="Last Name"
                      value={lastNameInput}
                      onChangeText={setLastNameInput}
                    />
                  </VStack>
                ) : (
                  <Text color="white" fontSize="md">{firstNameInput} {lastNameInput}</Text>
                )}
              </VStack>
              {isEditingName ? (
                <HStack space={2}>
                  <Button size="sm" colorScheme="blue" onPress={handleSaveName}>Save</Button>
                  <Button size="sm" colorScheme="gray" onPress={handleCancelEditName}>Cancel</Button>
                </HStack>
              ) : (
                <Button size="sm" colorScheme="gray" onPress={() => setIsEditingName(true)}>Edit</Button>
              )}
            </HStack>

            {/* Username Section */}
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <Text color="gray.400" fontSize="xs">USERNAME</Text>
                {isEditingUsername ? (
                  <Input
                    color="white"
                    fontSize="md"
                    placeholder="Username"
                    value={usernameInput}
                    onChangeText={setUsernameInput}
                    autoFocus
                  />
                ) : (
                  <Text color="white" fontSize="md">{usernameInput}</Text>
                )}
              </VStack>
              {isEditingUsername ? (
                <HStack space={2}>
                  <Button size="sm" colorScheme="blue" onPress={handleSaveUsername}>Save</Button>
                  <Button size="sm" colorScheme="gray" onPress={handleCancelEditUsername}>Cancel</Button>
                </HStack>
              ) : (
                <Button size="sm" colorScheme="gray" onPress={() => setIsEditingUsername(true)}>Edit</Button>
              )}
            </HStack>

            {/* Email Section */}
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <Text color="gray.400" fontSize="xs">EMAIL</Text>
                {isEditingEmail ? (
                  <Input
                    color="white"
                    fontSize="md"
                    placeholder="Email"
                    value={emailInput}
                    onChangeText={setEmailInput}
                    autoFocus
                  />
                ) : (
                  <Text color="white" fontSize="md">{emailInput}</Text>
                )}
              </VStack>
              {isEditingEmail ? (
                <HStack space={2}>
                  <Button size="sm" colorScheme="blue" onPress={handleSaveEmail}>Save</Button>
                  <Button size="sm" colorScheme="gray" onPress={handleCancelEditEmail}>Cancel</Button>
                </HStack>
              ) : (
                <Button size="sm" colorScheme="gray" onPress={() => setIsEditingEmail(true)}>Edit</Button>
              )}
            </HStack>
          </VStack>
        </Box>
      </Box>

      <HStack space={4}>
        <Button onPress={() => alert("Test Alert", "This alert should appear")}> Change Password </Button>
        <Button onPress={deleteAccount}> Delete Account </Button>
      </HStack>
    </VStack>
  );
};

export default AccountSettings;
