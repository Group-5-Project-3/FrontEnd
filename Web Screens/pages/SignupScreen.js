// SignupScreen.js
import React, { useState } from 'react';
import { Box, Input, Button, Text, Alert } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { register } from '../../APICalls';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Call the register function with user data
      const userData = { username, email, password };
      const response = await register(userData);


      if (response) {
        alert('Sign up successful');
        // Optionally store the username in AsyncStorage or navigate directly
        navigation.navigate('Login');
      } else {
        alert('Sign up failed');
      }
    } catch (e) {
      console.error('Failed to save user data', e);
      alert('An error occurred during sign up');
    }
  };

  return (
    <Box p={4} flex={1} justifyContent="center">
      <Text fontSize="2xl" mb={4}>Sign Up</Text>
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        mb={2}
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        mb={2}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChangeText={setPassword}
        mb={2}
      />
      <Input
        placeholder="Confirm Password"
        type="password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mb={4}
      />
      <Button onPress={handleSignup}>Sign Up</Button>
      <Button variant="link" mt={2} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Button>
    </Box>
  );
};

export default SignupScreen;
