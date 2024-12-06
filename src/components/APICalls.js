import axios from 'axios';

// Function to get nearby parks
export const getNearbyParks = async (latitude, longitude, radius = 5000, type = 'park', keyword = 'hiking') => {
    const url = `https://cst438project3-6ec60cdacb89.herokuapp.com/places?latitude=${latitude}&longitude=${longitude}&radius=${radius}&type=${type}&keyword=${keyword}`;

    console.log(latitude, longitude);
    console.log(url);

    try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('auth_token');

        console.log(token);

        if (!token) {
            throw new Error('No token found');
        }

        // Make the API call with the token in the headers
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`, // Add the token as a bearer token
            },
        });

        console.log(response);

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
};

// Function to fetch photo URL
export const fetchPhotoUrl = async (photoReference, apiKey) => {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/photo';
    const maxwidth = 400;
    const url = `${baseUrl}?maxwidth=${maxwidth}&photoreference=${photoReference}&key=${apiKey}`;
    return url;
};


