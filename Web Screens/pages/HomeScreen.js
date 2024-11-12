import React, { useState, useContext } from 'react';
import { Box, Input, Button, Text, VStack, HStack, Image } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../APICalls';
import { AuthContext } from '../AuthContext';
import { Dimensions, StyleSheet } from 'react-native';
import LoginForm from '../components/LoginForm';
import CreateAccountForm from '../components/CreateAccountForm';
import GoogleLoginForm from '../components/GoogleLoginForm';

const HomeScreen = ({ navigation }) => {
  const [selectedForm, setSelectedForm] = useState(null);
  const windowHeight = Dimensions.get('window').height;


  return (

    <HStack flex={1}>
      <Box flex={1} bg="primary.300" alignItems="center" justifyContent="center">
      <Image
          source={{ uri: '../../assets/Forest.webp' }}
          alt="Background"
          style={[styles.backgroundImage, { height: windowHeight }]}
          resizeMode="cover"
        />
        <Box style={styles.overlay}>
          <Image
            source={require('../../assets/TrailBlazerTransparent.png')} 
            alt="Logo"
            style={{ width: 500, height: 500 }} // Set custom dimensions
            mb={4}
          />
        </Box>
      </Box>
      <Box flex={1} bg="black" alignItems="center" justifyContent="center">
        <Box mr={8} p={4} bg="black" rounded="lg" width="40%" alignItems="center">
          <Text color="white" fontSize="2xl" mb={4}>Welcome</Text>

          {selectedForm === 'login' && (
            <LoginForm setSelectedForm={setSelectedForm} />
          )}
          
          {selectedForm === 'createAccount' && (
            <CreateAccountForm setSelectedForm={setSelectedForm} />
          )}
          
          {selectedForm === 'google' && (
            <GoogleLoginForm setSelectedForm={setSelectedForm} />
          )}

          {!selectedForm && (
            <VStack space={4} width="80%">
              <Button bg="#008001" _pressed={{ bg: '#006400' }} onPress={() => setSelectedForm('login')}>
                Log In
              </Button>
              <Button bg="#008001" _pressed={{ bg: '#006400' }} onPress={() => setSelectedForm('createAccount')}>
                Create Account
              </Button>
              <Button bg="#008001" _pressed={{ bg: '#006400' }} onPress={() => setSelectedForm('google')}>
                Use Google
              </Button>
            </VStack>
          )}
        </Box>
      </Box>
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DFF0D8', // light green as a base color
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
