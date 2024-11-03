import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Login function
export const login = async (username, password) => {
    try {
        const response = await axios.post('https://cst438project3-6ec60cdacb89.herokuapp.com/api/auth/login', {
            username,
            password,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Save the token to AsyncStorage
        const token = response.data.token;
        if (token) {
            await AsyncStorage.setItem('authToken', token);
        }
        return token;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

// Register function
export const register = async (userData) => {
    try {
        const response = await axios.post('https://cst438project3-6ec60cdacb89.herokuapp.com/api/auth/register', userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('User registered successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

// Find User ID by username function
export const findUserIdByUsername = async (username) => {
    try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/users/username/${username}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // Use token if the endpoint requires authentication
            }
        });
        return response.data; // This should be the user ID
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('User not found');
        } else {
            console.error('Error fetching user ID:', error);
        }
        throw error;
    }
};