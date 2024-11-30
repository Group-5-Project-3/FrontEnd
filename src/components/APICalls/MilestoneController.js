import axios from 'axios';

// GET milestones by user ID
export const getMilestonesByUserId = async (userId) => {
    try {
        const token = localStorage.getItem('auth_token');

        const response = await axios.get(`https://cst438project3-6ec60cdacb89.herokuapp.com/api/milestones/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching milestones by user ID:", error.response?.data || error.message);
        throw error;
    }
};