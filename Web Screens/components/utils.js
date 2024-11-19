import React, { useEffect, useState, useContext } from 'react';
import { getTrailByPlacesId, createTrail } from '../../APICalls';

export function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}

const isTokenExpired = (decodedToken) => {
    const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
    return decodedToken.exp < currentTime;
};

export async function checkIfTrailExist(place_id, place) {
    try {
        // Await the result of getTrailByPlacesId
        const trail = await getTrailByPlacesId(place_id);
        return trail; // Return the resolved trail object
    } catch (error) {
        // If the trail is not found (404), create it
        if (error.response && error.response.status === 404) {
            console.log(`Trail with place_id ${place_id} not found. Creating a new trail.`);
            const newTrail = {
                placesId: place_id,
                name: place.name,
                location: place.vicinity,
                description: "New review",
            };
            return await createTrail(newTrail); // Call the createTrail function to add it to the database
        }
        // For any other errors, log and re-throw
        console.error("An unexpected error occurred:", error.message);
        throw error;
    }
}

// Utility function to calculate distance in meters between two points
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371000; // Radius of the Earth in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Returns the distance in meters
};