import React, { useState } from 'react';
import { VStack, Input, Button } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { register } from '../../APICalls';

export default function CreateAccountForm({ setSelectedForm }) {
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
                setSelectedForm(null);
            } else {
                alert('Sign up failed');
            }
        } catch (e) {
            console.error('Failed to save user data', e);
            alert('An error occurred during sign up');
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
                onChangeText={setUsername}
            />
            <Input
                placeholder="Email"
                variant="filled"
                bg="white"
                mb={2}
                _focus={{ borderColor: '#008001', color: 'white' }}
                onChangeText={setEmail}
            />
            <Input
                placeholder="Password"
                variant="filled"
                bg="white"
                type="password"
                _focus={{ borderColor: '#008001', color: 'white' }}
                onChangeText={setPassword}
            />
            <Input
                placeholder="Confirm Password"
                variant="filled"
                bg="white"
                type="password"
                _focus={{ borderColor: '#008001', color: 'white' }}
                onChangeText={setConfirmPassword}
            />
            <Button bg="#008001" _pressed={{ bg: '#006400' }} onPress={handleSignup} type="button">
                Submit
            </Button>
            <Button variant="link" onPress={() => setSelectedForm(null)}>
                Back
            </Button>
        </VStack>
    );
}
