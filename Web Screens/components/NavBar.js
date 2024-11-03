import React from 'react';
import { Box, HStack, Text, Button, useBreakpointValue } from 'native-base';
import { useNavigation } from '@react-navigation/native';

function NavBar() {
  const navigation = useNavigation();
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  return (
    <Box bg="dark.700" px={4} py={3} w="100%">
      <HStack space={4} alignItems="center" justifyContent="space-between">
        <Text
          color="white"
          fontSize="lg"
          fontWeight="bold"
          onPress={() => navigation.navigate('WebScreen')} // Use 'WebScreen' if that's the intended home screen
        >
          My Map App
        </Text>
        <HStack space={3}>
          <Button
            variant="ghost"
            colorScheme="light"
            size={buttonSize}
            onPress={() => navigation.navigate('WebScreen')} // Match the screen name here
          >
            Home
          </Button>
          <Button
            variant="ghost"
            colorScheme="light"
            size={buttonSize}
            onPress={() => navigation.navigate('Trails')} // Ensure this matches the 'Trails' screen in the navigator
          >
            Trails
          </Button>
          <Button
            variant="ghost"
            colorScheme="light"
            size={buttonSize}
            onPress={() => navigation.navigate('Settings')} // Ensure this matches the 'Trails' screen in the navigator
          >
            Settings
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

export default NavBar;
