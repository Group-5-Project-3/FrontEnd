import axios from 'axios';

// CheckinController

// GET check-ins by user ID
export const getAllBadges = async () => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/badges`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching check-ins by user ID:", error);
        throw error;
    }
};