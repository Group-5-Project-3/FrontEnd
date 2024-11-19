import axios from 'axios';

// Get all trails
export const getAllTrails = async () => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.get("https://cst438project3-6ec60cdacb89.herokuapp.com/api/trails", {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching trails:', error);
        throw error;
    }
};

// Get a trail by ID
export const getTrailById = async (id) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/trails/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching trail with ID ${id}:`, error);
        throw error;
    }
};

// Get a trail by places ID
export const getTrailByPlacesId = async (placesId) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/trails/places/${placesId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching trail with places ID ${placesId}:`, error);
        throw error;
    }
};

// Create a new trail
export const createTrail = async (trail) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.post("https://cst438project3-6ec60cdacb89.herokuapp.com/api/trails", trail, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating trail:', error);
        throw error;
    }
};

// Update a trail by ID
export const updateTrail = async (id, trail) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.put(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/trails/${id}`, trail, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating trail with ID ${id}:`, error);
        throw error;
    }
};

// Delete a trail by ID
export const deleteTrail = async (id) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.delete(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/trails/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.status === 204; // No Content status
    } catch (error) {
        console.error(`Error deleting trail with ID ${id}:`, error);
        throw error;
    }
};
