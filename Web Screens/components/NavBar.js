import React from 'react';
import { Box, HStack, Text, Button, useBreakpointValue } from 'native-base';
import { useNavigation } from '@react-navigation/native';

function NavBar() {
  const navigation = useNavigation();
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  return (
    <Box bg="black" px={4} py={3} w="100%">
      <HStack space={4} alignItems="center" justifyContent="space-between">
        <Text
          color="white"
          fontSize="lg"
          fontWeight="bold"
          onPress={() => navigation.navigate('WebScreen')} // Use 'WebScreen' if that's the intended home screen
        >
          TrailBlazer
        </Text>
        <HStack space={3}>
          <Button
            variant="ghost"
            colorScheme="light"
            size={buttonSize}
            onPress={() => navigation.navigate('WebScreen')} // Match the screen name here
            _text={{ color: "white" }} // Set button text color to white
            _hover={{ bg: "#008001" }} // Change background color on hover
          >
            Home
          </Button>
          <Button
            variant="ghost"
            colorScheme="light"
            size={buttonSize}
            onPress={() => navigation.navigate('Trails')} // Ensure this matches the 'Trails' screen in the navigator
            _text={{ color: "white" }} // Set button text color to white
            _hover={{ bg: "#008001" }} // Change background color on hover
          >
            Trails
          </Button>
          <Button
            variant="ghost"
            colorScheme="light"
            size={buttonSize}
            onPress={() => navigation.navigate('Favorite')} // Ensure this matches the 'Trails' screen in the navigator
            _text={{ color: "white" }} // Set button text color to white
            _hover={{ bg: "#008001" }} // Change background color on hover
          >
            Favorite
          </Button>
          <Button
            variant="ghost"
            colorScheme="light"
            size={buttonSize}
            onPress={() => navigation.navigate('Milestone')} // Ensure this matches the 'Trails' screen in the navigator
            _text={{ color: "white" }} // Set button text color to white
            _hover={{ bg: "#008001" }} // Change background color on hover
          >
            Milestone
          </Button>
          <Button
            variant="ghost"
            colorScheme="light"
            size={buttonSize}
            onPress={() => navigation.navigate('Settings')}
            _text={{ color: "white" }} // Set button text color to white
            _hover={{ bg: "#008001" }} // Change background color on hover
          >
            Settings
          </Button>
          <Button
            variant="ghost"
            colorScheme="light"
            size={buttonSize}
            onPress={() => navigation.navigate('Test')}
            _text={{ color: "white" }} // Set button text color to white
            _hover={{ bg: "#008001" }} // Change background color on hover
          >
            Test
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

export default NavBar;
