import axios from 'axios';

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
        // Save the token to localStorage
        const token = response.data.token;
        if (token) {
            localStorage.setItem('auth_token', token);
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
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

// Find User ID by username function
export const findUserByUserId = async (id) => {
    try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/users/${id}`, {
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

// Update user function
export const updateUser = async (id, { username, email, firstName, lastName, password }) => {
    const body = {};
    if (username !== undefined) body.username = username;
    if (email !== undefined) body.email = email;
    if (firstName !== undefined) body.firstName = firstName;
    if (lastName !== undefined) body.lastName = lastName;
    if (password !== undefined) body.password = password;

    if (Object.keys(body).length === 0) {
        throw new Error("At least one field must be provided to update.");
    }

    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.put(
            `https://cst438project3-6ec60cdacb89.herokuapp.com/api/users/${id}`,
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add the token as a bearer token
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update user');
    }
};

// Find User ID by username function
export const deleteUserById = async (id) => {
    try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        const response = await axios.delete(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/users/${id}`, {
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

export const uploadProfilePicture = async (userId, file) => {
    try {
        // Create a FormData object to handle the file upload
        const formData = new FormData();
        formData.append('file', file); // Match backend's expectation

        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        // Make the POST request
        const response = await axios.post(
            `https://cst438project3-6ec60cdacb89.herokuapp.com/api/users/${userId}/profile-picture`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type
                    Authorization: `Bearer ${token}`, // Add the token as a bearer token
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error uploading profile picture:', error.response?.data || error.message);
        throw error; // Re-throw error for handling in caller function
    }
};


export const verifyPassword = async (userId, password) => {
    const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage
    try {
        const response = await axios.post(
            `https://cst438project3-6ec60cdacb89.herokuapp.com/api/users/verify-password/${userId}`,
            password, // Send password directly as the raw string
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add the token as a bearer token
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error during password verification:', error);
        throw error;
    }
};


export const getProfilePicture = async (userId) => {
    const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

    try {
        const response = await axios.get(
            `https://cst438project3-6ec60cdacb89.herokuapp.com/api/users/${userId}/profile-picture`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Add authorization header if needed
                },
            }
        );
        return response.data; // Return the profile picture URL
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        throw error;
    }
};
