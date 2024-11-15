import React, { useState, useContext } from 'react';
import { VStack, Input, Button } from 'native-base';
import { AuthContext } from '../../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../../APICalls';
import { useNavigation } from '@react-navigation/native';

export default function LoginForm({ setSelectedForm }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn, loginUser } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const token = await login(username, password);

            if (token) {
                // Update login state and user information in AuthContext
                await loginUser(token, username);

                // Navigate to WebScreen
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
        <VStack space={4} width="80%">
            <Input
                placeholder="Username"
                variant="filled"
                bg="white"
                mb={2}
                _focus={{ borderColor: '#008001', color: 'white' }}
                value={username}
                onChangeText={setUsername}
            />
            <Input
                placeholder="Password"
                variant="filled"
                bg="white"
                type="password"
                _focus={{ borderColor: '#008001', color: 'white' }}
                value={password}
                onChangeText={setPassword}
            />
            <Button bg="#008001" _pressed={{ bg: '#006400' }} onPress={handleLogin}>
                Submit
            </Button>
            <Button variant="link" onPress={() => setSelectedForm(null)}>
                Back
            </Button>
        </VStack>
    );
}
