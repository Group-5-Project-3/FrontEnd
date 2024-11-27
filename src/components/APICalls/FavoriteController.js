import axios from 'axios';
// FavoriteControllers

// GET favorite trails by user ID
export const getFavoriteTrailsByUserId = async (userId) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/favorites/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching favorite trails by user ID:", error);
        throw error;
    }
};

// POST add a new favorite trail
export const addFavoriteTrail = async (userId, trailId) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.post("https://cst438project3-6ec60cdacb89.herokuapp.com/api/favorites",
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add the token as a bearer token
                },
                params: { // Pass query parameters here
                    userId,
                    trailId,
                },
            });
        return response.data;
    } catch (error) {
        console.error("Error adding favorite trail:", error);
        throw error;
    }
};

// DELETE a favorite trail by ID
export const deleteFavoriteTrail = async (id) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.delete(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/favorites/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data; // Modify based on the API's delete response
    } catch (error) {
        console.error("Error deleting favorite trail:", error);
        throw error;
    }
};


// GET favorite trails by user ID
export const getFavoriteTrailsWithImages = async (userId) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/favorites/${userId}/with-images`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching favorite trails by user ID:", error);
        throw error;
    }
};
