import React, { useState, useContext } from 'react';
import { Box, Input, Button, Text } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../APICalls';
import { AuthContext } from '../AuthContext';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const token = await login(username, password);
      if (token) {
        await AsyncStorage.setItem('@auth_token', token);
        await AsyncStorage.setItem('@username', username);
        setIsLoggedIn(true); // Update context state
        navigation.navigate('WebScreen');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid username or password');
    }
  };

  return (
    <Box p={4} flex={1} justifyContent="center">
      <Text fontSize="2xl" mb={4}>Login</Text>
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        mb={2}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChangeText={setPassword}
        mb={4}
      />
      <Button onPress={handleLogin} mb={2}>Login</Button>
      <Button variant="link" onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Sign up
      </Button>
    </Box>
  );
};

export default LoginScreen;
