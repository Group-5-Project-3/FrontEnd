import axios from 'axios';

// CheckinController

// GET check-ins by user ID
export const getCheckInsByUserId = async (userId) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/checkins/user/${userId}`, {
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

// GET check-ins by trail ID
export const getCheckInsByTrailId = async (trailId) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/checkins/trail/${trailId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching check-ins by trail ID:", error);
        throw error;
    }
};

// POST create a new check-in
export const createCheckIn = async (checkInData) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.post("https://cst438project3-6ec60cdacb89.herokuapp.com/api/checkins", checkInData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating check-in:", error);
        throw error;
    }
};

// DELETE a check-in by ID
export const deleteCheckIn = async (id) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.delete(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/checkins/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data; // Modify based on the API's delete response
    } catch (error) {
        console.error("Error deleting check-in:", error);
        throw error;
    }
};
