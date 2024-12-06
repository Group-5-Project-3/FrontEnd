import React, { useEffect, useState, useContext } from "react";
// import { getTrailByPlacesId, createTrail } from '../../APICalls';
import { getTrailByPlacesId, createTrail } from "./APICalls/TrailController";
import axios from "axios";

export function decodeJWT(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
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
    // If the trail is not found (403), create it
    if (error.response && error.response.status === 403) {
      console.log(
        `Trail with place_id ${place_id} not found. Creating a new trail.`
      );
      const newTrail = {
        placesId: place_id,
        name: place.name,
        location: place.vicinity,
        description: "New review",
      };
      // MIGHT CAUSE ERROR IF NEW TRAIL IS CREATE AND DOES NOT HAVE IMAGE FIELD
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
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance; // Returns the distance in meters
};

export const sortBadges = (badges) => {
  // Helper function to sort based on numeric criteria
  const sortByCriteria = (array) => {
    return array.sort((a, b) => {
      const numA = parseInt(a.criteria.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.criteria.match(/\d+/)?.[0] || "0", 10);
      return numA - numB;
    });
  };

  // Group and sort badges
  const NATIONAL_PARKS = badges.filter(
    (item) => item.type === "NATIONAL_PARKS"
  );
  const DISTANCE = sortByCriteria(
    badges.filter((item) => item.type === "DISTANCE")
  );
  const ELEVATION = sortByCriteria(
    badges.filter((item) => item.type === "ELEVATION")
  );
  const TOTAL_HIKES = sortByCriteria(
    badges.filter((item) => item.type === "TOTAL_HIKES")
  );

  // Combine all groups into one array
  const badge = [...NATIONAL_PARKS, ...DISTANCE, ...ELEVATION, ...TOTAL_HIKES];

  return badge;
};

/**
 * Fetches the latitude and longitude of a given address.
 * @param {string} address - The address to geocode.
 * @returns {Promise<object>} - A promise that resolves to the coordinates { lat, lng }.
 * @throws {Error} - Throws an error if the API call fails or returns a status other than "OK".
 */
export const getCoordinates = async (address) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Google Maps API key is missing. Check your .env.local file."
    );
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.results[0].geometry.location;
    } else {
      throw new Error(`Geocoding API error: ${response.data.status}`);
    }
  } catch (error) {
    throw new Error(`Error fetching coordinates: ${error.message}`);
  }
};
