// Setting.js

import React, { useState, useContext } from 'react';
import { Box, HStack, VStack, Text, Pressable, ScrollView } from 'native-base';
import { AuthContext } from '../AuthContext';
import AccountSettings from '../components/settings/AccountSetting';

const Setting = () => {
  const [selectedCategory, setSelectedCategory] = useState('Account');
  const { user } = useContext(AuthContext);

  const categories = ['Account', 'Notifications', 'About', 'Log Out'];

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'Account':
        return <AccountSettings user={user} />;
      case 'Notifications':
        return <Text fontSize="2xl" fontWeight="bold">Notification Settings</Text>;
      case 'About':
        return <Text fontSize="2xl" fontWeight="bold">About</Text>;
      case 'Log Out':
        return <Text fontSize="2xl" fontWeight="bold">Log Out</Text>;
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
