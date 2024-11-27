import axios from 'axios';

const API_BASE_URL = 'https://cst438project3-6ec60cdacb89.herokuapp.com/api/trail-images';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`, // Token from localStorage
    },
});


export const getImagesByTrailId = async (trailId) => {
    try {
        const response = await apiClient.get(`/trail/${trailId}`);
        return response.data; // List of trail images
    } catch (error) {
        console.error('Error fetching images by trail ID:', error.response?.data || error.message);
        throw error;
    }
};

export const getImagesByUserId = async (userId) => {
    try {
        const response = await apiClient.get(`/user/${userId}`);
        return response.data; // List of user-uploaded images
    } catch (error) {
        console.error('Error fetching images by user ID:', error.response?.data || error.message);
        throw error;
    }
};

export const uploadTrailImage = async (file, trailId, userId, description) => {
    try {
        const formData = new FormData();
        formData.append('file', file); // The uploaded file
        formData.append('trailId', trailId); // The trail ID
        formData.append('userId', userId); // The user ID
        formData.append('description', description); // Image description

        const response = await apiClient.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Required for file uploads
            },
        });

        return response.data; // Uploaded trail image data
    } catch (error) {
        console.error('Error uploading trail image:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteTrailImage = async (id) => {
    try {
        const response = await apiClient.delete(`/${id}`);
        return response.status === 204; // Returns true if deleted successfully
    } catch (error) {
        console.error('Error deleting trail image:', error.response?.data || error.message);
        throw error;
    }
};
