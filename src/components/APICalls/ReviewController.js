import axios from 'axios';
// ReviewsControllers

// Fetch reviews for a specific trail by trailId
export const getTrailReviews = async (trailId) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/reviews/trail/${trailId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching trail reviews:", error.response?.data || error.message);
        throw error;
    }
};

// Fetch reviews for a specific user by userId
export const getUserReviews = async (userId) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/reviews/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user reviews:", error.response?.data || error.message);
        throw error;
    }
};

// Create a new review
export const createReview = async (review) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.post("https://cst438project3-6ec60cdacb89.herokuapp.com/api/reviews", review, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating review:", error.response?.data || error.message);
        throw error;
    }
};

// Update an existing review by id
export const updateReview = async (id, review) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.put(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/reviews/${id}`, review, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating review:", error.response?.data || error.message);
        throw error;
    }
};

// Delete a review by id
export const deleteReview = async (id) => {
    try {
        const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage

        const response = await axios.delete(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/reviews/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });
        if (response.status === 204) {
            return true; // Successfully deleted
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error("Review not found:", error.response.data || error.message);
        } else {
            console.error("Error deleting review:", error.response?.data || error.message);
        }
        throw error;
    }
};
