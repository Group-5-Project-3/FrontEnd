import React, { useState } from 'react';
import { Box, HStack, VStack, Text, Button, Divider, Pressable, ScrollView } from 'native-base';

const Setting = () => {
  const [selectedCategory, setSelectedCategory] = useState('Account');

  // Categories and sections for the settings sidebar
  const categories = [
    'Account',
    'Notifications',
    'Privacy & Security',
    'Appearance',
    'Language',
    'About',
  ];

  // Handlers for each setting action
  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'Account':
        return (
          <VStack space={4}>
            <Text fontSize="2xl" fontWeight="bold">Account Settings</Text>
            <Button colorScheme="blue">Change Name</Button>
            <Button colorScheme="blue">Change Email</Button>
            <Button colorScheme="blue">Profile Picture URL</Button>
            <Button colorScheme="blue">Change Username</Button>
            <Button colorScheme="blue">Change Password</Button>
            <Button colorScheme="red">Delete Account</Button>
          </VStack>
        );
      case 'Notifications':
        return (
          <VStack space={4}>
            <Text fontSize="2xl" fontWeight="bold">Notification Settings</Text>
            {/* Additional notification settings */}
          </VStack>
        );
      case 'Privacy & Security':
        return (
          <VStack space={4}>
            <Text fontSize="2xl" fontWeight="bold">Privacy & Security</Text>
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
      <VStack w="30%" h="100%" p={4} space={4} bg="gray.900">
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
