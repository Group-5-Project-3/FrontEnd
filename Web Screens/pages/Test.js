import React, { useState, useContext } from 'react';
import { Box, HStack, VStack, Text, Button, Divider, Pressable, ScrollView, Avatar } from 'native-base';
import { AuthContext } from '../AuthContext';
import { editName, editEmail, editUsername, editUserAvatar, deleteAccount, changePassword } from '../components/SettingsActions';
import { Alert } from 'react-native';


const Setting = () => {
  const [selectedCategory, setSelectedCategory] = useState('Account');
  const { isLoggedIn, user, loading } = useContext(AuthContext); // Get login status and loading state

  // Log the user object each time the component re-renders
  // console.log('User:', user);

  // Categories and sections for the settings sidebar
  const categories = [
    'Account',
    'Notifications',
    'About',
    'Log Out',
  ];

  // Handlers for each setting action
  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'Account':
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
                  <Text fontSize="xl" fontWeight="bold" color="white">{user.firstName} {user.lastName}</Text>
                  <HStack alignItems="center" space={2}>
                    <Text color="gray.400">@{user.username}</Text>
                  </HStack>
                </VStack>
                <Button colorScheme="blue" size="sm" ml="auto">Edit User Profile</Button>
              </HStack>
            </Box>

            {/* User Info Section */}
            <Box bg="gray.700" borderRadius="lg" p={4}>
              <VStack space={4}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text color="gray.400" fontSize="xs">FULL NAME</Text>
                    <Text color="white" fontSize="md">{user.firstName} {user.lastName}</Text>
                  </VStack>
                  <Button size="sm" colorScheme="gray" onPress={editName}>Edit</Button>
                </HStack>

                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text color="gray.400" fontSize="xs">USERNAME</Text>
                    <Text color="white" fontSize="md">{user.username}</Text>
                  </VStack>
                  <Button size="sm" colorScheme="gray" onPress={editUsername}>Edit</Button>
                </HStack>

                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text color="gray.400" fontSize="xs">EMAIL</Text>
                    <Text color="white" fontSize="md">{user.email}</Text>
                  </VStack>
                  <Button size="sm" colorScheme="gray" onPress={editEmail}>Edit</Button>
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
      case 'Notifications':
        return (
          <VStack space={4}>
            <Text fontSize="2xl" fontWeight="bold">Notification Settings</Text>
          </VStack>
        );
      case 'About':
        return (
          <VStack space={4}>
            <Text fontSize="2xl" fontWeight="bold">About</Text>
          </VStack>
        );
      case 'Log Out':
        return (
          <VStack space={4}>
            <Text fontSize="2xl" fontWeight="bold">Log Out</Text>
            {/* Additional privacy settings */}
          </VStack>
        );
      // Add other cases as needed for each category
      default:
        return <Text>Select a category</Text>;
    }
  };

  return (
    <HStack flex={1} w="100%" bg="gray.100">
      {/* Sidebar */}
      <VStack w="20%" h="100%" p={4} space={4} bg="gray.900">
        <Text fontSize="xl" color="white" fontWeight="bold">Settings</Text>
        {categories.map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            bg={selectedCategory === category ? 'gray.700' : 'transparent'}
            py={2} px={4} rounded="md"
          >
            <Text color="white" fontSize="md">{category}</Text>
          </Pressable>
        ))}
      </VStack>

      {/* Main Content Area */}
      <Box flex={1} p={4}>
        <ScrollView>
          {renderCategoryContent()}
        </ScrollView>
      </Box>
    </HStack>

  );
};

export default Setting;
